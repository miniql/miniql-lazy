import { createQueryResolver, IInlineResolverConfig } from "..";

describe("query entity", () => {

    it("can create resolver to retreive single entity", async ()  => {

        const config: IInlineResolverConfig = {
            movie: {
                primaryKey: "name",
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
