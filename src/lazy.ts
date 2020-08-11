//
// Creates a MiniQL query resolver for lazily loaded data.
//

import { IQueryResolver } from "@miniql/core-types";

//
// Configures a related entity.
//
export interface IRelatedEntityConfig {
    //
    // Set to true to resolve multiple entities.
    // Defaults to false to resolve a single entity.
    // 
    multiple?: boolean;

    //
    // The name of the global entity resolver, if different from the nested entity key.
    //
    from?: string;

    //
    // Specifies the column in the parent entity that relates it to the primaryKey in the nested entity.
    // This defaults to the parent entities primary key if not specified.
    //
    parentKey?: string;

    //
    // Specifies the column in the child entity that relates it to the primaryKey in the parent entity.
    // This default to the nested entities primary key if not specified.
    //
    foreignKey?: string;
}

//
// Specifies related entites.
//
export interface IRelatedEntities {
    [nestedEntityType: string]: IRelatedEntityConfig;
}

//
// Configures an entity type.
//
export interface IEntityType {

    //
    // Specifies the field that is the primary identifying key for each entity.
    //
    primaryKey: string;

    //
    // Specifies other entities that are related to this one.
    //
    nested?: IRelatedEntities;
}

//
// Configures entity types.
//
export interface IEntityTypes {
    [entityType: string]: IEntityType;
}

//
// Configures the query resolver.
//
export interface IQueryResolverConfig {
    //
    // Configures entity types.
    //
    entities: IEntityTypes;

    //
    // Enables verbose mode for the query resolver.
    //
    verbose?: boolean;
}

//
// Lazily loads data.
//
export interface ILazyDataLoader {
    //
    // Loads a single entity.
    //
    loadSingleEntity(entityTypeName: string, primaryKey: string, entityId: string): Promise<any>;

    //
    // Load the set of entities.
    //
    loadEntities(entityTypeName: string): Promise<any[]>;
}

//
// Logs an optional verbose message.
//
function verbose(config: IQueryResolverConfig, indentLevel: number, msg: string) {
    if (config.verbose) {
        console.log(" ".repeat(indentLevel*4) + msg);
    }
}

//
// Creates the query resolver for a dataset with a particular configuration.
//
export function createQueryResolver(config: IQueryResolverConfig, dataLoader: ILazyDataLoader): IQueryResolver {
    const resolver: any = { 
        get: {
        },
    };

    verbose(config, 0, `== Creating query resolver for lazy loaded data.`);

    for (const entityTypeName of Object.keys(config.entities)) {
        verbose(config, 1, `Creating query resolver for entity "${entityTypeName}".`);

        const entityType = config.entities[entityTypeName];
        const entityResolver: any = { //TODO: type this properly.
            invoke: async (args: any, context: any) => {
                verbose(config, 0, `>> Invoked query resolver for entity "${entityTypeName}".`);

                //fio:const entities = inlineData[entityTypeName];
                const primaryKey = entityType.primaryKey; //TODO: Error check this is defined! This could be optional.
                const entityId = args[primaryKey];
                if (entityId !== undefined) {
                    verbose(config, 1, `Querying for single entity with identifier "${entityId}" from primary key "${primaryKey}".`);

                    // Single entity query.
                    return await dataLoader.loadSingleEntity(entityTypeName, primaryKey, entityId);
                }
                else {
                    verbose(config, 1, `Querying for multiple entities.`);

                    // Multiple entity query.
                    return await dataLoader.loadEntities(entityTypeName);
                }
            },
        };

        if (entityType.nested) {
            entityResolver.nested = {};

            const nested = entityType.nested;

            for (const nestedEntityTypeName of Object.keys(entityType.nested)) {
                verbose(config, 2, `Creating nested entity resolver "${nestedEntityTypeName}".`);
                
                const nestedEntityConfig = nested[nestedEntityTypeName];

                entityResolver.nested[nestedEntityTypeName] = {
                    from: nestedEntityConfig.from,
                    invoke: async (parent: any, args: any, context: any) => {
                        verbose(config, 0, `>> Invoked nested entity query resolver for entity "${nestedEntityTypeName}".`);

                        const nestedEntityConfigName = nestedEntityConfig.from || nestedEntityTypeName;
                        const nestedEntityType = config.entities[nestedEntityConfigName]; //todo: error check this exists!
                        const parentKey = nestedEntityConfig.parentKey || nestedEntityTypeName;
                        const nestedKey = nestedEntityConfig.foreignKey || nestedEntityType.primaryKey;

                        const nestedEntities = await dataLoader.loadEntities(nestedEntityConfigName);
                        verbose(config, 1, `Filtering ${nestedEntities.length} entities using nested key "${nestedKey}" and parent key "${parentKey}".`);

                        const parentId = parent[parentKey];
                        const filteredEntities = nestedEntities.filter(nestedEntity => nestedEntity[nestedKey] === parentId);

                        verbose(config, 1, `Result is ${filteredEntities.length} filtered entities with "${nestedKey}" === to ${parentId}.`);

                        if (nestedEntityConfig.multiple === true) {
                            verbose(config, 1, `Nested resolver returns multiple entities.`);
                            return filteredEntities;
                        }
                        else {
                            verbose(config, 1, `Nested resolver returns a single entity.`);
                            if (filteredEntities.length === 0) {
                                return undefined;
                            }
                            else {
                                return filteredEntities[0];
                            }
                        }
                    },
                }
            }
        }

        resolver.get[entityTypeName] = entityResolver;
    }

    return resolver;
}