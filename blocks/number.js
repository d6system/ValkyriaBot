module.exports = {
    name: "Number",

    description: "Creates a number to use it in your blocks.",

    category: "Inputs",

    auto_execute: true,

    inputs: [],

    options(data) {
        let options = [];

        Array.apply(null, Array(data?.outputs?.number?.length)).forEach((_, i) => {
            options.push({
                id: `number${i + 1}`,
                name: `Number ${i + 1}`,
                description: "The number to set.",
                type: "NUMBER",
            });
        });
        return options;
    },

    outputs: [
        {
            id: "number",
            name: "Number",
            description: "The Number created.",
            types: ["Number"],
            multiOutput: true,
        },
    ],

    code(cache) {
        this.StoreOutputValue(
            Object.keys(cache.options).map((option, index) => {
                return parseFloat(this.GetOptionValue(option, cache));
            }),
            "number",
            cache
        );
    },
}