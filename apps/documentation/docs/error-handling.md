# Error Handling

When the application reaches a state in which it cannot continue, either because of the user's input or a known blocking state. You will need to stop the execution of the application or current flow. The easiest and cleanest way to handle this is by using Errors.

Working effectively with Errors is an important part of coding a well-built tool. Errors allow to stop the execution flow of certain operations, while keeping functions clean, by avoiding unnecessary side-effects like returning error messages or confusing status codes.

Additionally, handling errors in a good way allow the application to control the flow of the application and log errors correctly. An application that has good error propapagation, is simpler as it avoid polluting the code with too many **try-catch** statements, while informing the consumers or users using the application of what it's happening with the application.

### Good practices

Taken from [JavaScript's try-catch hid my bugs](https://www.freecodecamp.org/news/javascripts-try-catch-hid-my-bugs/)

> 1. Do not litter your code with try-catch statements
> 2. Try as much as possible to catch only once in a given chain of function calls
> 3. Try and place that catch at the outermost boundary - the first function that starts the chain of function calls (bottom of the call stack)
> 4. Do not leave your catch statement empty as a way to stop your program from crashing! If you don't handle it, chances are it will lead to inconsistent state between your front end and back end. This can be dangerous and lead to a horrible user experience ?!
> 5. Do not use a catch statement only in the middle of the call stack, and not at the outer boundary. This will cause the error to get 'hidden' in the middle of your code where it isn't going to help you debug or manage data properly. Others who work with your code will find where you live and cut off your internet connection.
> 6. Catch it where you need to know, and where you can meaningfully do all the things necessary to clean things up.

Some extra recommendations:

- Use inheritance when creating errors, if there are errors related to a similar process, extend them from NestJS/common Errors/Exceptions or try to create a custom parent class to group them.

- Identify normal execution errors from unexpected errors. Normal execution errors, are errors that can happen at any moment and depend on external factors to the application (Like wrong user input or Unexistant data).

- Log the errors properly, since not all errors are created equally, notifying and logging unexpected errors critically, allows us to find an fix them faster.

- Divide concerns, if an external package/library you use throws errors. Try to catch those and re-throw new internal errors. In that way if we update that library later on, we only need to update the service that used it and not all of the code.

### Working with Errors and Custom Errors

First of all, it's important to mention that errors are the preferred option when handling edge cases and blocking states. Avoid as much as possible to return strings or custom codes. This makes the code more complex, harder to test and less portable.

And when you throw Errors, always use an Error class and not generic Error:

```typescript
// WORST: Difficult to understand and test
return -1;
return 'custom_error_message';

// BAD: cannot use typecasting and favors code duplication
throw new Error(ErrorsEnum.LOG_REQUIRED);

// GOOD: Can be handled later on by an Exception filter
throw new UnauthorizedError();
```

#### Custom Errors

To add new Custom Errors that you can reference, please to do so in the `@boxedout-libs/errors` library. In that way we keep all the errors in a single place that can be referenced in multiple parts of the application.

Additionally, always extend a NestJS Common Exception, this allows us to keep things consistent and already serve errors in GraphQL with a valid HTTP Code.

```typescript
export class UnauthorizedError extends UnauthorizedException {
  constructor() {
    super(ErrorsEnum.UNAUTHORIZED);
  }
}
```

**Note:** NestJS decided to call their `Exception` their internal errors, although we use the Error name as it's more JS/TS friendly and the name of the base class implemented in the languages.

### Exception Filters

If you handled your logic correcly, and unless there's a good reason in the application flow, **errors should bubble up** to the main execution thread, that means they're not supposed to be catched anywhere else. In that way we can report and log them in a single place.

NestJS offers out of the box [Exception Filters](https://docs.nestjs.com/exception-filters), these filters catch the configured Errors/Exceptions that propagated all the way to the main execution thread, in that way we can decide how to log them. The filters that we use are in the `@boxedout-libs/errors/filters` directory.

#### Custom Exception Filters

At the moment we have two Exception filters, that should catch most of our application. However, if you need to start handling new Errors specific to a new workflow or library, you can create new Exception filters that extend `GqlExceptionFilter`.

You can read more about these filters here in the [NestJS GraphQL Exception Filters documentation](https://docs.nestjs.com/graphql/other-features#exception-filters).

```typescript
@Catch(NormalOperationError, CriticalError)
export class NewExceptionFilter implements GqlExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    gqlHost.getType();

    switch (true) {
      case error instanceof NormalOperationError:
        Logger.log(error, ExceptionContextEnum.NEW_CUSTOM_CONTEXT);
        break;
      case error instanceof CriticalError:
        Logger.error(error, ExceptionContextEnum.NEW_CUSTOM_CONTEXT);
        break;
    }

    return error;
  }
}
```

<br /><br />
