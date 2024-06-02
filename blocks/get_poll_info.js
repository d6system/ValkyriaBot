module.exports = {
    name: "Get Poll Info",

    description: "Will return Informations about a Poll Message.",

    category: "Extras",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "message",
            "name": "Message",
            "description": "Acceptable Types: Object, Unspecified\n\nDescription: The message of the poll to get the poll infos from.",
            "types": ["object", "unspecified"],
            "required": true
        }
    ],

    options: [],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "message",
            "name": "Message",
            "description": "Type: Message\n\nDescription: The message that was sent.",
            "types": ["object", "unspecified"]
        },
        {
            "id": "question",
            "name": "Question",
            "description": "Type: Text\n\nDescription: The question of the poll.",
            "types": ["text", "unspecified"]
        },
        {
            "id": "answers",
            "name": "Answers",
            "description": "Type: List\n\nDescription: The list of answers. Format: \n\n[\n  { 'answer': 'Yes', 'emoji': '✅', 'users': [ USER, USER, ... ] }\n  { 'answer': 'No', 'emoji': '❌', 'users': [ USER, USER, ... ] } \n]",
            "types": ["list", "unspecified"]
        },
        {
            "id": "expires_at",
            "name": "Expires At",
            "description": "Type: Date\n\nDescription: The date when the poll expires.",
            "types": ["date", "unspecified"]
        },
        {
            "id": "allow_multiselect",
            "name": "Allow Multiselect",
            "description": "Type: Boolean\n\nDescription: If the poll allows multi-select.",
            "types": ["boolean", "unspecified"]
        }
    ],

    async code(cache, DBB) {
        const message = this.GetInputValue("message", cache);

        if(message.poll) {
            const question = message.poll.question;
            const answers = await Promise.all(message.poll.answers.toJSON().map(async answer => {
                return {
                    answer: answer.text,
                    emoji: answer.emoji,
                    users: (await answer.fetchVoters()).toJSON()
                }
            }))

            this.StoreOutputValue(message, "message", cache);
            this.StoreOutputValue(question.text, "question", cache);
            this.StoreOutputValue(answers, "answers", cache);
            this.StoreOutputValue(message.poll.expiresAt, "expires_at", cache);
            this.RunNextBlock("action", cache);
        }
    }
};