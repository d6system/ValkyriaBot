module.exports = {
    name: "Thumbnail (Component)",

    description: "Creates a Thumbnail for Sections.",

    category: "Component Stuff",

    auto_execute: true,

    inputs(data) {
        if (!data?.options?.show_inputs) return;

        return [
            {
                id: "action",
                name: "Action",
                description: "Executes this block.",
                types: ["action"]
            },
            {
                id: "url",
                name: "URL",
                description: "The URL to display.",
                types: ["text", "unspecified"]
            },
            {
                id: "description",
                name: "Description (Optional)",
                description: "The text to display.",
                types: ["text", "unspecified"]
            },
            {
                id: "spoiler",
                name: "Spoiler",
                description: "Whether to mark this thumbnail as a spoiler.",
                types: ["boolean", "unspecified"]
            }
        ];
    },

    options: [
        {
            id: "show_inputs",
            name: "Enable Inputs?",
            description: "If enabled, uses inputs instead of static options.",
            type: "CHECKBOX"
        },
        {
            id: "url",
            name: "URL",
            description: "The URL to display.",
            type: "TEXT",
        },
        {
            id: "description",
            name: "Description (Optional)",
            description: "The text to display.",
            type: "TEXT",
        },
        {
            id: "spoiler",
            name: "Spoiler",
            description: "Whether to mark this thumbnail as a spoiler.",
            type: "CHECKBOX",
        }
    ],

    outputs(data) {
        const outputs = [
            {
                id: "thumbnail",
                name: "Thumbnail (Component)",
                description: "Type: Object\n\nDescription: The Thumbnail component.",
                types: ["object"],
            }
        ];

        if (data?.options?.show_inputs) {
            outputs.unshift({
                id: "action",
                name: "Action",
                description: "Executes this block.",
                types: ["action"]
            });
        }

        return outputs;
    },

    code(cache) {
        const { ThumbnailBuilder } = require("discord.js");

        const executedFrom = cache.executedFrom?.[0];
        const showinputs = this.GetOptionValue("show_inputs", cache);
        if (executedFrom != "action" && showinputs) return;

        // Prefer inputs first, fallback to options
        const get = (id) => this.GetInputValue(id, cache) ?? this.GetOptionValue(id, cache);

        const url = get("url");
        const description = get("description");
        const spoiler = get("spoiler");

        const thumbnail = new ThumbnailBuilder();

        if (url) thumbnail.setURL(url);
        if (description) thumbnail.setDescription(description);
        if (spoiler) thumbnail.setSpoiler(true);

        this.StoreOutputValue(thumbnail, "thumbnail", cache, "inputBlock");

        if (executedFrom === "action") {
            this.RunNextBlock("action", cache);
        }
    }
};
