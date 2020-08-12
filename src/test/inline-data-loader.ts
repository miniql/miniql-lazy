//
// Creates an inline data loader for testing.
//

import { ILazyDataLoader } from "..";

export function createInlineDataLoader(inlineData: any): ILazyDataLoader {
    const dataLoader: ILazyDataLoader = {
        //
        // Loads a single entity.
        //
        async loadSingleEntity(entityTypeName: string, primaryKey: string, entityId: string): Promise<any> {
            const entities = inlineData[entityTypeName] as any[];
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
    return dataLoader
}
