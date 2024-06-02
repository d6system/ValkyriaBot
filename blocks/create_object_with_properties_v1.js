module.exports = {
    name: "Create Object With Properties V1",

    description: "Create an object to use it in your blocks.",

    category: "Object Stuff",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Acceptable Types: Action\n\nDescription: Executes this block.",
            types: ["action"]
        },
        {
            id: "key",
            name: "Key",
            description: "Acceptable Types: Text, Unspecified\n\nDescription: The key for this object property.",
            types: ["text", "unspecified"],
            multiInput: true
        },
        {
            id: "value",
            name: "Value",
            description: "Acceptable Types: Unspecified, Undefined, Null, Object, Boolean, Date, Number, Text, List\n\nDescription: The value for this object property.",
            types: ["unspecified", "undefined", "null", "object", "boolean", "date", "number", "text", "list"],
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
            id: "object",
            name: "Object",
            description: "Type: List\n\nDescription: This empty object created.",
            types: ["object"]
        }
    ],

    code(cache) {
        const object = {};
        const newkeys = this.GetInputValue("key", cache);
        const values = this.GetInputValue("value", cache);

        function addPropertyToNestedKeys(obj, keys, propName, propValue) {
            let currentObj = obj;
            for (let key of keys) {
                if (!currentObj[key]) {
                    currentObj[key] = {};
                }
                currentObj = currentObj[key];
            }
            currentObj[propName] = propValue;
        }

        for (const [index, key] of newkeys.entries()) {
            let result = object;
            let searchKey = key.includes('.') ? key.split('.') : [key];
            let finalKey = searchKey.pop();    
            addPropertyToNestedKeys(result, searchKey, finalKey, values[index]);
        }   

        this.StoreOutputValue(object, "object", cache);
        this.RunNextBlock("action", cache);
    }
}