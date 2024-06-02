module.exports = {
    name: "Discord Poll Vote Remove Event [Event]",

    description: "When a user removes their vote on a poll, this event will trigger.",

    category: "Events",

    auto_execute: true,

    inputs: [],

    options: [],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        },
        {
            "id": "poll_answer",
            "name": "Poll Answer",
            "description": "Type: Object\n\nDescription: The answer the user removed their vote for.",
            "types": ["object", "unspecified"]
        },
        {
            "id": "user",
            "name": "User",
            "description": "Type: Object\n\nDescription: The user who removed their vote.",
            "types": ["object", "unspecified"]
        }
    ],

    code(cache) {
        this.events.on("messagePollVoteRemove", async (pollAnswer, userId) => {
            const user = await this.client.users.fetch(userId);
            this.StoreOutputValue({
                answer: pollAnswer.text,
                emoji: pollAnswer.emoji,
                users: (await pollAnswer.fetchVoters()).toJSON()
            }, "poll_answer", cache);
            this.StoreOutputValue(user, "user", cache);
            this.RunNextBlock("action", cache);
        });
    }
}