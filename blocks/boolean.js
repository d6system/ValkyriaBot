module.exports = {
    name: "Boolean",

    description: "Creates a boolean to use it in your blocks.",

    category: "Inputs",

    auto_execute: true,

    inputs: [],

    options(data) {
        let options = [];

        Array.apply(null, Array(data?.outputs?.boolean?.length)).forEach((_, i) => {
            options.push({
                id: `boolean${i + 1}`,
                name: `Boolean #${i + 1}`,
                description: "Description: The Boolean.",
                type: "CHECKBOX",
            });
        });
        return options;
    },

    outputs: [
        {
            "id": "boolean",
            "name": "Boolean",
            "description": "Type: Boolean\n\nDescription: The boolean.",
            "types": ["boolean"],
            "multiOutput": true
        }
    ],

    code(cache) {
        this.StoreOutputValue(
            Object.keys(cache.options).map((option, index) => {
                return Boolean(this.GetOptionValue(option, cache));
            }),
            "boolean",
            cache
        );
    }
}