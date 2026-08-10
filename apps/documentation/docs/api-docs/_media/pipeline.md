# Pipeline

## How it works

WIP...

### How to deploy docker image for other branches

Normally the github docker images are created for test purpose but they are only pushed
to the github repository when the pipeline runs on one of the main branches.

However, sometime it's needed to deploy a docker image for a different branch (such as for a pull request),
thus having the possibility to test the created image. For instance: when the frontend needs to test a feature
before releasing it on dev.

To do so, just go into the github panel and run a new Github Docker workflow manually. It will ask you to fill the input box
that allows you to deploy a new docker image for your feature branch, on demand.

### How to skip tests

If you need to skip the checks to jump directly to the deployment stage, you can run the workflow manually (from the github panel) and use the skipcheck input box

Please, use this flag only when it's really needed! Pipeline checks should never be skipped on PRs
