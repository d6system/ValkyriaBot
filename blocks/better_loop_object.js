module.exports = {
    name: "Better Loop Object",

    description: "Loops the object. For each property in the object, this will return its key and value.",

    category: "Loop Stuff",

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
            "description": "Acceptable Types: Object, Unspecified\n\nDescription: The object to loop.",
            "types": ["object", "unspecified"]
        },
        {
            "id": "delay",
            "name": "Delay in Milliseconds",
            "description": "Acceptable Types: Number, Unspecified\n\nDescription: How long to wait between each loop.\n\nIf no number is given here, there will be no delay.",
            "types": ["number", "unspecified"],
        }
    ],

    options: [],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks for each property in the object.",
            "types": ["action"]
        },
        {
            "id": "action2",
            "name": "Action (Finish)",
            "description": "Type: Action\n\nDescription: Executes the following blocks for each item in the list.",
            "types": ["action"]
        },
        {
            "id": "key",
            "name": "Key",
            "description": "Type: Text\n\nDescription: The key of the object property.",
            "types": ["text"]
        },
        {
            "id": "value",
            "name": "Value",
            "description": "Type: Unspecified\n\nDescription: The value of the object property.",
            "types": ["unspecified"]
        },
    ],

    async code(cache) {
        const object = this.GetInputValue("object", cache);
        let time = this.GetInputValue("delay", cache) || 0;
   const sleep = ms => {
            return new Promise(resolve => setTimeout(resolve, ms))
        }

        for (const [key, value] of Object.entries(object)) {
            this.StoreOutputValue(key, "key", cache);
            this.StoreOutputValue(value, "value", cache);
            this.RunNextBlock("action", cache);
            await sleep(time);
        }
        this.RunNextBlock("action2", cache)
    }
}