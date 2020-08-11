import { IQueryResolver } from "@miniql/core-types";
import { createQueryResolver as createLazyResolver, IQueryResolverConfig, ILazyDataLoader } from "./lazy";
export { IQueryResolverConfig, IRelatedEntityConfig, IRelatedEntities, IEntityType, IEntityTypes,  } from "./lazy";

//
// Defines the data to run queries against.
//
export interface IDataSet {
    [entityType: string]: any[];
}

//
// Logs an optional verbose message.
//
function verbose(config: any, indentLevel: number, msg: string) {
    if (config.verbose) {
        console.log(" ".repeat(indentLevel*4) + msg);
    }
}

//
// Creates the query resolver for a dataset with a particular configuration.
//
export function createQueryResolver(config: IQueryResolverConfig, inlineData: IDataSet): IQueryResolver {
    const dataLoader: ILazyDataLoader = {
        //
        // Loads a single entity.
        //
        async loadSingleEntity(entityTypeName: string, primaryKey: string, entityId: string): Promise<any> {
            const entities = inlineData[entityTypeName];
            const filteredEntities = entities.filter(entity => entity[primaryKey] === entityId);
            if (filteredEntities.length > 0) {
                // At least one entity was found.
                return filteredEntities[0];
            }
            else {
                // No entity was found.
                return undefined;
            }
        },

        //
        // Load the set of entities.
        //
        async loadEntities(entityTypeName: string): Promise<any[]> {
            return inlineData[entityTypeName];
        },
    };
    return createLazyResolver(config, dataLoader);
}