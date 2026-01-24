module.exports = {
    name: "Check If User Is Banned",

    description: "Checks if a user is banned on the server and provides the ban reason.",

    category: "Moderation",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"],
            "required": true
        },
        {
            "id": "server",
            "name": "Server",
            "description": "Acceptable Types: Object, Unspecified\n\nDescription: The server to check the ban status.",
            "types": ["object", "unspecified"],
            "required": true
        },
        {
            "id": "user_id",
            "name": "User ID",
            "description": "Acceptable Types: Text, Number, Unspecified\n\nDescription: The ID of the user to check.",
            "types": ["text", "number", "unspecified"],
            "required": true
        }
    ],

    outputs: [
        {
            "id": "action_true",
            "name": "Action (If True)",
            "description": "Type: Action\n\nDescription: Executes if the user is banned.",
            "types": ["action"]
        },
        {
            "id": "action_false",
            "name": "Action (If False)",
            "description": "Type: Action\n\nDescription: Executes if the user is not banned.",
            "types": ["action"]
        },
        {
            "id": "reason",
            "name": "Ban Reason",
            "description": "Type: Text\n\nDescription: The reason the user was banned. Empty if no reason was provided.",
            "types": ["text"]
        }
    ],

    async code(cache) {
        const server = this.GetInputValue("server", cache);
        const userId = this.GetInputValue("user_id", cache);

        try {
            const banInfo = await server.bans.fetch(userId).catch(error => {
                if (error.code === 10026) {
                    // If the user is not banned, trigger the False Action
                    return null;
                }
                throw error; // Propagate unexpected errors
            });

            if (banInfo) {
                this.StoreOutputValue(banInfo.reason || "No reason provided.", "reason", cache);
                this.RunNextBlock("action_true", cache);
            } else {
                this.RunNextBlock("action_false", cache);
            }
        } catch (error) {
            console.error("Unexpected error checking ban status:", error);
            this.RunNextBlock("action_false", cache);
        }
    }
};
