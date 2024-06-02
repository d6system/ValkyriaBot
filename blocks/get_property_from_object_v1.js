module.exports = {
    name: "Get Property From Object V1",

    description: "Gets the property from the object.",

    category: "Object Stuff",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Acceptable Types: Action\n\nDescription: Executes this block.",
            types: ["action"]
        },
        {
            id: "object",
            name: "Object",
            description: "Acceptable Types: Object, Unspecified\n\nDescription: The object to get the property.",
            types: ["object", "unspecified"],
            required: true
        },
        {
            id: "key",
            name: "Key",
            description: "Acceptable Types: Text, Unspecified\n\nDescription: The key of the property to get.",
            types: ["text", "unspecified"],
            multiInput: true
        }
    ],

    options: [],

    outputs: [
        {
            id: "action",
            name: "Action",
            description: "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            types: ["action"]
        },
        {
            id: "values",
            name: "Value",
            description: "Type: Object\n\nDescription: The property value obtained.",
            types: ["unspecified"],
            multiOutput: true
        }
    ],

    code(cache) {
        const object = this.GetInputValue("object", cache);
        var keys = this.GetInputValue("key", cache);
        var values = [];

        function findNestedValue(object, key) {
            const keys = key.split('.');
            let result = object;        
            for (const nestedKey of keys) {
                if (result && typeof result === 'object' && nestedKey in result) {
                    result = result[nestedKey];
                } else {
                    result = undefined;
                    break;
                }
            }        
            return result;
        }        
        
        for (const key of keys) {
            const value = findNestedValue(object, key);
            values.push(value);
        }                             

        this.StoreOutputValue(values, "values", cache);
        this.RunNextBlock("action", cache);
        
    }
}