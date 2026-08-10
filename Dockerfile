#
# PREPARATION
#
FROM scionproto/docker-caps as caps
FROM node:22 AS base
ARG USER_ID=1000
ARG GROUP_ID=1000

ENV DOCKER_CONTAINER=1
ENV TERM ansi

WORKDIR /opt/application/

RUN apt-get update && apt-get install -y \
      bash \
      curl \
      git \
      openssh-client \
      sudo \
      dos2unix \
      gcc \
      g++ \
      python \
      make \
      && rm -rf /var/lib/apt/lists/*

# allow node to bind the 443 port (for dev purpose)
COPY --from=caps /bin/setcap /bin
RUN setcap cap_net_bind_service=+ep /usr/local/bin/node

# we need npm 8 at least for workspace feature
RUN npm install -g npm@8.5

# Create a non-root user
RUN deluser node
RUN addgroup --gid $GROUP_ID node && \
    adduser --disabled-password --gecos '' --uid $USER_ID --gid $GROUP_ID node && \
    passwd -d node && \
    echo 'node ALL=(ALL:ALL) NOPASSWD: ALL' >> /etc/sudoers

# Correct permissions for non-root operations
RUN chown -R node:node \
    /run \
    /home/node \
    /opt/

USER node

# enable npm completition within the container shell
RUN npm completion >> ~/.bashrc

#
# DEV STAGE
#

FROM base AS prepare-dev

ARG GITHUB_TOKEN
# the id/name of the app to use for
# the production image creation
ARG APP_ID

# disable cache for below commands
# ARG CACHEBUST=1
COPY --chown=node . /opt/application

# Correct permissions for non-root operations
RUN sudo chown -R node:node /opt/

# folders that must be re-binded
RUN mkdir -p /opt/application/node_modules
RUN mkdir -p /opt/application/docs/compodoc
RUN mkdir -p /opt/application/env/dist

# install deps from all workspaces
# runs the command with the node user and passes all env to the process (-E)
RUN sudo -E su node -c 'cd /opt/application/; npm install --workspaces --include-workspace-root'

# stage for dev distribution

FROM base AS dev
COPY --from=prepare-dev  /opt/application /opt/application

RUN git config --global submodule.recurse true
RUN git config --global core.autocrlf input
RUN git config --global fetch.prune true

RUN npm run set:proj cli && npm run build
RUN npm run set:proj all && npm run build && NODE_ENV=docker APP_DRY_RUN=1 APP_DRY_RUN_NO_DB=1 npm run start:prod

#
# PRODUCTION STAGE
#

FROM public.ecr.aws/lambda/nodejs:22 AS prepare-prod

# the id/name of the app to use for
# the production image creation
ARG APP_ID
ENV DOCKER_CONTAINER=1
ARG DOCKER_ENV=production
ENV NODE_ENV=${DOCKER_ENV}
ARG STAGE=prod
ENV STAGE=${STAGE}

COPY --from=prepare-dev  /opt/application/apps ./apps
COPY --from=prepare-dev  /opt/application/libs ./libs
COPY --from=prepare-dev  /opt/application/utils ./utils
COPY --from=prepare-dev  /opt/application/env ./env
COPY --from=prepare-dev  /opt/application/node_modules ./node_modules
COPY --from=prepare-dev  /opt/application/package.json ./package.json
COPY --from=prepare-dev  /opt/application/package-lock.json ./package-lock.json
COPY --from=prepare-dev  /opt/application/.npmrc ./.npmrc
COPY --from=prepare-dev  /opt/application/nest-cli.json ./nest-cli.json
COPY --from=prepare-dev  /opt/application/tsconfig.build.json ./tsconfig.build.json
COPY --from=prepare-dev  /opt/application/tsconfig.json ./tsconfig.json
COPY --from=prepare-dev  /opt/application/tsconfig-paths-bs.js ./tsconfig-paths-bs.js

# we need npm 8 at least for workspace feature
RUN npm install -g npm@8.5

RUN yum install -y gcc gcc-c++ make git
# rebuild deps and app because of the different image
RUN npm rebuild
RUN npm run set:proj ${APP_ID}
RUN npm run build
# remove dev deps
RUN npm prune --production
# reinstall workspace dependencies (workaround, npm bug)
RUN npm install --production --workspace "apps/${APP_ID}" --workspace "libs/common" --include-workspace-root
# clean
RUN yum remove -y gcc gcc-c++ make


# used to distribute the apps locally
FROM node:22-alpine AS distribution

# the id/name of the app to use for
# the production image creation
ARG APP_ID
ENV DOCKER_CONTAINER=1
ARG DOCKER_ENV=production
ENV NODE_ENV=${DOCKER_ENV}
ARG COMMIT_SHA=0
ENV SENTRY_RELEASE=${COMMIT_SHA}

COPY --from=prepare-prod  /var/task/env ./env
COPY --from=prepare-prod  /var/task/node_modules ./node_modules
COPY --from=prepare-prod  /var/task/package.json ./package.json

WORKDIR "env/dist/apps/${APP_ID}/src/"

# dry run test to check that the app can properly run
RUN APP_DRY_RUN=1 APP_DRY_RUN_NO_DB=1 node main

CMD [ "node", "main.js" ]

# Stage for istio
FROM distribution AS distribution-istio

RUN apk add --update curl && \
    rm -rf /var/cache/apk/*

RUN curl --version

# TODO: remove once the CLI has been completely migrated
# It's used for serverless / lambda containers
FROM public.ecr.aws/lambda/nodejs:22 AS production

RUN curl -O https://lambda-insights-extension.s3-ap-northeast-1.amazonaws.com/amazon_linux/lambda-insights-extension.rpm && \
    rpm -U lambda-insights-extension.rpm && \
    rm -f lambda-insights-extension.rpm

# the id/name of the app to use for
# the production image creation
ARG APP_ID
ENV DOCKER_CONTAINER=1
ARG DOCKER_ENV=production
ARG STAGE=prod
ENV STAGE=${STAGE}
ENV NODE_ENV=${DOCKER_ENV}

COPY --from=prepare-prod  /var/task/env ./env
COPY --from=prepare-prod  /var/task/node_modules ./node_modules
COPY --from=prepare-prod  /var/task/package.json ./package.json

# dry run test to check that the app can properly run
RUN APP_DRY_RUN=1 APP_DRY_RUN_NO_DB=1 node "env/dist/apps/${APP_ID}/src/main"




