module.exports = {
    name: "Bcrypt Compare",

    description: "this block compares 2 values",

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
            "description": "Acceptable Types: Text\n\nDescription: The text to compare.",
            "types": ["text", "unspecified"],
            "required": true
        },
        {
            "id": "hash",
            "name": "Hash",
            "description": "Acceptable Types: Text, unspecified\n\nDescription: The Hash to compare.",
            "types": ["text", "unspecified"],
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
            "id": "isvalid",
            "name": "isEqual",
            "description": "Type: Boolean\n\nDescription: outputs true if it was the correct text",
            "types": ["boolean"]
        }
    ],

    async code(cache) {
        const bcrypt = await this.require('bcrypt');

        const text = this.GetInputValue("text", cache);
        const hash = this.GetInputValue("hash", cache);

        const compared = bcrypt.compareSync(text, hash);
        
        this.StoreOutputValue(compared, "isvalid", cache);
        this.RunNextBlock("action", cache);
    }
}