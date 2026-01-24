
module.exports = {
    name: "Check User Exists",

    description: "Checks if a Discord user exists by attempting to fetch the user by ID.",

    category: "User Stuff",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes this block.",
            types: ["action"]
        },
        {
            id: "user_id",
            name: "User ID",
            description: "The Discord User ID to check existence for.",
            types: ["text", "unspecified"],
            required: true
        }
    ],

    options: [],

    outputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes the following blocks after checking is complete.",
            types: ["action"]
        },
        {
            id: "exists",
            name: "Exists",
            description: "True if the user exists, false otherwise.",
            types: ["boolean"]
        },
        {
            id: "user",
            name: "User",
            description: "The Discord user object if found.",
            types: ["object", "unspecified"]
        }
    ],

    async code(cache) {
        const userId = this.GetInputValue("user_id", cache);
        const client = this.client;

        try {
            const user = await client.users.fetch(userId);
            this.StoreOutputValue(true, "exists", cache);
            this.StoreOutputValue(user, "user", cache);
        } catch (err) {
            this.StoreOutputValue(false, "exists", cache);
            this.StoreOutputValue(null, "user", cache);
        }

        this.RunNextBlock("action", cache);
    }
};
