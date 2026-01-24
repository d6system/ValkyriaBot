module.exports = {
    name: "Merge Actions & Objects",

    description: "Merge multiple Objects and Actions together to one.",

    category: "Object Stuff",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"],
            "multiInput": true
        },
        {
            "id": "object",
            "name": "Object",
            "description": "Acceptable Types: Unspecified, Undefined, Null, Object, Boolean, Number, Text, List\n\nDescription: A Object to merge.",
            "types": ["object", "unspecified", "undefined", "null", "boolean", "number", "text", "list"],
            "multiInput": true
        }
    ],

    options: [],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks.",
            "types": ["action"]
        },
        {
            "id": "object",
            "name": "Object",
            "description": "Acceptable Types: Action\n\nDescription: The Object that was merged.",
            "types": ["object", "unspecified"]
        },
    ],

    code: function(cache, DBB) {
        const arr = this.GetInputValue("object", cache)
        this.StoreOutputValue(arr.find((item) => item !== undefined), "object", cache)
        this.RunNextBlock("action", cache);
        Object.entries(cache.inputs).flat().forEach((item) => {
            if(item.includes("action") || item.includes("object")) return;
            if(Object.entries(DBB.Blocks.inputs).flat().find(item2 => typeof item2 == "object" ? item2[item] : false)) delete Object.entries(DBB.Blocks.inputs).flat().find(item2 => typeof item2 == "object" ? item2[item] : false)[item];
        });
    }
}