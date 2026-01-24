module.exports = {
    name: "Schedule Timer Reached [Event]",

    description: "This event is fired when a scheduled timer reaches its time.",

    category: "Schedule Timer",

    auto_execute: true,

    inputs: [],

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
        }
    ],

    async code(cache, DBB) {
        const customId = this.GetOptionValue("customId", cache);
        DBB.Dependencies?.SchedulerTimer?.on("jobReached", ({ id, job, time, content }) => {
            if (typeof id == "string" && (id.includes(customId) || id.startsWith(customId) || id.endsWith(customId))) {
                this.StoreOutputValue(id, "customId", cache);
                this.StoreOutputValue(content, "content", cache);
                this.StoreOutputValue(time, "time", cache);
                this.StoreOutputValue(job, "job", cache);
                this.RunNextBlock("action", cache);
            }
        });
    }
}