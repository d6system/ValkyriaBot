module.exports = {
    name: "Cancel Scheduled Timer",

    description: "Cancels a scheduled timer.",

    category: "Schedule Timer",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "customId",
            "name": "Custom ID",
            "description": "Description: The custom ID for this scheduled timer.",
            "types": ["text", "unspecified"]
        }
    ],

    options: [
        {
            "id": "customId",
            "name": "Custom ID",
            "description": "Description: The custom ID for this scheduled timer.",
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

    async code(cache, DBB) {
        const customId = this.GetInputValue("customId", cache) || this.GetOptionValue("customId", cache);

        DBB.Dependencies.SchedulerTimer.removeJobById(customId);
        this.RunNextBlock("action", cache);
    }
}