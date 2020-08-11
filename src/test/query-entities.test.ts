import { createQueryResolver } from "..";
import { IQueryResolverConfig } from "../lazy";

describe("query entities", () => {

    it("can create resolver to retreive multiple entities", async ()  => {

        const config: IQueryResolverConfig = {
            entities: {
                movie: {
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
                {
                    name: "Minority Report",
                    year: 2002,
                },
            ],
        };

        const resolver = await createQueryResolver(config, data);
        
        const result = await resolver.get.movie.invoke({}, {});
        expect(result).toEqual([
            {
                name: "The Bourne Identity",
                year: 2002,
            },
            {
                name: "Minority Report",
                year: 2002,
            },
        ]);
    });

    it("can create resolver for multiple entity types", async ()  => {

        const config: IQueryResolverConfig = {
            entities: {
                movie: {
                    primaryKey: "name",
                },
                actor: {
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
                {
                    name: "Minority Report",
                    year: 2002,
                },
            ],
            actor: [
                {
                    name: "Matt Daemon",
                },
                {
                    name: "Tom Cruise",
                },
            ],
        };

        const resolver = await createQueryResolver(config, data);

        const movies = await resolver.get.movie.invoke({}, {});
        expect(movies).toEqual([
            {
                name: "The Bourne Identity",
                year: 2002,
            },
            {
                name: "Minority Report",
                year: 2002,
            },
        ]);

        const actors = await resolver.get.actor.invoke({}, {});
        expect(actors).toEqual([
            {
                name: "Matt Daemon",
            },
            {
                name: "Tom Cruise",
            },
        ]);
    });
});
