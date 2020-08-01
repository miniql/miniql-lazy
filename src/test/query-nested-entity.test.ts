import { createQueryResolver, IInlineResolverConfig as IResolverConfig } from "..";

describe("query nested entity", () => {

    it("can create function to retreive a nested entity", async ()  => {

        const config: IResolverConfig = {
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

        const result = await resolver.get.movie.nested.director.invoke(parentEntity, {}, {});
        expect(result).toEqual({
            id: "1234",
            name: "Doug Liman",
        });
    });

    it("can create function to retreive multiple nested entities", async ()  => {

        const config: IResolverConfig = {
            movie: {
                primaryKey: "name",
                nested: {
                    director: {
                        multiple: true,
                        foreignKey: "movie",
                    },
                },
            },
            director: {
                primaryKey: "name",
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

        const result = await resolver.get.movie.nested.director.invoke(parentEntity, {}, {});
        expect(result).toEqual([
            {
                name: "Doug Liman",
                movie: "The Bourne Identity",
            }
        ]);
    });
});
