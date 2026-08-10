# Docker Configuration

The logic for building the docker container is contained within the [`docker-compose.yml`](https://github.com/boxedout/boxed-out-boilerplate/blob/dev/docker-compose.yml) file. Editing this file should be avoided, unless the building steps fundamentally change.
Configuration can be done both within as well as outside of the container. The configuration for inside of the container is done through [`.env.docker`](https://github.com/boxedout/boxed-out-boilerplate/blob/dev/conf/dist/.env.dist) and contains settings for the database, domain and verification token.
The configuration for outside of the container, in other words config for building the container, can be set in two different manners.

- Through the `docker-compose.override.yml`. Take note that this file uses the same yml format as the [`docker-compose.yml`](https://github.com/boxedout/boxed-out-boilerplate/blob/dev/docker-compose.yml) does. Therefore you should completely override a certain property. Setting environment variables is not ideal through this manner, since you need to respecify all other settings as well.
- Through an `.env` file. We created a template at [`/data/.env.docker`](https://github.com/boxedout/boxed-out-boilerplate/blob/dev/conf/dist/.env.dist), please copy this file into the root folder and rename it to `.env` . If you take a look at the [`docker-compose.yml`](https://github.com/boxedout/boxed-out-boilerplate/blob/dev/docker-compose.yml) you can see that the environment variables take priority over the default values. Therefore you can simply set these values in `.env` and they will be used by the [`docker-compose.yml`](https://github.com/boxedout/boxed-out-boilerplate/blob/dev/docker-compose.yml). If you need more configuration than what has been already prepared, please use the same format, where you give a certain env variable priority over the default value and specify your env values in the `.env` file.

## Tips

### Cleanup docker environment

If you want to reset your docker environment you can use the followin script:

`npm run docker:remove` it will remove all the images, volumes and networks created by this project

However, if you are experiencing trouble with your docker system it might be handy to do a complete prune (Only use these if you do not have any other images containers which may not be removed.)

```
sudo docker system prune -a --volumes
```

**NOTE:** Remember to recreate the needed networks for this project
