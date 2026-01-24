module.exports = {
    name: "Message User Reaction Add [Event]",

    description: "When an user reaction is added to a message, this event will trigger.",

    category: "Events",

    auto_execute: true,

    inputs: [],

    options: [],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        },
        {
            "id": "message_reaction",
            "name": "Message Reaction",
            "description": "Type: Object\n\nDescription: The message reaction the user was added.",
            "types": ["object", "unspecified"]
        },
        {
            "id": "member",
            "name": "Member",
            "description": "Type: Object\n\nDescription: The member who added the reaction to the message.",
            "types": ["object", "unspecified"]
        },
        {
            "id": "user",
            "name": "User",
            "description": "Type: Object\n\nDescription: The user who added the reaction to the message.",
            "types": ["object", "unspecified"]
        },
        {
            "id": "server",
            "name": "Server",
            "description": "Type: Object\n\nDescription: The server in which the reaction occured.",
            "types": ["object", "unspecified"]
        },
        {
            "id": "message",
            "name": "Message",
            "description": "Type: Object\n\nDescription: The message that the reaction was added to.",
            "types": ["object", "unspecified"]
        },
    ],

    async code(cache) {
        this.events.on("messageReactionAdd", async (message_reaction, user) => {
            this.StoreOutputValue(message_reaction, "message_reaction", cache);
            this.StoreOutputValue((await (await this.client.guilds.fetch(message_reaction.message.guild)).members.fetch(user.id)), "member", cache);
            this.StoreOutputValue(user, "user", cache);
            this.StoreOutputValue(message_reaction.message.guild, "server", cache);
            this.StoreOutputValue(message_reaction.message, "message", cache);
            this.RunNextBlock("action", cache);
        });
    }
}