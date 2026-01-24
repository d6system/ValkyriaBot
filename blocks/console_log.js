module.exports = {
    name: "Console Log",

    description: "Sends a value to your console. Useful for inspecting lists and objects or something else.",

    category: "Extras",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "value",
            "name": "Value",
            "description": "Acceptable Types: Unspecified, Undefined, Null, Object, Boolean, Date, Number, Text, List\n\nDescription: The value to send to your console.",
            "types": ["unspecified", "undefined", "null", "text", "object", "boolean", "date", "number", "list"],
            "multiInput": true
        }
    ],

    options: [
        {
            id: "value",
            name: "Value",
            description: "Description: The value of the Console Log",
            type: "TEXT"
        }
    ],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        }
    ],

    code(cache) {
        var value = this.GetInputValue("value", cache);
        if (value[0] == undefined) {
            value = [this.GetOptionValue("value", cache)];
        }

        for(let i = 0; i < value.length; i++){
            console.log(value[i]);
          }

        this.RunNextBlock("action", cache);
    }
}