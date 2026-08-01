module.exports = {
    name: "Slash Command Option",

    description: "Creates an option for slash commands.",

    category: "Command Stuff",

    auto_execute: true,

    options: [
        {
            id: "name",
            name: "Name",
            description: "Description: The name for this slash command option. [REQUIRED]",
            type: "TEXT"
        },
        {
            id: "description",
            name: "Description",
            description: "Description: The description of this slash command option.",
            type: "TEXT"
        },
        {
            id: "required",
            name: "Required?",
            description: "Description: Whether this slash command option is required.",
            type: "CHECKBOX"
        },
        {
            id: "type",
            name: "Type",
            description: "Description: The type for this slash command option.",
            type: "SELECT",
            options: {
                3: "Text",
                4: "Integer (Whole Number)",
                10: "Number (Whole Number or Decimal)",
                5: "Boolean",
                6: "User",
                7: "Channel",
                8: "Role",
                9: "Mentionable"
            }
        },
        {
            id: "min_length",
            name: "Min Length/Value",
            description:
                "Description: The minimum length/value of text/number for this slash command option.",
            type: "NUMBER"
        },
        {
            id: "max_length",
            name: "Max Length/Value",
            description:
                "Description: The maximum length/value of text/number for this slash command option.",
            type: "NUMBER"
        },
        {
            id: "channel_type",
            name: "Channel Type",
            description:
                'Description: The channel type for this slash command option if the "Type" is "Channel".',
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
            id: "slash_command_option",
            name: "Slash Command Option",
            description: "Type: Object\n\nDescription: The slash command option.",
            types: ["object"]
        }
    ],

    code(cache) {
        const {
            SlashCommandStringOption,
            SlashCommandIntegerOption,
            SlashCommandBooleanOption,
            SlashCommandUserOption,
            SlashCommandChannelOption,
            SlashCommandRoleOption,
            SlashCommandMentionableOption,
            SlashCommandNumberOption,
            ChannelType
        } = require("discord.js")

        const name = this.GetOptionValue("name", cache)
        const description = this.GetOptionValue("description", cache) || " ឵"
        const required = this.GetOptionValue("required", cache)
        const type = Number(this.GetOptionValue("type", cache))
        const min_length = this.GetOptionValue("min_length", cache)
        const max_length = this.GetOptionValue("max_length", cache)
        const channel_type = this.GetOptionValue("channel_type", cache)

        let commandOption
        switch (type) {
            case 3:
                commandOption = new SlashCommandStringOption()
                break
            case 4:
                commandOption = new SlashCommandIntegerOption()
                break
            case 5:
                commandOption = new SlashCommandBooleanOption()
                break
            case 6:
                commandOption = new SlashCommandUserOption()
                break
            case 7:
                commandOption = new SlashCommandChannelOption()
                break
            case 8:
                commandOption = new SlashCommandRoleOption()
                break
            case 9:
                commandOption = new SlashCommandMentionableOption()
                break
            case 10:
                commandOption = new SlashCommandNumberOption()
                break
        }

        commandOption.setName(name).setDescription(description).setRequired(required)

        switch (type) {
            case 3: // String option
                if (max_length) commandOption.setMaxLength(max_length)
                if (min_length) commandOption.setMinLength(min_length)
                break
            case 4: // Integer option
            case 10: // Number option
                if (max_length) commandOption.setMaxValue(max_length)
                if (min_length) commandOption.setMinValue(min_length)
                break
            case 7: // Channel option
                switch (channel_type) {
                    case "TextableChannel":
                        commandOption.addChannelTypes(
                            ChannelType.GuildText,
                            ChannelType.GuildAnnouncement,
                            ChannelType.AnnouncementThread,
                            ChannelType.PublicThread,
                            ChannelType.PrivateThread,
                            ChannelType.GuildForum
                        )
                        break
                    case "VocalizableChannel":
                        commandOption.addChannelTypes(ChannelType.GuildVoice, ChannelType.GuildStageVoice)
                        break
                    case "Announcement":
                        commandOption.addChannelTypes(ChannelType.GuildAnnouncement, ChannelType.AnnouncementThread)
                        break
                    case "Thread":
                        commandOption.addChannelTypes(
                            ChannelType.PublicThread,
                            ChannelType.PrivateThread,
                            ChannelType.AnnouncementThread
                        )
                        break
                    default:
                        if (channel_type !== "Any") {
                            commandOption.addChannelTypes(ChannelType[channel_type])
                        }
                        break
                }
                break
        }

        this.StoreOutputValue(commandOption, "slash_command_option", cache, "inputBlock")
    }
}
