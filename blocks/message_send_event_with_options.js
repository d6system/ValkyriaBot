module.exports = {
    name: "Message Send with Options and Filtering Channel [Event]",

    description: "Triggers when a message is sent/created, with options to include/exclude bots and filter by channel name or ID.",

    category: "Events",

    auto_execute: true,

    inputs: [],

    options: [
        {
            "id": "bot_option",
            "name": "Trigger with Bots",
            "description": "Choose whether to trigger for bots, users, or both.",
            "type": "SELECT",
            "options": {
                "no_bots": "Without Bots",
                "only_bots": "Only Bots",
                "both": "Both"
            }
        },
        {
            "id": "channel_option",
            "name": "Channel Option",
            "description": "Choose whether to trigger in all channels or specific channels.",
            "type": "SELECT",
            "options": {
                "all": "All Channels",
                "specific": "Specific Channels (by Name or ID)"
            }
        },
        {
            "id": "channel_filter",
            "name": "Channel Name(s) / ID(s)",
            "description": "Specify the channel name(s) or ID(s) to trigger the event (comma-separated).",
            "type": "TEXT"
        }
    ],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        },
        {
            "id": "message",
            "name": "Message",
            "description": "Type: Object\n\nDescription: The message sent by the user.",
            "types": ["object"]
        },
        {
            "id": "server",
            "name": "Server",
            "description": "Type: Object\n\nDescription: The server the message was sent.",
            "types": ["object"]
        },
        {
            "id": "channel",
            "name": "Channel",
            "description": "Type: Object\n\nDescription: The channel the message was sent.",
            "types": ["object"]
        },
        {
            "id": "user",
            "name": "User",
            "description": "Type: Object\n\nDescription: The message author.",
            "types": ["object"]
        },
        {
            "id": "member",
            "name": "Member",
            "description": "Type: Object\n\nDescription: The message author as a server member.",
            "types": ["object"]
        },
        {
            "id": "is_reply",
            "name": "Is Reply",
            "description": "Type: Boolean\n\nDescription: Whether the message is a reply to another message.",
            "types": ["boolean"]
        }
    ],

    code(cache) {
        this.events.on("messageCreate", msg => {
            const botOption = this.GetOptionValue("bot_option", cache) || "no_bots";
            const channelOption = this.GetOptionValue("channel_option", cache) || "all";
            const channelFilter = (this.GetOptionValue("channel_filter", cache) || "").split(",").map(ch => ch.trim().toLowerCase());

            // Bot-Option-Filter
            if ((botOption === "no_bots" && msg.author.bot) ||
                (botOption === "only_bots" && !msg.author.bot)) {
                return;
            }

            // Channel-Filter (Name oder ID)
            if (channelOption === "specific") {
                const channelName = msg.channel?.name ? msg.channel.name.toLowerCase() : "";
                const channelId = msg.channel?.id ? msg.channel.id.toLowerCase() : "";

                if (!channelFilter.includes(channelName) && !channelFilter.includes(channelId)) {
                    return;
                }
            }

            // Event Trigger
            this.StoreOutputValue(msg, "message", cache);
            this.StoreOutputValue(msg.guild, "server", cache);
            this.StoreOutputValue(msg.channel, "channel", cache);
            this.StoreOutputValue(msg.author, "user", cache);
            this.StoreOutputValue(msg.member, "member", cache);
            this.StoreOutputValue(msg.type === 19 || Boolean(msg.reference), "is_reply", cache);
            this.RunNextBlock("action", cache);
        });
    }
}
