module.exports = {
    name: "Interaction [Event]",

    description: "This block will trigger when an interaction occurs.",

    category: "Interaction Stuff",

    auto_execute: true,

    options(data) {
        const isChatInput = ["slash", "userinstallcommand", "usercontext", "messagecontext", "autocomplete"].includes(data?.options?.type || "slash");
        const isContextMenu = ["messagecontext", "usercontext"].includes(data?.options?.type || "slash");
        const isSelectMenu = ["stringmenu", "rolemenu", "usermenu", "channelmenu", "mentionmenu"].includes(data?.options?.type || "slash");
        let options = [
            {
                id: "type",
                name: "Interaction Type",
                description: "The type of the interaction to filter for.",
                type: "SELECT",
                defaultValue: "slash",
                options: [
                    {
                        type: "GROUP",
                        name: "Chat Input",
                        description: "The interaction is a chat input command.",
                        options: [
                            { id: "slash", name: "Slash Command" },
                            { id: "userinstallcommand", name: "User Installed Command" },
                            { id: "autocomplete", name: "Auto Complete" },
                            {
                                type: "GROUP",
                                name: "User Context Menu",
                                options: [
                                    { id: "messagecontext", name: "Message Context Menu" },
                                    { id: "usercontext", name: "User Context Menu" },
                                ],
                            },
                        ],
                    },
                    {
                        type: "GROUP",
                        name: "Component",
                        description: "The interaction is a component interaction.",
                        options: [
                            { id: "button", name: "Button" },
                            { id: "modal", name: "Modal" },
                        ],
                    },
                    {
                        type: "GROUP",
                        name: "Select Menus",
                        description: "The interaction is a select menu interaction.",
                        options: [
                            { id: "stringmenu", name: "String Select Menu" },
                            { id: "rolemenu", name: "Role Select Menu" },
                            { id: "usermenu", name: "User Select Menu" },
                            { id: "channelmenu", name: "Channel Select Menu" },
                            { id: "mentionmenu", name: "Mentionable Select Menu" },
                        ],
                    },
                ],
            },
            {
                id: isChatInput ? "command" : "id",
                name: isChatInput ? "Command Name" : "Custom ID",
                description: isChatInput ? "The name of the command to filter for." : "The Id of the Button, Modal or Select Menu to filter for.",
                type: "text",
            },
        ];

        if (isChatInput && !isContextMenu) {
            options.push(
                {
                    id: "sub",
                    name: "Subcommand Name",
                    description: "The Subcommand to filter for.",
                    type: "text",
                },
                {
                    id: "group",
                    name: "Subcommand Group Name",
                    description: "The Subcommand Group to filter for.",
                    type: "text",
                }
            );
        }

        if (isSelectMenu) {
            options.push({
                id: "value",
                name: "Menu Option Value",
                description: "The value of the select menu option to filter for.",
                type: "text",
            });
        }

        options.push({
            id: "comparison",
            name: "Comparison Type (ID)",
            description: "The type of comparison to use for the value.",
            type: "SELECT",
            options: {
                equals: "Equals",
                includes: "Includes",
                startsWith: "Starts With",
                endsWith: "Ends With",
                match: "Matches Regex",
            },
        });
        return options;
    },

    outputs(data) {
        const isUserInstallable = ["userinstallcommand"].includes(data?.options?.type || "slash");
        const isAutocomplete = ["autocomplete"].includes(data?.options?.type || "slash");
        const isChatInput = ["slash", "userinstallcommand", "usercontext", "messagecontext", "autocomplete"].includes(data?.options?.type || "slash");
        const isContextMenu = ["messagecontext", "usercontext"].includes(data?.options?.type || "slash");
        const isSelectMenu = ["stringmenu", "rolemenu", "usermenu", "channelmenu", "mentionmenu"].includes(data?.options?.type || "slash");
        const isComponent = ["button", "modal"].includes(data?.options?.type || "slash");

        const defaultOutputs = [
            {
                id: "user",
                name: "User",
                description: "The user who started the interaction event",
                types: ["object", "unspecified"],
            },
            {
                id: "member",
                name: "Member",
                description: "The member who started the interaction event",
                types: ["object", "unspecified"],
            },
            {
                id: "server",
                name: "Server",
                description: "The server that the interaction occured in",
                types: ["object", "unspecified"],
            },
            {
                id: "channel",
                name: "Channel",
                description: "The channel that the interaction occured in",
                types: ["object", "unspecified"],
            },
        ];

        const messageOutput = {
            id: "message",
            name: "Message",
            description: "The message that the component was sent with",
            types: ["object", "unspecified"],
        };

        let outputs = [
            {
                id: "action",
                name: "Action",
                description: "Executes the following blocks when this block finishes its task.",
                types: ["action"],
            },
        ];

        if (isChatInput) {
            defaultOutputs.forEach((output) => outputs.push(output));
            outputs.push(
                messageOutput,
                {
                    id: "name",
                    name: "Command Name",
                    description: "The name of the command",
                    types: ["text", "unspecified"],
                },
                {
                    id: "subcommandname",
                    name: "Subcommand Name",
                    description: "The name of the Subcommand",
                    types: ["text", "unspecified"],
                },
                {
                    id: "subcommandgroup",
                    name: "Subcommand Group Name",
                    description: "The name of the Subcommand Group",
                    types: ["text", "unspecified"],
                }
            );
        }

        if (isAutocomplete) {
            defaultOutputs.forEach((output) => outputs.push(output));
            outputs.push(
                messageOutput,
                {
                    id: "focused_name",
                    name: "Focused Name",
                    description: "The name of the focused Option",
                    types: ["text", "unspecified"],
                },
                {
                    id: "focused_value",
                    name: "Focused Value",
                    description: "The value of the focused Option",
                    types: ["text", "unspecified"],
                }
            );
        }

        if (isComponent) {
            defaultOutputs.forEach((output) => outputs.push(output));
            if (data?.options?.type === "button") outputs.push(messageOutput);
            outputs.push({
                id: "customid",
                name: "Custom ID",
                description: "The custom ID of the component",
                types: ["text", "unspecified"],
            });
        }

        if (isContextMenu) {
            switch (data?.options?.type) {
                case "messagecontext":
                    defaultOutputs.forEach((output) => outputs.push(output));
                    outputs.push(messageOutput);
                    break;
                case "usercontext":
                    defaultOutputs.forEach((output) => outputs.push(output));
                    outputs.push(
                        {
                            id: "targetuser",
                            name: "Target User",
                            description: "The user who the context menu was opened on",
                            types: ["object", "unspecified"],
                        },
                        {
                            id: "targetmember",
                            name: "Target Member",
                            description: "The member who the context menu was opened on",
                            types: ["object", "unspecified"],
                        }
                    );
                    break;
            }
        }

        if (isSelectMenu) {
            defaultOutputs.forEach((output) => outputs.push(output));
            outputs.push(messageOutput);
            switch (data?.options?.type) {
                case "stringmenu":
                    outputs.push({
                        id: "value",
                        name: "Option",
                        description: "The value of the select menu option",
                        types: ["text", "unspecified"],
                        max: 25,
                        multiport: true,
                    });
                    outputs.push({
                        id: "values",
                        name: "Options",
                        description: "The values of the select menu options",
                        types: ["list", "unspecified"]
                    });
                    break;
                case "rolemenu":
                    outputs.push({
                        id: "selectedroles",
                        name: "Selected Roles",
                        description: "The roles the user selected",
                        types: ["list", "unspecified"],
                    });
                    break;
                case "usermenu":
                    outputs.push({
                        id: "selectedusers",
                        name: "Selected Users",
                        description: "The Channel the User Selected",
                        types: ["list", "unspecified"],
                    });
                    break;
                case "channelmenu":
                    outputs.push({
                        id: "selectedchannels",
                        name: "Selected Channels",
                        description: "The Channel the User Selected",
                        types: ["list", "unspecified"],
                    });
                    break;
                case "mentionmenu":
                    outputs.push(
                        {
                            id: "selectedusers",
                            name: "Selected Users",
                            description: "The users selected in the menu",
                            types: ["list", "unspecified"],
                        },
                        {
                            id: "selectedmembers",
                            name: "Selected Members",
                            description: "The members selected in the menu",
                            types: ["list", "unspecified"],
                        },
                        {
                            id: "selectedroles",
                            name: "Selected Roles",
                            description: "The roles selected in the menu",
                            types: ["list", "unspecified"],
                        },
                        {
                            id: "selectedchannels",
                            name: "Selected Channels",
                            description: "The channels selected in the menu",
                            types: ["list", "unspecified"],
                        }
                    );
                    break;
            }
        }

        outputs.push({
            id: "interaction",
            name: "Interaction",
            description: "The interaction that started the event",
            types: ["object", "unspecified"],
        });
        return outputs;
    },

    async code(cache) {
        const type = this.GetOptionValue("type", cache);

        const comparison = this.GetOptionValue("comparison", cache) !== "" ? this.GetOptionValue("comparison", cache) : "equals";

        function compareValues(value, comparisonValue) {
            if (!comparisonValue) return true; // If no comparison value is provided, always return true
            switch (comparison) {
                case "equals":
                    return value === comparisonValue;
                case "includes":
                    return value.includes(comparisonValue);
                case "startsWith":
                    return value.startsWith(comparisonValue);
                case "endsWith":
                    return value.endsWith(comparisonValue);
                case "match":
                    return new RegExp(comparisonValue).test(value);
                default:
                    return false;
            }
        }

        this.events.on("interactionCreate", 
            /**
             * 
             * @param {import('discord.js').BaseInteraction} interaction 
             * @returns 
             */
            async (interaction) => {
            switch (type) {
                case "usercontext":
                case "messagecontext":
                    if (compareValues(interaction.commandName, this.GetOptionValue("command", cache))) {
                        if (type === "usercontext" && interaction.isUserContextMenuCommand()) {
                            this.StoreOutputValue(interaction.user, "user", cache);
                            this.StoreOutputValue(interaction.member, "member", cache);
                            this.StoreOutputValue(interaction.guild, "server", cache);
                            this.StoreOutputValue(interaction.channel, "channel", cache);
                            this.StoreOutputValue(interaction.targetUser, "targetuser", cache);
                            this.StoreOutputValue(interaction.targetMember, "targetmember", cache);
                            this.StoreOutputValue(interaction, "interaction", cache);
                            this.RunNextBlock("action", cache);
                        } else if (type === "messagecontext" && interaction.isMessageContextMenuCommand()) {
                            this.StoreOutputValue(interaction.user, "user", cache);
                            this.StoreOutputValue(interaction.member, "member", cache);
                            this.StoreOutputValue(interaction.guild, "server", cache);
                            this.StoreOutputValue(interaction.channel, "channel", cache);
                            this.StoreOutputValue(interaction.targetMessage, "message", cache);
                            this.StoreOutputValue(interaction, "interaction", cache);
                            this.RunNextBlock("action", cache);
                        }
                    }
                    break;
                case "slash":
                case "userinstallcommand":
                case "autocomplete":
                    if ((interaction.isCommand() || interaction.isAutocomplete()) && interaction.commandName === this.GetOptionValue("command", cache)) {
                        if (this.GetOptionValue("sub", cache) && interaction.options.getSubcommand(false) !== this.GetOptionValue("sub", cache))
                            return;
                        if (this.GetOptionValue("group", cache) && interaction.options.getSubcommandGroup() !== this.GetOptionValue("group", cache))
                            return;
                        this.StoreOutputValue(interaction.user, "user", cache);
                        this.StoreOutputValue(interaction.member, "member", cache);
                        this.StoreOutputValue(interaction.guild, "server", cache);
                        this.StoreOutputValue(interaction.channel, "channel", cache);
                        this.StoreOutputValue(interaction.message, "message", cache);
                        this.StoreOutputValue(interaction, "interaction", cache);
                        if (interaction.isCommand() && (type === "slash" || type === "userinstallcommand")) {
                            this.StoreOutputValue(interaction.options.getSubcommand(false), "subcommandname", cache);
                            this.StoreOutputValue(interaction.options.getSubcommandGroup(), "subcommandgroup", cache);
                            this.StoreOutputValue(interaction.commandName, "name", cache);
                            return this.RunNextBlock("action", cache);
                        }
                        if (type === "autocomplete" && interaction.isAutocomplete()) {
                            this.StoreOutputValue(interaction.options.getFocused(true).name, "focused_name", cache);
                            this.StoreOutputValue(interaction.options.getFocused(true).value, "focused_value", cache);
                            return this.RunNextBlock("action", cache);
                        }
                    }
                    break;
                case "button":
                    if (interaction.isButton() && compareValues(interaction.customId, this.GetOptionValue("id", cache))) {
                        this.StoreOutputValue(interaction.user, "user", cache);
                        this.StoreOutputValue(interaction.member, "member", cache);
                        this.StoreOutputValue(interaction.guild, "server", cache);
                        this.StoreOutputValue(interaction.channel, "channel", cache);
                        this.StoreOutputValue(interaction.message, "message", cache);
                        this.StoreOutputValue(interaction, "interaction", cache);
                        this.StoreOutputValue(interaction.customId, "customid", cache);
                        this.RunNextBlock("action", cache);
                    }
                    break;
                case "modal":
                    if (interaction.isModalSubmit() && compareValues(interaction.customId, this.GetOptionValue("id", cache))) {
                        this.StoreOutputValue(interaction.user, "user", cache);
                        this.StoreOutputValue(interaction.member, "member", cache);
                        this.StoreOutputValue(interaction.guild, "server", cache);
                        this.StoreOutputValue(interaction.channel, "channel", cache);
                        this.StoreOutputValue(interaction.message, "message", cache);
                        this.StoreOutputValue(interaction, "interaction", cache);
                        this.StoreOutputValue(interaction.customId, "customid", cache);
                        this.RunNextBlock("action", cache);
                    }
                    break;
                case "stringmenu":
                case "rolemenu":
                case "usermenu":
                case "channelmenu":
                case "mentionmenu":
                    let value = this.GetOptionValue("value", cache);
                    let customid = this.GetOptionValue("id", cache);
                    if (
                        (interaction.isStringSelectMenu() ||
                            interaction.isUserSelectMenu() ||
                            interaction.isRoleSelectMenu() ||
                            interaction.isMentionableSelectMenu() ||
                            interaction.isChannelSelectMenu())) {
                        if(value && !compareValues(interaction.values[0], value)) return;
                        if(customid && !compareValues(interaction.customId, customid)) return;
                        this.StoreOutputValue(interaction.user, "user", cache);
                        this.StoreOutputValue(interaction.member, "member", cache);
                        this.StoreOutputValue(interaction.guild, "server", cache);
                        this.StoreOutputValue(interaction.channel, "channel", cache);
                        this.StoreOutputValue(interaction, "interaction", cache);
                        this.StoreOutputValue(interaction.message, "message", cache);
                        if (type === "stringmenu" && interaction.isStringSelectMenu()) {
                            this.StoreOutputValue(interaction.values, "value", cache);
                            this.StoreOutputValue(interaction.values, "values", cache);
                            this.RunNextBlock("action", cache);
                        } else if (type === "rolemenu" && interaction.isRoleSelectMenu()) {
                            this.StoreOutputValue(interaction.roles?.toJSON(), "selectedroles", cache);
                            this.RunNextBlock("action", cache);
                        } else if (type === "usermenu" && interaction.isUserSelectMenu()) {
                            this.StoreOutputValue(interaction.users.toJSON(), "selectedusers", cache);
                            this.RunNextBlock("action", cache);
                        } else if (type === "channelmenu" && interaction.isChannelSelectMenu()) {
                            this.StoreOutputValue(interaction.channels.toJSON(), "selectedchannels", cache);
                            this.RunNextBlock("action", cache);
                        } else if (type === "mentionmenu" && interaction.isMentionableSelectMenu()) {
                            this.StoreOutputValue(interaction.users?.toJSON(), "selectedusers", cache);
                            this.StoreOutputValue(interaction.members?.toJSON(), "selectedmembers", cache);
                            this.StoreOutputValue(interaction.roles?.toJSON(), "selectedroles", cache);
                            this.StoreOutputValue(interaction.channels?.toJSON(), "selectedchannels", cache);
                            this.RunNextBlock("action", cache);
                        }
                    }
                    break;
            }
        });
    },
};
