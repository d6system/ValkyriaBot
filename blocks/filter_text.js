module.exports = {
    name: "Filter Text",

    description: "Will Filter the Text by removing a list of characters from it.",

    category: "Extras",

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
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The Text to Filter.",
            "types": ["text", "unspecified"]
        },
        {
            "id": "regex",
            "name": "Custom Regex",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The Regex to Filter the Text. Works if the Type is set to \"Custom\".\n\nExample: [a-zA-Z] removes all letters from the text.",
            "types": ["text", "unspecified"]
        },
    ],

    options: [
        {
            "id": "type",
            "name": "Type to Remove",
            "description": "Description: The type of characters to remove from the text.",
            "type": "SELECT",
            "options": {
                "letters": "Letters",
                "numbers": "Numbers",
                "spaces": "Spaces",
                "special_chars": "Special Characters",
                "custom": "Custom"
            }
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
            "description": "Type: Text\n\nDescription: The Filtered Text.",
            "types": ["text", "unspecified"]
        }
    ],

    code(cache) {
        const text = this.GetInputValue("text", cache);
        const type = this.GetOptionValue("type", cache);
        const regex = this.GetInputValue("regex", cache);

        let regexStr = "";
        switch(type) {
            case "letters":
                regexStr = "[a-zA-Z]";
                break;
            case "numbers":
                regexStr = "[0-9]";
                break;
            case "spaces":
                regexStr = "[ ]";
                break;
            case "special_chars":
                regexStr = "[^a-zA-Z0-9 ]";
                break;
            case "custom":
                regexStr = regex;
                break;
        }

        const filteredText = text.replace(new RegExp(regexStr, "g"), "");
        
        this.StoreOutputValue(filteredText, "text", cache);
        this.RunNextBlock("action", cache);
    }
}