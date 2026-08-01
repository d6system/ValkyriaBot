module.exports = {
    name: "Create Select Menu (Component)",

    description: "Creates a select menu component for messages.",

    category: "Message Stuff",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Acceptable Types: Action\n\nDescription: Executes this block.",
            types: ["action"]
        },
        {
            id: "custom_id",
            name: "Custom ID",
            description:
                "Acceptable Types: Text, Unspecified\n\nDescription: The custom id for the select menu.",
            types: ["text", "unspecified"],
            required: true
        },
        {
            id: "placeholder",
            name: "Placeholder",
            description:
                "Acceptable Types: Text, Unspecified\n\nDescription: The placeholder for the select menu.",
            types: ["text", "unspecified"]
        },
        {
            id: "disabled",
            name: "Disabled?",
            description:
                "Acceptable Types: Boolean, Unspecified\n\nDescription: Whether the select menu is disabled.",
            types: ["boolean", "unspecified"]
        },
        {
            id: "min_values",
            name: "Min Values",
            description:
                "Acceptable Types: Number, Unspecified\n\nDescription: The minimum values that must be selected. Default: 1",
            types: ["number", "unspecified"]
        },
        {
            id: "max_values",
            name: "Max Values",
            description:
                "Acceptable Types: Number, Unspecified\n\nDescription: The maximum values that must be selected. Default: 1",
            types: ["number", "unspecified"]
        },
        {
            id: "options",
            name: "Options",
            description:
                "Acceptable Types: Object, Unspecified\n\nDescription: The options for the Text Select Menu ONLY.",
            types: ["object", "unspecified"],
            multiInput: true
        }
    ],

    options: [
        {
            id: "select_menu_type",
            name: "Select Menu Type",
            description: "The type of select menu.",
            type: "SELECT",
            options: {
                text: "Text (Standart)",
                user: "Users",
                role: "Roles",
                mentionable: "Mentionables",
                channel: "Channel"
            }
        },
        {
            id: "channel_type",
            name: "Channel Type",
            description:
                'Description: The channel type for this select menu if the "Select Menu Type" is "Channel".',
            type: "SELECT",
            options: {
                Any: "Any",
                TextableChannel: "Textable Channel",
                VocalizableChannel: "Vocalizable Channel",
                GuildText: "Text Channel",
                GuildVoice: "Voice Channel",
                GuildStageVoice: "Stage Channel",
                Announcement: "Announcement",
                GuildAnnouncement: "Announcement Channel",
                AnnouncementThread: "Announcement Thread",
                Thread: "Thread",
                PublicThread: "Public Thread",
                PrivateThread: "Private Thread",
                GuildForum: "Forum Channel",
                GuildCategory: "Category"
            }
        }
    ],

    outputs: [
        {
            id: "action",
            name: "Action",
            description:
                "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            types: ["action"]
        },
        {
            id: "select_menu",
            name: "Select Menu (Component)",
            description: "Type: Object\n\nDescription: The select menu component.",
            types: ["object"]
        }
    ],

    code(cache) {
        const {
            ActionRowBuilder,
            StringSelectMenuBuilder,
            UserSelectMenuBuilder,
            RoleSelectMenuBuilder,
            MentionableSelectMenuBuilder,
            ChannelSelectMenuBuilder,
            ChannelType
        } = require("discord.js")

        const custom_id = this.GetInputValue("custom_id", cache)
        const placeholder = this.GetInputValue("placeholder", cache)
        const disabled = this.GetInputValue("disabled", cache)
        const min_values = this.GetInputValue("min_values", cache)
        const max_values = this.GetInputValue("max_values", cache)
        const options = this.GetInputValue("options", cache).filter((a) => a)
        const select_menu_type = this.GetOptionValue("select_menu_type", cache)
        const channel_type = this.GetOptionValue("channel_type", cache)

        let selectMenu
        switch (select_menu_type) {
            default:
            case "text":
                selectMenu = new StringSelectMenuBuilder()
                selectMenu.addOptions(options)
                break
            case "user":
                selectMenu = new UserSelectMenuBuilder()
                break
            case "role":
                selectMenu = new RoleSelectMenuBuilder()
                break
            case "mentionable":
                selectMenu = new MentionableSelectMenuBuilder()
                break
            case "channel":
                selectMenu = new ChannelSelectMenuBuilder()
                switch (channel_type) {
                    case "TextableChannel":
                        selectMenu.addChannelTypes(
                            ChannelType.GuildText,
                            ChannelType.GuildAnnouncement,
                            ChannelType.AnnouncementThread,
                            ChannelType.PublicThread,
                            ChannelType.PrivateThread,
                            ChannelType.GuildForum
                        )
                        break
                    case "VocalizableChannel":
                        selectMenu.addChannelTypes(
                            ChannelType.GuildVoice,
                            ChannelType.GuildStageVoice
                        )
                        break
                    case "Announcement":
                        selectMenu.addChannelTypes(
                            ChannelType.GuildAnnouncement,
                            ChannelType.AnnouncementThread
                        )
                        break
                    case "Thread":
                        selectMenu.addChannelTypes(
                            ChannelType.PublicThread,
                            ChannelType.PrivateThread,
                            ChannelType.AnnouncementThread
                        )
                        break
                    default:
                        if (channel_type !== "Any") {
                            selectMenu.addChannelTypes(ChannelType[channel_type])
                        }
                        break
                }
                break
        }

        selectMenu.setCustomId(custom_id)

        if (placeholder) selectMenu.setPlaceholder(placeholder)
        if (disabled) selectMenu.setDisabled(disabled)
        if (min_values) selectMenu.setMinValues(min_values)
        if (max_values) {
            selectMenu.setMaxValues(max_values)
        } else if (min_values) {
            selectMenu.setMaxValues(25)
        }

        const row = new ActionRowBuilder().addComponents(selectMenu)

        this.StoreOutputValue(row, "select_menu", cache)
        this.RunNextBlock("action", cache)
    }
}
