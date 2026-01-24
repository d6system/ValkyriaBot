module.exports = {
    name: "Media Gallery Item",

    description: "Creates a Media Gallery Item for Media Galleries.",

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
                description: "Whether to mark this item as a spoiler.",
                types: ["boolean", "unspecified"]
            }
        ];
    },

    options: [
        {
            id: "show_inputs",
            name: "Enable Inputs?",
            description: "Use inputs instead of static options and allow action chaining.",
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
                id: "mediaitem",
                name: "Media Gallery Item",
                description: "The Media Gallery Item.",
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
        const { MediaGalleryItemBuilder } = require("discord.js");

        const executedFrom = cache.executedFrom?.[0];
        const showinputs = this.GetOptionValue("show_inputs", cache);
        if (executedFrom != "action" && showinputs) return;

        const get = (id) => this.GetInputValue(id, cache) ?? this.GetOptionValue(id, cache);

        const url = get("url");
        const description = get("description");
        const spoiler = get("spoiler");

        const mediaitem = new MediaGalleryItemBuilder();

        mediaitem.setURL(url);
        if (description) mediaitem.setDescription(description);
        if (spoiler) mediaitem.setSpoiler(true);

        this.StoreOutputValue(mediaitem, "mediaitem", cache);

        if (executedFrom === "action") {
            this.RunNextBlock("action", cache);
        }
    }
};
