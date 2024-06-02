module.exports = {
    name: "End Discord Poll",

    description: "Will Instantly End a Message Poll in a channel.",

    category: "Extras",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "message",
            "name": "Message",
            "description": "Acceptable Types: Object, Unspecified\n\nDescription: The message to end the poll.",
            "types": ["object", "unspecified"],
            "required": true
        }
    ],

    options: [],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "message",
            "name": "Message",
            "description": "Type: Object\n\nDescription: The message that was sent.",
            "types": ["object", "unspecified"]
        },
        {
            "id": "poll",
            "name": "Poll",
            "description": "Type: Object\n\nDescription: The poll that was ended.",
            "types": ["object", "unspecified"]
        },
        {
            "id": "action_error",
            "name": "Action Error",
            "description": "Type: Action Error\n\nDescription: The error that occurred during the action.",
            "types": ["action"]
        }
    ],

    async code(cache, DBB) {
        const message = this.GetInputValue("message", cache);

        if(message.poll) {
            message.poll.end().then((message) => {
                this.StoreOutputValue(message, "message", cache);
                this.StoreOutputValue(message.poll, "poll", cache);
                this.RunNextBlock("action", cache);
            });
        } else {
            this.RunNextBlock("action_error", cache);
        }
    }
};