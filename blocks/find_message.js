module.exports = {
    name: "Find Message",

    description: "Finds a message.",

    category: "Message Stuff",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "channel",
            "name": "Channel",
            "description": "Acceptable Types: Object, Unspecified\n\nDescription: The channel to find the message. If possible, use this input to avoid finding the message on an unintended channel. (OPTIONAL)",
            "types": ["object", "unspecified"]
        },
        {
            "id": "search_value",
            "name": "Search Value",
            "description": "Acceptable Types: Unspecified, Text, Object\n\nDescription: The value according to your choice in the \"Find Message By\" option.",
            "types": ["unspecified", "text", "object"],
            "required": true
        }
    ],

    options: [
        {
            "id": "find_message_by",
            "name": "Find Message By",
            "description": "Description: The search type for the message.",
            "type": "SELECT",
            "options": {
                "id": "Message ID (Requires Channel to find uncached messages)",
                "author_user": "Message Author [User]",
                "author_member": "Message Author [Member] (Server Only)",
                "content": "Message Content",
                "clean_content": "Message Clean Content",
                "server": "Message Server (Server Only)",
                "url": "Message URL",
            }
        }
    ],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes block.",
            "types": ["action"]
        },
        {
            "id": "message",
            "name": "Message",
            "description": "Type: Object\n\nDescription: The message found if possible.",
            "types": ["object"]
        }
    ],

    async code(cache) {
        const channel = this.GetInputValue("channel", cache);
        const search_value = this.GetInputValue("search_value", cache);
        const find_message_by = this.GetOptionValue("find_message_by", cache);

        let result;

        if (find_message_by === "url") {
            const regex = /https:\/\/discord\.com\/channels\/(\d+)\/(\d+)\/(\d+)/;
            const match = search_value.match(regex);

            if (match) {
                const [, guildId, channelId, messageId] = match;

                try {
                    // Channel thingy
                    const fetchedChannel = await this.client.channels.fetch(channelId);

                    // Message thingy
                    result = await fetchedChannel.messages.fetch(messageId);
                } catch (error) {
                    console.error("Error fetching message by URL:", error);
                }
            } else {
                console.error("Invalid URL");
            }
        } else if (find_message_by === "id" && channel) {
            try {
                result = await channel.messages.fetch(search_value);
            } catch (e) {
                console.error("Error fetching message by ID:", e);
            }
        } else {
            const messages = channel ? await channel.messages.fetch({ force: true }) : this.client.channels.cache.reduce((accumulator, channel) => {
                if (channel.messages) {
                    return accumulator.concat(Array.from(channel.messages.cache.values()));
                }
                return accumulator;
            }, []);

            switch (find_message_by) {
                case "id":
                    result = messages.find(c => c.id == search_value);
                    break;
                case "author_user":
                    result = messages.find(c => c.author.id == search_value);
                    break;
                case "author_member":
                    result = messages.find(c => c.member.id == search_value);
                    break;
                case "content":
                    result = messages.find(c => c.content == search_value);
                    break;
                case "clean_content":
                    result = messages.find(c => c.cleanContent == search_value);
                    break;
                case "server":
                    result = messages.find(c => c.guild.id == search_value);
                    break;
            }
        }

        this.StoreOutputValue(result, "message", cache);
        this.RunNextBlock("action", cache);
    }
}
