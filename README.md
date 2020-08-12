# @miniql/lazy

A [MiniQL](https://github.com/miniql/miniql) query resolver lazily loaded data. This MiniQL plugin is designed to be used to build other plugins.

Any problems? Please log an issue on this repo.

Love this? Please [star the repo](https://github.com/miniql/miniql) and [follow the developer on Twitter](https://twitter.com/ashleydavis75).

## Using it

Install the modules in your Node.js project:

```bash
npm install --save miniql
npm install --save @miniql/lazy
```

Import the modules (JavaScript):

```javascript
const { miniql } = require("miniql");
const { createQueryResolver } = require("@miniql/lazy");
```

Import the modules (TypeScript):

```typescript
import { miniql } from "miniql";
import { createQueryResolver } from "@miniql/lazy";
```

Then create a configuration for your data:

```javascript
    //
    // Configures the query resolver.
    //
    const queryConfig = {
        species: {
            primaryKey: "name",
            nested: {
                homeworld: {
                    parentKey: "homeworld",
                    from: "planet",
                },
            },
        },
        planet: {
            primaryKey: "name",
            nested: {
                species: {
                    foreignKey: "homeworld",
                },
            },
        },
    };
```

Now create a lazy data loader:

```javascript
    const dataLoader = {

        //
        // Loads a single entity.
        //
        loadSingleEntity = async (entityTypeName: string, primaryKey: string, entityId: string): Promise<any> => {
            const entity = // Load a single of type 'entityTypeName' with a value in its field 'primaryKey' of value 'entityId'.
            return entity;
        },

        //
        // Load the set of entities.
        //
        async loadEntities(entityTypeName: string): Promise<any[]> {
            const entities = // Load all entities of type 'entityTypeName'.
            return entities;
        },
    };
```

Finally create a lazy query resolver with your configuration and data loader:

```javascript
    // 
    // Creates a query resolver for lazy loadeed data.
    //
    const queryResolver = await createQueryResolver(queryConfig, dataLoader);
```

Now you can make queries against the lazily loaded dataset, for example:

```javascript
    const query = {
        get: {
            species: { // Query for "species" entity.
            
                // No arguments gets all entities.

                resolve: {
                    homeworld: { // Resolves the homeworld of each species as a nested lookup.
                    },
                }
            },
        },
    };

    // Invokes MiniQL.
    const result = await miniql(query, queryResolver, {});  

    // Displays the query result.
    console.log(JSON.stringify(result, null, 4));
```

Please see [MiniQL](https://github.com/miniql/miniql) for more information on how to make queries.

Don't forget to [star the repo](https://github.com/miniql/miniql) and [follow the developer on Twitter](https://twitter.com/ashleydavis75).