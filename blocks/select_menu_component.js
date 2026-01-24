module.exports = {
    name: "Select Menu (Component)",

    description: "Creates a select menu component for messages.",

    category: "Component Stuff",

    auto_execute: true,

    inputs(data) {
        const select_menu_type = data?.options?.select_menu_type || "text";
        const showInputs = data?.options?.show_inputs;

        const inputs = [];

        // Always show options input for text menus
        if (select_menu_type === "text") {
            inputs.push({
                id: "options",
                name: "Option",
                description: "The options for the Text Select Menu ONLY.",
                types: ["object", "unspecified"],
                multiInput: true,
                max: 25
            });
        }

        // Only show these if inputs are enabled
        if (showInputs) {
            inputs.unshift({
                id: "action",
                name: "Action",
                description: "Executes this block.",
                types: ["action"]
            });

            inputs.push(
                {
                    id: "custom_id",
                    name: "Custom ID",
                    description: "The custom ID for this menu.",
                    types: ["text", "unspecified"]
                },
                {
                    id: "placeholder",
                    name: "Placeholder",
                    description: "The placeholder text.",
                    types: ["text", "unspecified"]
                },
                {
                    id: "disabled",
                    name: "Disabled",
                    description: "Whether the menu is disabled.",
                    types: ["boolean", "unspecified"]
                },
                {
                    id: "min_values",
                    name: "Min Values",
                    description: "Minimum number of selectable values.",
                    types: ["number", "unspecified"]
                },
                {
                    id: "max_values",
                    name: "Max Values",
                    description: "Maximum number of selectable values.",
                    types: ["number", "unspecified"]
                },
                {
                    id: "required",
                    name: "Required?",
                    description: "Whether the menu is required.",
                    types: ["boolean", "unspecified"]
                }
            );
        }

        return inputs;
    },

    options(data) {
        const options = [
            {
                id: "show_inputs",
                name: "Enable Inputs?",
                description: "If enabled, allows setting fields via inputs and enables action chaining.",
                type: "CHECKBOX"
            },
            {
                id: "select_menu_type",
                name: "Select Menu Type",
                description: "The type of select menu.",
                type: "SELECT",
                options: {
                    text: "Text (Default)",
                    user: "Users",
                    role: "Roles",
                    mentionable: "Mentionables",
                    channel: "Channel"
                }
            }
        ];

        if (data?.options?.select_menu_type === "channel") {
            options.push({
                id: "channel_type",
                name: "Channel Type",
                description: "The Channel Types that can be selected.",
                type: "MULTISELECT",
                allowUserOptions: false,
                duplicates: false,
                options: {
                    "0": "Text Channel",
                    "5": "Announcement Channel",
                    "2": "Voice Channel",
                    "13": "Stage Channel",
                    "4": "Server Category",
                    "10": "Announcement Thread",
                    "11": "Public Thread",
                    "12": "Private Thread",
                    "15": "Guild Forum",
                    "16": "Guild Media"
                }
            });
        }

        if (data?.options?.select_menu_type === "user") {
            options.push({
                id: "default_users",
                name: "Default Users (Optional)",
                description: "Comma-separated list of user IDs.",
                type: "TEXT"
            });
        }

        if (data?.options?.select_menu_type === "role") {
            options.push({
                id: "default_roles",
                name: "Default Roles (Optional)",
                description: "Comma-separated list of role IDs.",
                type: "TEXT"
            });
        }

        if (data?.options?.select_menu_type === "mentionable") {
            options.push({
                id: "default_mentionables",
                name: "Default Mentionables (Optional)",
                description: "Comma-separated list of IDs.",
                type: "TEXT"
            });
        }

        options.push(
            {
                id: "custom_id",
                name: "Custom ID",
                description: "The custom ID for this menu.",
                type: "TEXT",
                required: true
            },
            {
                id: "placeholder",
                name: "Placeholder",
                description: "Placeholder text for the menu.",
                type: "TEXT"
            },
            {
                id: "disabled",
                name: "Disabled?",
                description: "Whether the menu should be disabled.",
                type: "CHECKBOX"
            },
            {
                id: "min_values",
                name: "Min Values",
                description: "Minimum number of selected values. Default: 1",
                type: "NUMBER",
                defaultValue: 1
            },
            {
                id: "max_values",
                name: "Max Values",
                description: "Maximum number of selected values. Default: 1",
                type: "NUMBER",
                defaultValue: 1
            },
            {
                id: "required",
                name: "Required?",
                description: "Whether the menu is required. Only applicable in modals.",
                type: "CHECKBOX",
                defaultValue: true
            }
        );

        return options;
    },

    outputs(data) {
        const outputs = [
            {
                id: "select_menu",
                name: "Select Menu (Component)",
                description: "The select menu component.",
                types: ["object"]
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
            StringSelectMenuBuilder,
            UserSelectMenuBuilder,
            RoleSelectMenuBuilder,
            MentionableSelectMenuBuilder,
            ChannelSelectMenuBuilder,
            ChannelType
        } = require("discord.js");

        const executedFrom = cache.executedFrom?.[0];
        const showinputs = this.GetOptionValue("show_inputs", cache);
        if (executedFrom != "action" && showinputs) return;

        const get = (id) => this.GetInputValue(id, cache) ?? this.GetOptionValue(id, cache);

        const select_menu_type = this.GetOptionValue("select_menu_type", cache);
        const custom_id = get("custom_id");
        const placeholder = get("placeholder");
        const disabled = get("disabled");
        const min_values = get("min_values");
        const max_values = get("max_values");
        const options = this.GetInputValue("options", cache, { fetch: true })?.filter((a) => a) ?? [];
        const channel_type = this.GetOptionValue("channel_type", cache);
        const default_users = this.GetOptionValue("default_users", cache);
        const default_roles = this.GetOptionValue("default_roles", cache);
        const default_mentionables = this.GetOptionValue("default_mentionables", cache);
        const required = get("required");

        let selectMenu;

        switch (select_menu_type) {
            case "user":
                selectMenu = new UserSelectMenuBuilder();
                if (default_users) {
                    selectMenu.setDefaultUsers(default_users.split(",").map((id) => id.trim()));
                }
                break;
            case "role":
                selectMenu = new RoleSelectMenuBuilder();
                if (default_roles) {
                    selectMenu.setDefaultRoles(default_roles.split(",").map((id) => id.trim()));
                }
                break;
            case "mentionable":
                selectMenu = new MentionableSelectMenuBuilder();
                if (default_mentionables) {
                    selectMenu.setDefaultValues(default_mentionables.split(",").map((id) => id.trim()));
                }
                break;
            case "channel":
                selectMenu = new ChannelSelectMenuBuilder();
                if (channel_type && Array.isArray(channel_type)) {
                    selectMenu.addChannelTypes(...channel_type.map((v) => parseInt(v)));
                }
                break;
            default:
                selectMenu = new StringSelectMenuBuilder();
                if (options.length > 0) {
                    selectMenu.addOptions(options);
                }
                break;
        }

        selectMenu.setCustomId(custom_id);
        if (placeholder) selectMenu.setPlaceholder(placeholder);
        if (disabled) selectMenu.setDisabled(disabled);
        if (min_values) selectMenu.setMinValues(min_values);
        if (max_values) {
            selectMenu.setMaxValues(max_values);
        } else if (min_values) {
            selectMenu.setMaxValues(25);
        }
        if (required !== undefined) selectMenu.setRequired(required);

        const row = new ActionRowBuilder().addComponents(selectMenu);
        this.StoreOutputValue(row, "select_menu", cache, "inputBlock");

        if (executedFrom === "action") {
            this.RunNextBlock("action", cache);
        }
    }
};
