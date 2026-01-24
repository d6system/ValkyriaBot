module.exports = {
    name: "Check Difference",

    description: "Compares two values by the selected comparison type.",

    category: "Extras",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "value1",
            "name": "Value 1",
            "description": "Acceptable Types: Unspecified, Undefined, Null, Object, Boolean, Date, Number, Text, List\n\nDescription: The value 1 to compare with the value 2.",
            "types": ["unspecified", "undefined", "null", "object", "boolean", "date", "number", "text", "list"],
            "required": true
        },
        {
            "id": "value2",
            "name": "Value 2",
            "description": "Acceptable Types: Unspecified, Undefined, Null, Object, Boolean, Date, Number, Text, List\n\nDescription: The value 2 to compare with the value 1.",
            "types": ["unspecified", "undefined", "null", "object", "boolean", "date", "number", "text", "list"]
        }
    ],

    options: [
        {
            "id": "comparison_type",
            "name": "Comparison Type",
            "description": "Description: The type of comparison between the two values.",
            "type": "SELECT",
            "options": {
                "equal": "Equal To",
                "not_equal": "Not Equal",
                "equals_exactly": "Equal Exactly",
                "not_equal_exactly": "Not Equal Exactly",
                "greater_than": "Greater Than",
                "less_than": "Less Than",
                "greater_than_or_equal": "Greater Than or Equal To",
                "less_than_or_equal": "Less Than or Equal To",
                "start_with": "Start With",
                "end_with": "End With",
                "includes": "Includes",
                "match_regexp": "Match RegExp"
            }
        },
        {
            "id": "value2",
            "name": "Value 2",
            "description": "The value 2 to compare with the value 1.",
            "type": "TEXT"
        }
    ],

    outputs: [
        {
            "id": "action1",
            "name": "Action (If True)",
            "description": "Type: Action\n\nDescription: Executes the following blocks if true.",
            "types": ["action"]
        },
        {
            "id": "action2",
            "name": "Action (If False)",
            "description": "Type: Action\n\nDescription: Executes the following blocks if false.",
            "types": ["action"]
        },
        {
            "id": "diff",
            "name": "Value Difference",
            "description": "The difference between Value 1 and Value 2.",
            "types": ["unspecified", "undefined", "null", "object", "boolean", "date", "number", "text", "list"]
        }
    ],

    code(cache) {
        const value1 = this.GetInputValue("value1", cache);
        const value2 = this.GetInputValue("value2", cache) || this.GetOptionValue("value2", cache);
        const comparison_type = this.GetOptionValue("comparison_type", cache) + "";

        const comparisons = {
            equal: (a, b) => a == b,
            not_equal: (a, b) => a != b,
            equals_exactly: (a, b) => a === b,
            not_equal_exactly: (a, b) => a !== b,
            greater_than: (a, b) => a > b,
            less_than: (a, b) => a < b,
            greater_than_or_equal: (a, b) => a >= b,
            less_than_or_equal: (a, b) => a <= b,
            start_with: (a, b) => typeof a === 'string' && a.startsWith(b),
            end_with: (a, b) => typeof a === 'string' && a.endsWith(b),
            includes: (a, b) => Array.isArray(a) && a.includes(b),
            match_regexp: (a, b) => new RegExp(b).test(a)
        };

        const result = comparisons[comparison_type](value1, value2);

        let diff = "";
        if (Array.isArray(value1) && Array.isArray(value2)) {
            const added = value2.filter(x => !value1.includes(x)).map(x => `+ ${x}`);
            const removed = value1.filter(x => !value2.includes(x)).map(x => `- ${x}`);
            diff = [...added, ...removed].join(' ');
        }

        this.StoreOutputValue(diff, "diff", cache);
        this.RunNextBlock(result ? "action1" : "action2", cache);
    }
}
