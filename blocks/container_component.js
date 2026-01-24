module.exports = {
    name: "Container (Component)",

    description: "Creates a Container component for messages.",

    category: "Component Stuff",

    auto_execute: true,

    inputs(data) {
        if (!data?.options?.show_inputs) return [
            {
                id: "components",
                name: "Component",
                description: "Supports the Following Components: Action Row, Button, Select Menu, TextDisplay, Seperator, Section, Media Gallery, File.",
                types: ["object", "unspecified"],
                multiInput: true,
                max: 10
            }
        ];

        return [
            {
                id: "action",
                name: "Action",
                description: "Executes this block.",
                types: ["action"]
            },
            {
                id: "components",
                name: "Component",
                description: "Supports the Following Components: Action Row, Button, Select Menu, TextDisplay, Seperator, Section, Media Gallery, File.",
                types: ["object", "unspecified"],
                multiInput: true,
                max: 10
            },
            {
                id: "accent_color",
                name: "Accent Color",
                description: "The accent color (hex). Black (#000000) disables it.",
                types: ["text", "unspecified"]
            },
            {
                id: "spoiler",
                name: "Spoiler",
                description: "Whether this component is a spoiler.",
                types: ["boolean", "unspecified"]
            }
        ];
    },

    options: [
        {
            id: "show_inputs",
            name: "Enable Inputs?",
            description: "If enabled, uses inputs for accent color and spoiler and enables chaining.",
            type: "CHECKBOX"
        },
        {
            id: "accent_color",
            name: "Accent Color",
            description: "The accent color for this component. Black (#000000) disables it.",
            type: "COLOR",
            defaultValue: "#5865F2",
        },
        {
            id: "spoiler",
            name: "Spoiler",
            description: "Whether to mark this component as a spoiler.",
            type: "CHECKBOX",
            defaultValue: false,
        },
    ],

    outputs(data) {
        const outputs = [
            {
                id: "container",
                name: "Container (Component)",
                description: "Type: Object\n\nDescription: The container component.",
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
        const {
            ActionRowBuilder,
            ButtonBuilder,
            StringSelectMenuBuilder,
            UserSelectMenuBuilder,
            RoleSelectMenuBuilder,
            MentionableSelectMenuBuilder,
            ChannelSelectMenuBuilder,
            TextInputBuilder,
            SeparatorBuilder,
            SectionBuilder,
            MediaGalleryBuilder,
            FileBuilder,
            ContainerBuilder,
            ThumbnailBuilder,
            TextDisplayBuilder,
        } = require("discord.js");

        const executedFrom = cache.executedFrom?.[0];
        const showinputs = this.GetOptionValue("show_inputs", cache);
        if (executedFrom != "action" && showinputs) return;

        const get = (id) => this.GetInputValue(id, cache) ?? this.GetOptionValue(id, cache);

        const components = this.GetInputValue("components", cache, { fetch: true }).filter((a) => a);
        const accent_color = get("accent_color");
        const spoiler = get("spoiler");

        const container = new ContainerBuilder().setSpoiler(!!spoiler);

        function hexToNumber(hex) {
            return parseInt(hex.replace("#", ""), 16);
        }

        if (accent_color === "#000000") {
            container.clearAccentColor();
        } else if (accent_color) {
            container.setAccentColor(hexToNumber(accent_color));
        }

        for (const component of components) {
            let row = null;

            if (component instanceof ActionRowBuilder) {
                container.addActionRowComponents(component);
            } else if (component instanceof ButtonBuilder) {
                row = new ActionRowBuilder().addComponents(component);
                container.addActionRowComponents(row);
            } else if (
                component instanceof StringSelectMenuBuilder ||
                component instanceof UserSelectMenuBuilder ||
                component instanceof RoleSelectMenuBuilder ||
                component instanceof MentionableSelectMenuBuilder ||
                component instanceof ChannelSelectMenuBuilder ||
                component instanceof ButtonBuilder
            ) {
                row = new ActionRowBuilder().addComponents(component);
                container.addActionRowComponents(row);
            } else if (component instanceof TextDisplayBuilder) {
                container.addTextDisplayComponents(component);
            } else if (component instanceof SeparatorBuilder) {
                container.addSeparatorComponents(component);
            } else if (component instanceof SectionBuilder) {
                container.addSectionComponents(component);
            } else if (component instanceof MediaGalleryBuilder) {
                container.addMediaGalleryComponents(component);
            } else if (component instanceof FileBuilder) {
                container.addFileComponents(component);
            }
        }

        this.StoreOutputValue(container, "container", cache, "inputBlock");

        if (executedFrom === "action") {
            this.RunNextBlock("action", cache);
        }
    }
};
