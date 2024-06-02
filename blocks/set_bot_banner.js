module.exports = {
    name: "Set Bot Banner",

    description: "Sets the Banner for your bot.",

    category: "Bot Stuff",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            id: "image",
            name: "URL / Path",
            description: "Acceptable Types: Text\n\nDescription: The Image URL or File Path to use.",
            types: ["text", "unspecified"]
        }
    ],

    options: [],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        },
        {
            "id": "error",
            "name": "Error",
            "description": "Acceptable Types: Action\n\nDescription: Executes the following blocks if an error occurs.",
            "types": ["action"]
        }
    ],

    code(cache) {
        try {
            this.client.user.setBanner(this.GetOptionValue("image", cache));
            this.RunNextBlock("action", cache);            
        } catch (error) {
            this.console("WARN", `The "Set Bot Banner" block ${cache.index + 1} failed:\n${error}`)
            this.RunNextBlock("error", cache);
        }

    }
}