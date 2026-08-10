# Application Architecture

BoxedOut Core-API is a monorepo project which include several applications developed by using a modular approach.

Our modular structure is ruled by some main concepts:

- [Loosely coupled modules](https://en.wikipedia.org/wiki/Loose_coupling)
- [Event-driven programming](https://en.wikipedia.org/wiki/Event-driven_architecture) with [Functional reactive programming](https://en.wikipedia.org/wiki/Functional_reactive_programming)
- [SOLID design principle](https://en.wikipedia.org/wiki/SOLID)
- Three-tier architecture (API Layer, Business Layer, Persistance Layer)
- [Monorepo Workspace with NestJS](https://docs.nestjs.com/cli/monorepo) (customized by BoxedOut)

## Platform Architecture

[Architecture Diagram](https://drive.google.com/file/d/1BMCbCida899dwzRiB89Jxd96WVYm7Wr5/view?usp=sharing)

Our architecture is composed by the following layers:

- **App Layer:** It's the place where you setup the application by defining the configurations and injecting the modules within the app
- **Module Layer**: where the business logic resides.
- **BoxedOut-shared Layer**: persistance modules and boxedout shared utils resides in this level. These libs are similar to the common layer but they still contain boxedout-related code, hence they have a dedicated directory.
- **Common Utils Layer**: this layer can be considered our general purpose library collection. They should not contain any business logic. These libraries can be used in any kind of NestJS/Typescript project.

### Module Structure

[Module Diagram](https://drive.google.com/file/d/1HvcvPKjXCYAWqBufsn3ds-TWbvrXilOd/view?usp=sharing)

Each NestJs module for the core-api must be composed by at least by one of these 3 layers:

- **API Layer:** composed by our resolvers and DTO Models (Data transfer objects)
- **Business Layer:** composed by our Domain Models and Services.
- **Persistance Layer:** composed by Data Models (entities), factories and data services.

A full featured module can contain all the layers above, however since we have a coupled single database instance, in our application we usually put our persistance layer separated by the API and the Business Layer thus having a more efficient way to share the Data Models.

### Directory Structure

Inspired by [DIRS 2](https://www.azerothcore.org/directory-structure/)

The changes made on top of it are:

- src at root level doesn't exist, it's replaced by app and libs
- apps and libs folders have a different meaning in our structure compared to the DIRS 2 and apps has an higher awareness level compared to libs
- deps can be considered our node_modules

Most important folders:

- **/apps** : it's the folder where the our applications are bootstrapped. We do not implement any business logic here
- **/conf** : configuration files used by the entire repository
- **/data** : can be used to store utils file and certain assets
- **/docs** : documentation files for github pages (only README.md resides outside this folder)
- **/env** : this folder contains the sources transpiled by our build process ready to be deployed/distributed. This folder is git-ignored
- **/libs** : all boxedout modules and our generic purpose libraries will be placed here. This is the most used folder
- **/test** : setup and e2e scripts for jest
- **/var** : user, temporary and dinamically generated files can be placed here. This folder is git-ignored

Other folders:

- **\_\_tests\_\_ / \_\_mocks\_\_** : these folders are used by jest for our unit tests
