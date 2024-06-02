module.exports = {
    name: "Create Discord Poll Answer",

    description: "Creates the Answer for a Discord Poll.",

    category: "Extras",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "answers",
            "name": "Answers List",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: Connect this from another Create Poll Answer block to create multiple answers.",
            "types": ["list", "object", "unspecified"]
        },
        {
            "id": "answers_text",
            "name": "Answer Text",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The answers to the poll.",
            "types": ["text", "unspecified"]
        },
        {
            "id": "answers_emoji",
            "name": "Answer Emoji",
            "description": "Acceptable Types: Text, Object, Unspecified\n\nDescription: The Emoji for each Answer. OPTIONAL",
            "types": ["text", "object", "unspecified"]
        }
    ],

    options: [
        {
            "id": "answers_text",
            "name": "Answer Text",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The answers to the poll.",
            "type": "TEXT"
        },
        {
            "id": "answers_emoji",
            "name": "Answer Emoji",
            "description": "Acceptable Types: Text, Object, Unspecified\n\nDescription: The Emoji for each Answer. OPTIONAL",
            "type": "TEXT"
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
            "id": "answers",
            "name": "Answers List",
            "description": "Type: List\n\nDescription: The list of answers.",
            "types": ["list", "unspecified"]
        }
    ],

    async code(cache, DBB) {
        const answers = this.GetInputValue("answers", cache) || [];
        const text = this.GetInputValue("answers_text", cache) || this.GetOptionValue("answers_text", cache);
        const emoji = this.GetOptionValue("answers_emoji", cache) || this.GetOptionValue("answers_emoji", cache) !== "" ? this.GetOptionValue("answers_emoji", cache) : null;

        answers.push({
            text,
            emoji: emoji,
        });

        this.StoreOutputValue(answers, "answers", cache);
        this.RunNextBlock("action", cache);
    }
};