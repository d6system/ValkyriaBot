module.exports = {
    name: "Convert Object to Text (Stringify)",

    description: "Converts the object to text.",

    category: "Object Stuff",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "object",
            "name": "Object",
            "description": "Type: Object\n\nDescription: The object obtained if possible.",
            "types": ["object", "unspecified"],
            "required": true
        } 
    ],

    options: [
        {
            "id": "spaces",
            "name": "Spaces",
            "description": "Description: The amount of spaces to use for formatting. Use 0 for None. Default 4",
            "type": "number",
            "defaultValue": 4
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
            "id": "text",
            "name": "Text",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The text to convert.",
            "types": ["text", "unspecified"],
        }
    ],

    code(cache) {
        const obj = this.GetInputValue("object", cache);

        const spaces = this.GetOptionValue("spaces", cache);

        if(typeof obj !== "object") {
            this.StoreOutputValue("", "text", cache);
            this.RunNextBlock("action", cache);
            return;
        }

        const text = JSON.stringify(obj, null, spaces);

        this.StoreOutputValue(text, "text", cache);
        this.RunNextBlock("action", cache);
    }
}