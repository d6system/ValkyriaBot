module.exports = {

    name: "Create Selection Menu",

    description: "Create a selection menu.",

    category: "Menu",

    inputs(data) {
        return [
            {
                id: "action",
                name: "Action",
                description: "Executes this block.",
                types: ["action"]
            },
            
            ["select"].includes(data?.options?.menu_type || "select") ?
                {
                    id: "options",
                    name: "Option",
                    description: "The Menu component to add (Maximum of 25).",
                    types: ["object", "unspecified"],
                    multiInput: true,
                    required: true,
                    max: 25
                }
            : undefined,
            {
                id: "label",
                name: "Placeholder Label",
                description: "The Label of the Menu that is seen before a selection occurs.",
                types: ["text", "unspecified"]
            },
            {
                id: "id",
                name: "ID of the Menu",
                description: "The ID of the Menu.",
                types: ["text", "unspecified"]
            },
            {
                id: "maxvalues",
                name: "Max Possible Selects",
                description: "The Amount of Selects possible. Default: 1",
                types: ["number", "unspecified"]
            },
            {
                id: "minvalues",
                name: "Min Required Selects",
                description: "The Amount of Selects Needed. Default: 1",
                types: ["number", "unspecified"]
            }
        ]
    },
    

    options(data) {
        return [
            {
                id: "menu_type",
                name: "Menu Type",
                description: "The type of menu to create.",
                type: "SELECT",
                options: [
                    {
                        type: "GROUP",
                        name: "Requires External Options",
                        description: "The menu requires external options to be set.",
                        options: [
                            {id: "select", name: "Select Menu", description: "Allows the user to select from a list of pre-defined text options"}
                        ]
                    },
                    {
                        type: "GROUP",
                        name: "Standalone",
                        description: "The menu is standalone and does not require external options.",
                        options: [
                            {id: "channel", name: "Channel Selection Menu", description: "Allows the user to select from a list of channels"},
                            {id: "role", name: "Role Selection Menu", description: "Allows the user to select from a list of roles"},
                            {id: "user", name: "User Selection Menu", description: "Allows the user to select from a list of users"},
                            {id: "mentionable", name: "Mentionable Selection Menu", description: "Allows the user to select from a list of users and roles"},
                        ]
                    },
                ]
            },
            {
                id: "label",
                name: "Placeholder Label",
                description: "The Label of the Menu that is seen before a selection occurs.",
                type: "TEXT"
            },
            {
                id: "id",
                name: "ID of the Menu",
                description: "The ID of the Menu.",
                type: "TEXT"
            },
            data?.options?.menu_type == "channel" ?
                {
                    id: "channel",
                    name: "Channel Types",
                    description: "In this Field you are able to set which channel Types will be shown to select!\nYou use Numbers to specify which channel Types you want\nHere are some examples:\n\nGuildText: 0\nGuildVoice: 2\n\nSo if you want both you set here \"0,2\" to set both!\n\nYou can find all ChannelType Numbers here: \nhttps://discord-api-types.dev/api/discord-api-types-v10/enum/ChannelType\n\nThis is Optional! Default: All",
                    type: "MULTISELECT",
                    options: {
                        "0": "Text Channel",
                        "2": "Voice Channel",
                        "4": "Category",
                        "5": "Announcement Channel",
                        "10": "Thread (Public)",
                        "11": "Thread (Private)",
                        "12": "Thread (Stage)",
                        "13": "Stage Channel",
                        "15": "Forum Channel",
                        "16": "Media Channel"
                    },
                    allowUserOptions: false,
                    duplicates: false
                }
            : undefined,
            {
                id: "maxvalues",
                name: "Max Select Amount",
                description: "The Max amount of Selections the User is allowed to make!",
                type: "NUMBER",
            },
            {
                id: "minvalues",
                name: "Min Select Amount",
                description: "The Min amount of Selections the user is forced to make!",
                type: "NUMBER"
            }
        ]
    },

    outputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes the following blocks when this block finishes its task.",
            types: ["action"]
        },
        {
            id: "menu",
            name: "Menu",
            description: "The Menu Object.",
            types: ["object", "unspecified"]
        },
    ],

    async code(cache, DBB) {

        const { StringSelectMenuBuilder, ChannelSelectMenuBuilder, RoleSelectMenuBuilder, UserSelectMenuBuilder, MentionableSelectMenuBuilder } = require('discord.js');

        const menuType = this.GetOptionValue("menu_type", cache)
        const id = this.GetInputValue("id", cache) || this.GetOptionValue("id", cache);
        const label = this.GetInputValue("label", cache) || this.GetOptionValue("label", cache);
        const maxvalues = (parseInt(this.GetInputValue("maxvalues", cache)) || this.GetOptionValue("maxvalues", cache)) || 1;
        const minvalues = parseInt(this.GetInputValue("minvalues", cache)) || this.GetOptionValue("minvalues", cache);
        const channelTypes = this.GetOptionValue("channel", cache);

        let menu;

        switch (menuType) {
            case "select":
                let options = this.GetInputValue("options", cache);
                options = options.filter((option, index) => {
                    option = option[0]
                    if (option && option.description == '') option.description = undefined;
                    if (option && (option.label !== '' && option.value !== '')) {
                        return true;
                    } else if (option) {
                        if (!option.label && !option.value) {
                            DBB.Core.console("WARN", `The menu option #${index + 1} was removed from the 'Create Selection Menu' block (#${cache.index + 1}) as it does not have a label or a value`);
                        } else if (!option.label) {
                            DBB.Core.console("WARN", `The menu option #${index + 1} was removed from the 'Create Selection Menu' block (#${cache.index + 1}) as it does not have a label`);
                        } else if (!option.value) {
                            DBB.Core.console("WARN", `The menu option #${index + 1} was removed from the 'Create Selection Menu' block (#${cache.index + 1}) as it does not have a value`);
                        };
                        delete options[index];
                    };
                });
                
                menu = new StringSelectMenuBuilder()
                    .setCustomId(id)
                    .setPlaceholder(label)
                    .addOptions(options.flat())
                    .setMaxValues(maxvalues)
                .setMinValues(minvalues)

                break;
            case "channel":
                menu = new ChannelSelectMenuBuilder()
                    .setCustomId(id)
                    .setPlaceholder(label)
                    .setMaxValues(maxvalues)
                .setMinValues(minvalues)
    
                if(channelTypes) menu.setChannelTypes(channelTypes)

                break
            case "role":
                menu = new RoleSelectMenuBuilder()
                    .setCustomId(id)
                    .setPlaceholder(label)
                    .setMaxValues(maxvalues)
                .setMinValues(minvalues)

                break
            case "user":
                menu = new UserSelectMenuBuilder()
                    .setCustomId(id)
                    .setPlaceholder(label)
                    .setMaxValues(maxvalues)
                .setMinValues(minvalues)

                break
            case "mentionable":
                menu = new MentionableSelectMenuBuilder()
                    .setCustomId(id)
                    .setPlaceholder(label)
                    .setMaxValues(maxvalues)
                    .setMinValues(minvalues)

                break        
            default:
                break;
        }



        this.StoreOutputValue(menu, "menu", cache);
        this.RunNextBlock("action", cache);                
    }
}

