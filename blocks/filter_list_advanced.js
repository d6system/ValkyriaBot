module.exports = {
    name: "Filter List (Advanced)",

    description: "Filters the list by comparing the list items to a value. If the list item does not match, it will be deleted.",

    category: "List Stuff",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "list",
            "name": "List",
            "description": "Acceptable Types: List, Unspecified\n\nDescription: The list to filter.",
            "types": ["list", "unspecified"],
            "required": true
        },
        {
            "id": "property",
            "name": "Property",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The Object Property you want to filter for.",
            "types": ["text", "unspecified"]
        },
        {
            "id": "value",
            "name": "Value",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The Value the object property should have.",
            "types": ["text", "unspecified"]
        }
    ],

    options: [
        {
            "id": "method",
            "name": "Method",
            "description": "Description: The Method how it should find the Object",
            "type": "SELECT",
            "options": {
                "includes": "Includes",
                "equals": "Equals",
                "not_equal": "Not Equal",
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
            "id": "property",
            "name": "Property",
            "description": "Description: The Object Property you want to filter for.",
            "type": "text"
        },
        {
            "id": "value",
            "name": "Value",
            "description": "Description: The Value the object property should have.",
            "type": "text"
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
            "id": "list",
            "name": "List",
            "description": "Type: List\n\nDescription: The list filtered.",
            "types": ["list"]
        }
    ],

    code(cache) {
        const list = this.GetInputValue("list", cache);
        const property = this.GetInputValue("property", cache) || this.GetOptionValue("property", cache);
        const value = this.GetInputValue("value", cache) || this.GetOptionValue("value", cache);
        const method = this.GetOptionValue("method", cache);

        let result = list;
        if ((value || value !== "") && (property || property !== "")) {
                switch(method) {
                    case "includes":                 
                        result = list.filter(x => eval(`x?.${property}?.includes(value)`));
                        break;
                    case "equals":
                        result = list.filter(x => eval(`x?.${property} == value`));
                        break;
                    case "not_equal":
                        result = list.filter(x => eval(`x?.${property} != value`));
                        break;
                    case "greater_than":
                        result = list.filter(x => eval(`x?.${property} > value`));
                        break;
                    case "less_than":
                        result = list.filter(x => eval(`x?.${property} < value`));
                        break;
                    case "greater_than_or_equal":
                        result = list.filter(x => eval(`x?.${property} >= value`));
                        break;
                    case "less_than_or_equal":
                        result = list.filter(x => eval(`x?.${property} <= value`));
                        break;
                    case "start_with":
                        result = list.filter(x => eval(`x?.${property}.startsWith(value)`));
                        break;
                    case "end_with":
                        result = list.filter(x => eval(`x?.${property}.endsWith(value)`));
                        break;
                    case "includes":
                        result = list.filter(x => eval(`x?.${property}.includes(value)`));
                        break;
                    case "match_regexp":
                        result = list.filter(x => eval(`x?.${property}.match(value)`));
                        break;
                }
        }

        this.StoreOutputValue(result, "list", cache);
        this.RunNextBlock("action", cache);
    }
}