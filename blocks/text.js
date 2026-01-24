module.exports = {
    name: "Text",

    description: "Creates a text to use it in your blocks.",

    category: "Inputs",

    auto_execute: true,

    inputs: [],

    options(data) {
        let options = [];

        Array.apply(null, Array(data?.outputs?.text?.length)).forEach((_, i) => {
            options.push({
                id: `text${i + 1}`,
                name: `Text ${i + 1}`,
                description: "Description: The text.",
                type: "TEXT",
            });
        });
        return options;
    },

    outputs: [
        {
            id: "text",
            name: "Text",
            description: "Type: Text\n\nDescription: The text created.",
            types: ["text"],
            multiOutput: true,
        },
    ],

    code(cache) {
        this.StoreOutputValue(
            Object.keys(cache.options).map((option, index) => {
                return this.GetOptionValue(option, cache);
            }),
            "text",
            cache
        );
    },
};
