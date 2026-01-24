module.exports = {
    name: "Switch (conditional)",

    description: "compares the input to the values, and only runs the output of the matching case.",

    category: "Extras",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"],
            "required": true
        },
        {
            "id": "input",
            "name": "Input",
            "description": "Acceptable Types: Unspecified, Undefined, Null, Object, Boolean, Date, Number, Text\n\nDescription: the input for the switch.",
            "types": ["unspecified", "undefined", "null", "object", "boolean", "date", "number", "text"]
        },
        {
            "id": "values",
            "name": "Value",
            "description": "Acceptable Types: Unspecified, Undefined, Null, Object, Boolean, Date, Number, Text\n\nDescription: The 1st value to compare the 'Input' to.",
            "types": ["unspecified", "undefined", "null", "object", "boolean", "date", "number", "text"],
            "multiInput": true
        }
    ],

    options: [
        {
            "id": "operation",
            "name": "Comparison Type",
            "description": "Description: The type of comparison between the two values.",
            "type": "SELECT",
            "options": {
                "equal": "Equal To",
                "includes": "Includes"
            }
        },
        {
            "id": "match_all",
            "name": "Run All Matching Outputs",
            "description": "Description: Wether it should only run the output for the first match or outputs of all matching statements.",
            "type": "CHECKBOX",
            "defaultValue": false
        }
    ],

    outputs: [
        {
            "id": "outputs",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Runs this action if the 'input' matches 'Value 1.",
            "types": ["action"],
            "multiOutput": true
        }
    ],

    code(cache) {
        const input = this.GetInputValue("input", cache);
        var values = this.GetInputValue("values", cache);
        var operation = this.GetOptionValue("operation", cache);
        const match_all = this.GetOptionValue("match_all", cache);

        if (!input) operation = "equal"

        var outputs = cache.outputs.outputs;

        if (values.length < outputs.length) {
            outputs = outputs.splice(0, values.length);
            this.console("WARN", `The 'Switch Conditional' block (#${cache.index - 1}) has more outputs than inputs. This means that those extra outputs will never get triggered.`);
        };

        if (values.length > outputs.length) {
            this.console("WARN", `The 'Switch Conditional' block (#${cache.index - 1}) has more inputs than outputs. This means that those extra inputs will never get triggered.`);
        };

        var array = []

        if (operation === "equal") {
            for (const [index, value] of values.entries()) {
                if (value === input) {
                    array.push(outputs[index]);
                };
            };  
        } else if (operation === "includes") {
            for (const [index, value] of values.entries()) {
                if (input.includes(value)) {
                    array.push(outputs[index]);
                };
            };
        };

        cache.outputs = {outputs: array}

        if (!match_all) {
            cache.outputs = {outputs: [array[0]]}
        }
        
        this.RunNextBlock('outputs', cache);
    }
}