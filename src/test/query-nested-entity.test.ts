import { createQueryResolver } from "..";
import { IQueryResolverConfig } from "../lazy";

describe("query nested entity", () => {

    it("can create function to retreive a nested entity", async ()  => {

        const config: IQueryResolverConfig = {
            entities: {
                movie: {
                    primaryKey: "name",
                    nested: {
                        director: {
                            parentKey: "directorId",
                        },
                    },
                },
                director: {
                    primaryKey: "id",
                },
            },
        };

        const data = {
            director: [
                {
                    id: "1234",
                    name: "Doug Liman",
                },
            ],
        };

        const resolver = await createQueryResolver(config, data);
        
        const parentEntity = {
            name: "The Bourne Identity",
            year: 2002,
            directorId: "1234",
        };

        const result = await resolver.get.movie.nested!.director.invoke(parentEntity, {}, {});
        expect(result).toEqual({
            id: "1234",
            name: "Doug Liman",
        });
    });

    it("can set global entity resolver to be a different name to the nested entity", async ()  => {

        const config: IQueryResolverConfig = {
            entities: {
                movie: {
                    primaryKey: "name",
                    nested: {
                        the_director: {
                            from: "director",
                            parentKey: "directorId",
                        },
                    },
                },
            },
        };

        const resolver = await createQueryResolver(config, {});
        
        expect(resolver.get.movie.nested!.the_director.from).toBe("director");
    });

    it("can create function to retreive multiple nested entities", async ()  => {

        const config: IQueryResolverConfig = {
            entities: {
                movie: {
                    primaryKey: "name",
                    nested: {
                        director: {
                            multiple: true,
                            parentKey: "name",
                            foreignKey: "movie",
                        },
                    },
                },
                director: {
                    primaryKey: "name",
                },
            },
        };

        const data = {
            movie: [
                {
                    name: "The Bourne Identity",
                    year: 2002,
                },
            ],
            director: [
                {
                    name: "Doug Liman",
                    movie: "The Bourne Identity",
                },
            ],
        };

        const resolver = await createQueryResolver(config, data);
        
        const parentEntity = { 
            name: "The Bourne Identity",
        };

        const result = await resolver.get.movie.nested!.director.invoke(parentEntity, {}, {});
        expect(result).toEqual([
            {
                name: "Doug Liman",
                movie: "The Bourne Identity",
            },
        ]);
    });
});
