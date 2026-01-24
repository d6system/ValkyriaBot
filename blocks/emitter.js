module.exports = {
    name: "Emitter",

    description: "Attempts to trigger any \"Receiver\" block with the same ID.",

    category: "Trigger Stuff",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "id",
            "name": "Emitter ID",
            "description": "Acceptable Types: Text, Number, Unspecified\n\nDescription: The ID of this Emitter. This must match with the ID of the desired \"Receiver\" block.",
            "types": ["text", "number", "unspecified"]
        },
        {
            "id": "search_value",
            "name": "Workspace Search Value",
            "description": "Acceptable Types: Unspecified, Text, Number\n\nDescription: The value according to your choice in the \"Workspace Search Type\" option.",
            "types": ["unspecified", "text", "number"]
        },
        {
            "id": "values",
            "name": "Value",
            "description": "Acceptable Types: Unspecified, Undefined, Null, Object, Boolean, Date, Number, Text, List\n\nDescription: The value 1 to send to the receiver(s). (OPTIONAL)",
            "types": ["text", "unspecified", "undefined", "null", "object", "boolean", "date", "number", "list"],
            multiInput: true
        }
    ],

    options: [        
        {
        "id": "id",
        "name": "Emitter ID",
        "description": "Description: The ID of this Emitter. This must match with the ID of the desired \"Receiver\" block.",
        "type": "TEXT",
        },
        {
            "id": "restriction_type",
            "name": "Emitter Restriction Type",
            "description": "Description: The type of access restriction for this Emitter. If \"Specific Workspace(s)\", you need to set an option in the \"Workspace Search Type\".",
            "type": "SELECT",
            "options": {
                "current": "Current Workspace",
                "specific": "Specific Workspace(s)",
                "all": "All Workspaces"
            }
        },
        {
            "id": "search_type",
            "name": "Workspace Search Type",
            "description": "Description: The type of search to find the workspace(s). You need to put a value in the \"Workspace Search Value\" input.",
            "type": "SELECT",
            "options": {
                "number": "Workspace Number",
                "id": "Workspace ID",
                "title": "Workspace Title",
                "description": "Workspace Description"
            }
        }, 
        {
        "id": "search_value",
        "name": "Workspace Search Value",
        "description": "Description: The value according to your choice in the \"Workspace Search Type\" option.",
        "type": "TEXT"
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
        const id = this.GetInputValue("id", cache) || this.GetOptionValue("id", cache);
        var search_value = this.GetInputValue("search_value", cache) || this.GetOptionValue("search_value", cache);
        const values = this.GetInputValue("values", cache);
        const restriction_type = this.GetOptionValue("restriction_type", cache) + "";
        const search_type = this.GetOptionValue("search_type", cache) + "";

        if (search_type === "number") search_value = Number(search_value)

        this.Emitter(id, {restriction_type, search_type, search_value, values: values }, cache);

        this.RunNextBlock("action", cache);
    }
}