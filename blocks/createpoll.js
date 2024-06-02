module.exports = {
    name: "Create Discord Poll",

    description: "Create a Discord Poll in a channel.",

    category: "Extras",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "question",
            "name": "Question?",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The question to ask in the poll.",
            "types": ["text", "unspecified"],
            "required": true
        },
        {
            "id": "duration",
            "name": "Duration (In Hours)",
            "description": "Acceptable Types: Number, Unspecified\n\nDescription: The duration of the poll in HOURS. UP TO 7 DAYS/168 HOURS.",
            "types": ["number", "unspecified"]
        },
        {
            "id": "answers",
            "name": "Answers List",
            "description": "Acceptable Types: List, Unspecified\n\nDescription: The answers to the poll. \nYou can create these using the \"Create Discord Poll Answer\" block.",
            "types": ["list", "unspecified"],
            "required": true
        }
    ],

    options: [
        {
            "id": "duration",
            "name": "Duration (In Hours)",
            "description": "Description: The duration of the poll. UP TO 7 DAYS.",
            "type": "SELECT",
            "options": {
                24: "1 day",
                1: "1 hour",
                4: "4 hour",
                8: "8 hour",
                72: "3 days",
                168: "1 week"
            }
        },
        {
            "id": "mselect",
            "name": "Multi-Select?",
            "description": "Acceptable Types: Boolean, Unspecified\n\nDescription: If the poll should allow multiple answers.",
            type: "CHECKBOX",
            defaultValue: false
        }
    ],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "poll",
            "name": "Poll",
            "description": "Type: Message\n\nDescription: The Poll Object that you can send with a Message.",
            "types": ["object", "unspecified"]
        }
    ],

    code(cache) {
        const question = this.GetInputValue("question", cache);
        const answers = this.GetInputValue("answers", cache);
        const mselect = this.GetOptionValue("mselect", cache);
        const duration = this.GetInputValue("duration", cache) || this.GetOptionValue("duration", cache);

        if(!question || !answers || !duration) {
            return this.error("All fields are required!");
        }

        this.StoreOutputValue({
            question: {text: question},
            answers,
            allowMultiselect: mselect,
            duration
        }, "poll", cache);
        this.RunNextBlock("action", cache);
    }
};