### Graphql with Ag-grid

Graphql queries that have Grid in their name support the Ag-grid format, this allows us to use very powerful tools, filters.
Filters can be used simply by adding them inside the filters field in the query data, you can test it in the [Graphql playground](http://localhost:60000/graphql/).
Small premise, a filter is applied only when the property is required in the query, if you need not to call the property you can insert it in the field map.
If you have any questions or needs, contact a programmer from the back-end team

Let's recreate the basic example, a filter that acts on a column, the following query will return a list of filtered results, the filter will check in the 'ID' column when the value 'contains' the string 'user\_'

```
query {
  ManageMonitor_getUserDynamicGrid(
    startRow: 0
    endRow: 20
    sorting: [ { colId: "ID", sort: ASC } ]
    filters: "{\"ID\":{\"filterType\":\"text\",\"type\":\"contains\",\"filter\":\"user_\"}}"
  ) {
    nodes{
      ID
      adminCommentCount
    }
  }
}
```

As you can see the filters have a "simple" structure, and are easy to read, but we will clarify how to use them and when to use them, but above all in what form, since filters can also take on more complex structures.

To use the filter we need to create an object that contains the name of the field to filter as the name of the property.
Now, we want to check a numeric value, so the `filterType` value will be of type `number` in this case, but in other cases it could be of type `text` or `Date`.
The control type is on equal values, so the `type` value will be `equals`, and finally the `filter` value will be the value we want to use in our filter, and that is `10`

```
query {
  ManageMonitor_getUserDynamicGrid(
    startRow: 0
    endRow: 20
    sorting: [ { colId: "ID", sort: ASC } ]
    filters: "{\"adminCommentCount\":{\"filterType\":\"number\",\"type\":\"equals\",\"filter\":10}}"
  ) {
    nodes{
      ID
      adminCommentCount
    }
  }
}
```

A very powerful function of the filters is the possibility of applying it at the same time, so let's see how it is possible to apply the previous two filters together to get the list of users who contain user\_ in their ID and who have received exactly 10 comments.
To do this we simply have to insert the two filters into the filters object.

```
query {
  ManageMonitor_getUserDynamicGrid(
    startRow: 0
    endRow: 20
    sorting: [ { colId: "ID", sort: ASC } ]
    filters: "{
      \"ID\":{\"filterType\":\"text\",\"type\":\"contains\",\"filter\":\"user_\"},
      \"adminCommentCount\":{\"filterType\":\"number\",\"type\":\"equals\",\"filter\":10}
    }"
  ) {
    nodes{
      ID
      adminCommentCount
    }
  }
}
```

What if we wanted to filter two types of data on the same column instead?
For example, we want to receive the list of users who have received 10 comments, or more.
Let's then add another filter for the 'adminCommentCount' column, and this will be possible through the use of another filter structure, which will see the previous filter as the value of the `condition1` property, and the new filter to be applied as the value of the `condition2` property, and then we will say that the two filters will be combined using the `OR` operator by assigning it as a value to the `operator` property

```
query {
  ManageMonitor_getUserDynamicGrid(
    startRow: 0
    endRow: 20
    sorting: [ { colId: "ID", sort: ASC } ]
    filters: "{
      \"ID\":{\"filterType\":\"text\",\"type\":\"contains\",\"filter\":\"user_\"},
      \"adminCommentCount\":{
        \"filterType\":\"number\",\"operator\":\"OR\",
        \"condition1\":{\"filterType\":\"number\",\"type\":\"equals\",\"filter\":10},
        \"condition2\":{\"filterType\":\"number\",\"type\":\"greaterThan\",\"filter\":10}}
    }"
  ) {
    nodes{
      ID
      adminCommentCount
    }
  }
}
```

However, such a situation can also be solved without using the OR operator, as there is a filter that combines the two options together, so let's use the greaterThanOrEqual filter

```
query {
  ManageMonitor_getUserDynamicGrid(
    startRow: 0
    endRow: 20
    sorting: [ { colId: "ID", sort: ASC } ]
    filters: "{
      \"ID\":{\"filterType\":\"text\",\"type\":\"contains\",\"filter\":\"user_\"},
      \"adminCommentCount\":{\"filterType\":\"number\",\"type\":\"greaterThanOrEqual\",\"filter\":10}
    }"
  ) {
    nodes{
      ID
      adminCommentCount
    }
  }
}
```

Talking about filter structure, a filter of type `number` can accept two values ​​if requested by the filter, a perfect example is the filter of `type inRange` which needs two values ​​to delimit the range, `filter` and `filterTo`.
Using this filter we will now be able to take all values ​​greater than or equal to 10, but also less than or equal to 20, without having to use any additional conditions

```
query {
  ManageMonitor_getUserDynamicGrid(
    startRow: 0
    endRow: 20
    sorting: [ { colId: "ID", sort: ASC } ]
    filters: "{
      \"ID\":{\"filterType\":\"text\",\"type\":\"contains\",\"filter\":\"user_\"},
      \"adminCommentCount\":{\"filterType\":\"number\",\"type\":\"inRange\",\"filter\":10, \"filterTo\":20}
    }"
  ) {
    nodes{
      ID
      adminCommentCount
    }
  }
}
```

The date filter also has a different structure from both filters, in fact we will see the `filter` and `filterTo` properties replaced by `dateFrom` and `dateTo` respectively.

```
query {
  ManageMonitor_getUserDynamicGrid(
    startRow: 0
    endRow: 20
    sorting: [ { colId: "ID", sort: ASC } ]
    filters: "{\"timestampCreated\":{\"dateFrom\":\"2021-03-29 00:00:00\",\"dateTo\":\"2021-03-30 00:00:00\",\"type\":\"inRange\",\"filterType\":\"date\"}}"
  ) {
    nodes{
      ID
      timestampCreated
    }
  }
}
```

Here is a complete example that sees the use of all 3 types of filters, in a simple way, combined and with two properties

```
query {
  ManageMonitor_getUserDynamicGrid(
    startRow: 0
    endRow: 20
    sorting: [ { colId: "ID", sort: ASC } ]
    filters: "{
      \"ID\":{\"filterType\":\"text\",\"type\":\"contains\",\"filter\":\"user_\"},
      \"adminCommentCount\":{
        \"filterType\":\"number\",\"operator\":\"OR\",
        \"condition1\":{\"filterType\":\"number\",\"type\":\"equals\",\"filter\":10},
        \"condition2\":{\"filterType\":\"number\",\"type\":\"greaterThan\",\"filter\":10}},
      \"timestampCreated\":{\"dateFrom\":\"2021-03-29 00:00:00\",\"dateTo\":\"2021-03-30 00:00:00\",\"type\":\"inRange\",\"filterType\":\"date\"}
    }"
  ) {
    nodes{
      ID
      adminCommentCount
      timestampCreated
    }
  }
}
```

Well, now let's introduce a new filter structure instead.
Until now we have created filters on different columns which are then related through the default AND operator, but is it possible to explain which operator to use to relate the filters of different columns?
Certainly, but we will have to use a more elaborate structure that sees the presence of the `multicolumnJoinOptions` property that will contain all the columns that must be related to each other and also the `multiColumnJoinOperator` property that will specify the nature of the relationship.

```
query {
  ManageMonitor_getUserDynamicGrid(
    startRow: 0
    endRow: 20
    sorting: [ { colId: "ID", sort: ASC } ]
    filters: "{
      \"multiColumnJoinOptions\":{
        \"multiColumnJoinOperator\": \"or\",
        \"ID\":{\"filterType\":\"text\",\"type\":\"contains\",\"filter\":\"user_\"},
        \"adminCommentCount\":{
          \"filterType\":\"number\",\"operator\":\"OR\",
          \"condition1\":{\"filterType\":\"number\",\"type\":\"equals\",\"filter\":10},
          \"condition2\":{\"filterType\":\"number\",\"type\":\"greaterThan\",\"filter\":10}},
        \"timestampCreated\":{\"dateFrom\":\"2021-03-29 00:00:00\",\"dateTo\":\"2021-03-30 00:00:00\",\"type\":\"inRange\",\"filterType\":\"date\"}
      }
    }"
  ) {
    nodes{
      ID
      adminCommentCount
      timestampCreated
    }
  }
}
```

Now the previous filters will no longer become exclusive, but on the contrary, now it is enough that only one of the properties is true to obtain a result.
What if we wanted to specify that a property must have a specific value upstream of everything?
Now we will create a structure where the first property must be true and one of the first filters also, and we will add a new filter also to make the results we want more specific.
Small note, the `multiColumnJoinOptions` property can be declared within itself, allowing us to create infinite cascading relationships

```
query {
  ManageMonitor_getUserDynamicGrid(
    startRow: 0
    endRow: 20
    sorting: [ { colId: "ID", sort: ASC } ]
    filters: "{
      \"multiColumnJoinOptions\":{
        \"multiColumnJoinOperator\": \"AND\",
        \"riskCrime\": {\"filterType\":\"number\",\"type\":\"greaterThan\",\"filter\":10},
        \"multiColumnJoinOptions\":{
          \"multiColumnJoinOperator\": \"OR\",
          \"ID\":{\"filterType\":\"text\",\"type\":\"contains\",\"filter\":\"user_\"},
          \"adminCommentCount\":{
            \"filterType\":\"number\",\"operator\":\"OR\",
            \"condition1\":{\"filterType\":\"number\",\"type\":\"equals\",\"filter\":10},
            \"condition2\":{\"filterType\":\"number\",\"type\":\"greaterThan\",\"filter\":10}},
          \"timestampCreated\":{\"dateFrom\":\"2021-03-29 00:00:00\",\"dateTo\":\"2021-03-30 00:00:00\",\"type\":\"inRange\",\"filterType\":\"date\"}
          \"multiColumnJoinOptions\":{
            \"multiColumnJoinOperator\": \"AND\",
            \"tradingBalance\":{\"filterType\":\"number\",\"type\":\"greaterThan\",\"filter\":10},
            \"tradingTotalVolume\":{\"filterType\":\"number\",\"type\":\"greaterThan\",\"filter\":100},
          }
        }
      }
    }"
  ) {
    nodes{
      ID
      adminCommentCount
      timestampCreated
      riskCrime
      tradingBalance
      tradingTotalVolume
    }
  }
}
```

This structure will apply the column filters to each other in the following way:
riskCrime `AND` (ID `OR` adminCommentCount `OR` timestampCreated `OR` (tradingBalance `AND` tradingTotalVolume)).
We want to receive all results that have a certain riskCrime value and one of the other specified options, among which we also have another and-type relationship between tradingBalance and tradingTotalVolume.

To see the complete list of filters, click [here](./compodoc/miscellaneous/enumerations.html#GeneralFilters).
