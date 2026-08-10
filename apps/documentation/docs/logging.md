# Logging

The logger used by this application is a very flexible system that is composed by the following features:

1. Possibility to easily switch between 3 different types of loggers via conf: nest (default), console (legacy), pino
2. Possibility to enable specific log levels (log, error, warn etc.)

## How to use the logger

Importing the needed logger service and use it directly is possible but not suggested. The proper way to use it should be to use the dependency injection and the nest event-emitter.

The logger is imported by the nest app module using the `app-logger.factory.ts` which creates the instance of the selected logger and injects it inside the app as a provider.

The logger is finally used within the `app.service.ts` inside the event-handlers that are registered to specific events that
are dispatched by the application modules. This approach help us to follow the SOLID principles and decoupling the modules by the logger implementation.
