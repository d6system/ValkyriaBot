module.exports = {
    name: "Bcrypt Hash",

    description: "this block generates a bcrypt hash",

    category: "MOD",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "text",
            "name": "Text",
            "description": "Acceptable Types: Text\n\nDescription: The text to hash.",
            "types": ["text", "unspecified"],
            "required": true
        },
        {
            "id": "salt_rounds",
            "name": "Salt Rounds",
            "description": "Acceptable Types: Number\n\nDescription: The salt rounds to use.",
            "types": ["number"],
            "required": true
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
            "id": "hash",
            "name": "Hash",
            "description": "Type: Text, unspecified\n\nDescription: The hash generated",
            "types": ["text", "unspecified"]
        }
    ],

    async code(cache) {
        const bcrypt = await this.require('bcrypt');

        const text = this.GetInputValue("text", cache);
        const salt_rounds = this.GetInputValue("salt_rounds", cache);

        const hash = await bcrypt.hash(text, salt_rounds);
        
        this.StoreOutputValue(hash, "hash", cache);
        this.RunNextBlock("action", cache);
    }
}