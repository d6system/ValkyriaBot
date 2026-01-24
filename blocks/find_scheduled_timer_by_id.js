module.exports = {
    name: "Find Scheduled Timer By ID",

    description: "Finds a scheduled timer by its custom ID.",

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
        },
        {
            "id": "customId",
            "name": "Custom ID",
            "description": "Type: Text\n\nDescription: The custom ID for this scheduled timer.",
            "types": ["text"]
        },
        {
            "id": "content",
            "name": "Content",
            "description": "Type: Text\n\nDescription: The content of the scheduled timer.",
            "types": ["text"]
        },
        {
            "id": "time",
            "name": "Time",
            "description": "Type: Date, Text, Unspecified\n\nDescription: The time the scheduled timer reached.",
            "types": ["date", "text", "unspecified"]
        },
        {
            "id": "job",
            "name": "Schedule Job",
            "description": "Type: Object\n\nDescription: The Schedule Job object.",
            "types": ["object", "unspecified"]
        },
        {
            "id": "removedOnFinish",
            "name": "Remove Job on Finished?",
            "description": "Type: Boolean\n\nDescription: Should the job be removed once it is finished?",
            "types": ["boolean"]
        },
        {
            "id": "rememberSchedule",
            "name": "Save Schedule?",
            "description": "Type: Boolean\n\nDescription: Should this Timer be saved even if the Bot restarts? Otherwise it will be lost after a bot restart and would have to be rescheduled.",
            "types": ["boolean"]
        }
    ],

    async code(cache, DBB) {
        const job = DBB.Dependencies?.SchedulerTimer?.getJob(this.GetOptionValue("customId", cache))

        if(job) {
            this.StoreOutputValue(this.GetOptionValue("customId", cache), "customId", cache);
            this.StoreOutputValue(job.content, "content", cache);
            this.StoreOutputValue(job.time, "time", cache);
            this.StoreOutputValue(job.job, "job", cache);
            this.StoreOutputValue(job.removedOnFinish, "removedOnFinish", cache);
            this.StoreOutputValue(job.rememberSchedule, "rememberSchedule", cache);
        }
        this.RunNextBlock("action", cache);
    }
}