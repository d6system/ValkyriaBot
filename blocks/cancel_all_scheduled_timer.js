module.exports = {
    name: "Cancel ALL Scheduled Timer",

    description: "Cancels all scheduled timer.",

    category: "Schedule Timer",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        }
    ],

    options: [],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        }
    ],

    async code(cache, DBB) {
        DBB.Dependencies.SchedulerTimer.clearJobs()
        this.RunNextBlock("action", cache);
    }
}