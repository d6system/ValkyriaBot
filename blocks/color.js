module.exports = {
    name: "Color",

    description: "Creates a color to use it in your blocks.",

    category: "Inputs",

    auto_execute: true,

    inputs: [],

    options(data) {
        let options = [];

        Array.apply(null, Array(data?.outputs?.color?.length)).forEach((_, i) => {
            options.push({
                id: `color${i + 1}`,
                name: `Color ${i + 1}`,
                description: "The color.",
                type: "color",
            });
        });
        return options;
    },

    outputs: [
        {
            id: "color",
            name: "Color",
            description: "The color created.",
            types: ["color"],
            multiOutput: true,
        },
    ],

    code(cache) {
        this.StoreOutputValue(
            Object.keys(cache.options).map((option, index) => {
                return this.GetOptionValue(option, cache);
            }),
            "color",
            cache
        );
    },
}