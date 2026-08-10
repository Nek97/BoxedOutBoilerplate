# Naming conventions

{/**/}

## Directory structure

We are partially following this [directory structure](https://www.azerothcore.org/directory-structure/) except for `docs` and `test` folders that are respectively outside of the `data` and `src` folders.

For the folders inside the `src/modules` and `src/common` we should keep a [Domain-driven Design (DDD) directory satructure](https://dev.to/stevescruz/domain-driven-design-ddd-file-structure-4pja)

We will split our application in different modules, contained within the `src/modules` folder. Every module should be named like a namespace (for example `monitor` contains everything related to monitoring). This module then contains at least a `dto` folder for all `*.type.ts`, `*.input.ts`, `*.entity.ts` and `*.args.ts` files, as well as a `__tests__` folder for all `*.spec.ts` files. The root folder of this module should contain all other files (`*.module.ts`, `*.service.ts`, `*.factory.ts`, `*.resolver.ts` etc.). Resulting in the following format:

```
src
    modules
        namespace
            __tests__
                namespace.type.spec.ts
                namespace.input.spec.ts
                namespace.entity.spec.ts
                namespace.args.spec.ts
                namespace-dynamic.entity.ts
                namespace.module.spec.ts
                namespace.service.spec.ts
                namespace.factory.spec.ts
                namespace.resolver.spec.ts
            dto
                namespace.type.ts
                namespace.input.ts
                namespace.entity.ts
                namespace.args.ts
                namespace-dynamic.entity.ts
            namespace.module.ts
            namespace.service.ts
            namespace.factory.ts
            namespace.resolver.ts
```

Ofcourse replace `namespace` here with the actual name of your module.

## General rules

Always put the feature in front, followed by any further specifications of this feature. For example `assetDynamic` instead of `dynamicAsset`, although the latter might sound more logical. This way we make sure that alphabetical order keeps the files belonging together next to eachother (oppossed to placing `dynamicAsset` next to `dynamicFiat` we rather have `assetDynamic` next to `assetStatic`). Also make sure to always use the singular for the sake of consistency throughout our project.
These rule applies to all naming: files, variables, classes etc.

### File names

Files should always be written in `kebab-case` and use the format `new-feature.type.ts` or `feature.type.ts` in the case of a single word.

```
user-email.entity.ts
```

### The resolver endpoint

The only place where we need to explicitly define the namespace within the function is when defining endpoints in the `*.resolver.ts` files. Since we have a single GraphQL endpoint we need to prevent conflicting names by prepending every function with it's namespace. Aside from this we apply regular variable naming rules, resulting in a `namespace_camelCase()` format.

```
ManageMonitor_getUserEmail()
```

### Classes

Classes should always be defined in `PascalCase`.

```typescript
UserEmail;
```

### Interfaces

Interfaces should always be prefixed with `I` to separate the interface from the same named class. For example `IUser`, when the class is named `User`. This `I` prefix does not affect other naming conventions, so it is fine to use a name which starts with two capital letters in the case of an Interface.

```typescript
IUserEmail;
```

### Variables

Variables should always be defined in `camelCase`.

```typescript
userEmail;
```

### Constants and enums

Constants and enums should be defined in `ALL_CAPS`.

```typescript
BEFORE_ALL_ROUTES;
```
