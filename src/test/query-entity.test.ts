import { createQueryResolver  } from "..";
import { IQueryResolverConfig } from "..";
import { createInlineDataLoader } from "./inline-data-loader";

describe("query entity", () => {

    it("can create resolver to retreive single entity", async ()  => {

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

        const resolver = await createQueryResolver(config, createInlineDataLoader(data));
        
        const args = { 
            name: "The Bourne Identity",
        };
        const result = await resolver.get.movie.invoke(args, {});
        expect(result).toEqual({
            name: "The Bourne Identity",
            year: 2002,
        });
    });

});
