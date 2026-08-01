module.exports = {
    name: "Text Line",

    description: "Creates a text on a single line to use it in your blocks.",

    category: "Inputs",

    auto_execute: true,

    inputs: [],

    options: [
        {
            "id": "text",
            "name": "",
            "description": "Description: The text to set.",
            "type": "TEXT_LINE"
        }
    ],

    outputs: [
        {
            "id": "text",
            "name": "Text",
            "description": "Type: Text\n\nDescription: The text.",
            "types": ["text"]
        }
    ],

    code(cache) {
        this.StoreOutputValue(this.GetOptionValue("text", cache), "text", cache, "inputBlock");
    }
}