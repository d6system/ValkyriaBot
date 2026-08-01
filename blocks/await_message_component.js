module.exports = {
    name: "Await Message Component",

    description: "Awaits for a message component (e.g. button) to execute.",

    category: "Message Stuff",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Acceptable Types: Action\n\nDescription: Executes this block.",
            types: ["action"]
        },
        {
            id: "message",
            name: "Message",
            description:
                "Acceptable Types: Object, Unspecified\n\nDescription: The message to await for the component.",
            types: ["object", "unspecified"],
            required: true
        },
        {
            id: "search_value",
            name: "Search Value",
            description:
                'Acceptable Types: Text, Unspecified\n\nDescription: The value according to your choice in the "Search Type" option.',
            types: ["text", "unspecified"],
            required: true
        },
        {
            id: "max_interactions",
            name: "Max Interactions",
            description:
                "Acceptable Types: Number, Unspecified\n\nDescription: The maximum total amount of interactions to collect until timeout. Set any number less than 1 to have no collection limit. Default: 1.",
            types: ["number", "unspecified"]
        },
        {
            id: "timeout",
            name: "Timeout",
            description:
                "Acceptable Types: Number, Unspecified\n\nDescription: The time in seconds to wait before not collecting data and being rejected. Default: 15 minutes.",
            types: ["number", "unspecified"]
        }
    ],

    options: [
        {
            id: "component_type",
            name: "Component Type",
            description:
                'Description: The type of component to filter. They also indicate the type of value to be returned in "Value List" output.',
            type: "SELECT",
            options: {
                2: "Button",
                3: "Text Select Menu (Text List)",
                5: "User Select Menu (User List)",
                6: "Role Select Menu (Role List)",
                7: "Mentionable Select Menu (User/Role List)",
                8: "Channel Select Menu (Channel List)"
            }
        },
        {
            id: "search_type",
            name: "Search Type",
            description:
                'Description: The type of search to find the message component. You need to put a value in the "Search Value" input.',
            type: "SELECT",
            options: {
                custom_id: "Custom ID",
                label: "Label"
            }
        }
    ],

    outputs: [
        {
            id: "action",
            name: "Action",
            description:
                "Type: Action\n\nDescription: Executes the following blocks after the message reaction(s) is/are received.",
            types: ["action"]
        },
        {
            id: "action2",
            name: "Action (Timeout)",
            description:
                "Type: Action\n\nDescription: Executes the following blocks after the timeout expires.",
            types: ["action"]
        },
        {
            id: "interaction",
            name: "Interaction",
            description:
                "Type: Object\n\nDescription: The interaction created by executing the message component.",
            types: ["object"]
        },
        {
            id: "value_list",
            name: "Value List",
            description:
                'Type: List\n\nDescription: The list containing the values indicated in the "Component Type" option.',
            types: ["list"]
        }
    ],

    code(cache) {
        const message = this.GetInputValue("message", cache)
        const search_value = this.GetInputValue("search_value", cache)
        const max_interactions = this.GetInputValue("max_interactions", cache, false, 1)
        const timeout = (this.GetInputValue("timeout", cache) || 15 * 60) * 1000
        const componentType = Number(this.GetOptionValue("component_type", cache))
        const search_type = this.GetOptionValue("search_type", cache)

        const collector = message.createMessageComponentCollector({
            filter: (interaction) => {
                switch (search_type) {
                    case "custom_id":
                        return interaction.customId === search_value
                    case "label":
                        return interaction.component?.label === search_value
                    default:
                        return false
                }
            },
            max: max_interactions < 1 ? undefined : max_interactions,
            time: timeout,
            componentType
        })

        collector.on("collect", (interaction) => {
            this.StoreOutputValue(interaction, "interaction", cache)

            let valueList
            switch (interaction.componentType) {
                case 3: // Text Select Menu
                    valueList = interaction.values
                    break
                case 5: // User Select Menu
                    valueList = interaction.users
                    break
                case 6: // Role Select Menu
                    valueList = interaction.roles
                    break
                case 7: // Mentionable Select Menu
                    valueList = interaction.roles.concat(
                        interaction.inGuild() ? interaction.members : interaction.users
                    )
                    break
                case 8: // Channel Select Menu
                    valueList = interaction.channels
                    break
            }

            this.StoreOutputValue(valueList ? Array.from(valueList.values()) : [], "value_list", cache)
            this.RunNextBlock("action", cache)
        })

        collector.once("end", (collected) => {
            if (max_interactions < 1 || collected.size < max_interactions) {
                this.RunNextBlock("action2", cache)
            }
        })
    }
}
