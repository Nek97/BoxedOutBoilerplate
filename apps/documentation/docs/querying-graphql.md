### Querying GraphQL

If we go to the [Graphql playground](http://localhost:60000/graphql/) we can try out our queries. How to do this should be evident for people experienced in [GraphQL](https://graphql.org/learn/queries/), but we will give a basic example for people to get started in case this is completely new.

Start with a `{ }` to start your query and press **Ctrl + Space** to show all possible query options, choose `getUser` and open parentheses `()`. In the parentheses we can again press **Ctrl + Space** to see which arguments we can use to request users, in this case only `ID`. We can find an ID in the database through [phpMyAdmin](http://localhost:60004/), in the boxedout->userList table.

If your database is still empty, you need to run the seed command to fill it. Connect into the container according to the explanation in the tips. Now run `npm run typeorm:reseed` to fill the database. Now you should be able to retrieve data from phpMyAdmin.

Now we need to specify return arguments for our query, open accolades `{}` again and press **Ctrl + Space** to see all options, choose a few interesting ones and execute the query.

```
query{
  ManageUser_getUser(ID: "a8de6435-4f43-46c0-b181-07377553fd3b"){
    firstName,
    lastName,
    created
  }
}
```

You will now get an unauthorized error. This is because you need a [JWT token](https://docs.nestjs.com/security/authentication#jwt-functionality). You also need a mutation instead of a query.

Open a new tab and press **Ctrl + Space**, and choose mutation, open accolades `{}` and press **Ctrl + Space** to choose login. Open parentheses `()` and choose the arguments, in this case both username and password. At the moment you can use user `super_user@test.com` and password `testtest`, finally you need to specify the return arguments, in this case Authorization. Finally execute the Mutation.

You should end up with something like:

```
mutation {
  login(
    username: "super_user@test.com",
    password: "testtest"
  ){
    Authorization
  }
}
```

To test that security of our endpoint is working correctly, you should use the correct role. This is made possible thanks to the standard in creating the user.
Rather than using the login with the \<required_role>@test.com account you need to use the required_role@test.com account, where required_role must be replaced with the role required to use the query, the password will be the same.

```
mutation {
  login(
    username: "required_role@test.com",
    password: "testtest"
  ){
    Authorization
  }
}
```

You should now use this token in the Headers of the previous tab, to authorize for all other endpoints. You do this in the `HTTP HEADERS` part at the bottom of the page in the following manner:

```
{
  "Authorization": "Bearer SOME_TOKEN.WHICH_HAS_2_DOTS.TO_DIFFERENTIATE_PARTS"
}
```

You should now see something like this as result of our previous query:

```
{
  "data": {
    "getUser": {
      "firstName": "Myah",
      "lastName": "Towne",
      "created": "2021-01-14T10:37:00.000Z"
    }
  }
}
```

#### Create mutation

Next to being able to get entries from our database, we also need to be able to insert entries into our database. We will do this through the usage of the `Create Mutation`.
In order to use the `Create Mutation` we have to call it and enter the data to be saved in the input field like below

```
input:{
  userId:"genericUserId",
  phone:"+31 6 12345679",
  status:"pending"
  }
```

Our `Create Mutation` would look something like this

```
mutation{
  ManageUser_createUserPhone(
    input:{
      userId:"genericUserId",
      phone:"+31 6 12345679",
      status:"pending"
      }
    ){
    phone
    userId
    status
    active
    timestamp
  }
}
```

Once executed, the `Mutation` will return the value of the newly created entity.

```
{
  "data": {
    "ManageUser_createUserPhone": {
      "phone": "+31 6 12345679",
      "userId": "genericUserId",
      "status": "pending",
      "active": 1,
      "timestamp": "2021-06-15T09:12:51.000Z"
    }
  }
}
```

#### Update mutation

After carrying out the necessary verification we have verified the phone number. Now we have to go and update the data in the database to change the status from pending to verified, this is done through usage of the `Update Mutation`

```
mutation{
  ManageUser_updateUserPhone(
    input:{
      status:"verified"
      },
    conditions:{
      userId:"genericUserId",
      phone:"+31 6 12345679",
      status:"pending"
      }
  ){
    phone,
    userId
    status
    active
    timestamp
    }
  }
```

This time the input field will have the values ​​to update the entity, to specify which entity we need to update, we must also provide it with search conditions.
In the conditions object we will specify our parameters for finding the correct entity (usually `guid`). GraphQL will then apply the parameters in the input object to that entity.
As is the case for the `Creation Mutation`, the `Update Mutation` also returns the value of the entity after the operation has succeeded.

#### Delete mutation

We should also be able to delete entries from our database, for example in the case where a phone number does not get verified and we want to delete it all together. We will do this through the usage of the `Delete Mutation`

```
mutation{
  ManageUser_deleteUserPhone(conditions:{userId:"genericUserId", phone:"+31 6 12345679"})
}
```

As is the case with the `Update Mutation`, here the conditions object is used as well to specify the search conditions of the entity to be deleted.
The result of the `Delete Mutation` will be `True` if the query is successful, otherwise an `error` will be thrown.
