# @miniql/inline

A [MiniQL](https://github.com/miniql/miniql) query resolver to query inline data.

Any problems? Please log an issue on this repo.

Love this? Please [star the repo](https://github.com/miniql/miniql) and [follow the developer on Twitter](https://twitter.com/ashleydavis75).

## Using it

Install the modules in your Node.js project:

```bash
npm install --save miniql
npm install --save @miniql/inline
```

Import the modules (JavaScript):

```javascript
const { miniql } = require("miniql");
const { createQueryResolver } = require("@miniql/inline");
```

Import the modules (TypeScript):

```typescript
import { miniql } from "miniql";
import { createQueryResolver } from "@miniql/inline";
```

Configure and create an inline data query resolver:

```javascript
    //
    // Configures the inline query resolver.
    //
    const inlineQueryConfig = {
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

    //
    // The data that we'd like to query.
    //
    const data = {
        species: [
            {
                name: "Hutt",
                classification: "gastropod",
                designation: "sentient",
                language: "Huttese",
                homeworld: "Nal Hutta",
            },
            
            // ... more data goes here ..
        ],

        planet: [
            {
                name: "Nal Hutta",
                rotation_period: 87,
                orbital_period: 413,
                diameter: 12150,
                climate: "temperate",
                terrain: "urban, oceans, swamps, bogs",
                population: 7000000000
            }

            // ... more data goes here ..

        ],

        // ... more data goes here ..
    };
    
    // 
    // Creates a query resolver for inline data.
    //
    const queryResolver = await createQueryResolver(inlineQueryConfig);
```

Now you can make queries against the dataset, for example:

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