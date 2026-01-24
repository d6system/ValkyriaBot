module.exports = {
    name: "Queue (Exists?)",

    description: "Check if a Queue exists in the Server",

    category: "Music V2",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "guild",
            "name": "Server",
            "description": "Acceptable Types: Object, Unspecified\n\nDescription: The Server Object",
            "types": ["object", "unspecified"],
            "required": true
        }
    ],

    options: [],

    outputs: [
        {
            "id": "action",
            "name": "Queue exists",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        },
        {
            "id": "noqueue",
            "name": "No queue",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        },
        {
            "id": "queue",
            "name": "Queue",
            "description": "Type: Object, Unspecified\n\nDescription: The Queue Object",
            "types": ["object", "list", "unspecified"]
        },
        {
            "id": "boolean",
            "name": "True/False",
            "description": "Type: Boolean\n\nDescription: Boolean Return Value if Queue Exists Or Not",
            "types": ["boolean"]
        }
    ],

    code(cache) {
        const { useQueue } = require('discord-player');
        const guild = this.GetInputValue("guild", cache);

        const queue = useQueue(guild);

        if (queue) {
            this.StoreOutputValue(queue, "queue", cache);
            this.StoreOutputValue(true, "boolean", cache);
            this.RunNextBlock("action", cache);
        } else {
            this.StoreOutputValue(null, "queue", cache);
            this.StoreOutputValue(false, "boolean", cache);
            this.RunNextBlock("noqueue", cache);
        }
    }
}