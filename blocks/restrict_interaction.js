module.exports = {
    name: "Restrict Interaction",

    description: "Restricts the interaction to those who can use it.",

    category: "Command Stuff",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Acceptable Types: Action\n\nDescription: Executes this block.",
            types: ["action"]
        },
        {
            id: "interaction",
            name: "Interaction",
            description:
                "Acceptable Types: Object, Unspecified\n\nDescription: The interaction to restrict.",
            types: ["object", "unspecified"],
            required: true
        },
        {
            id: "users",
            name: "User",
            description:
                "Acceptable Types: Object, Text Unspecified\n\nDescription: The users (ID) who can use the interaction.",
            types: ["object", "text", "unspecified"],
            multiInput: true
        }
    ],

    options: [],

    outputs: [
        {
            id: "action1",
            name: "Action (If True)",
            description:
                "Type: Action\n\nDescription: Executes the following blocks if the interaction restrict is valid.",
            types: ["action"]
        },
        {
            id: "action2",
            name: "Action (If False)",
            description:
                "Type: Action\n\nDescription: Executes the following blocks if the interaction restrict is invalid.",
            types: ["action"]
        }
    ],

    code(cache) {
        const interaction = this.GetInputValue("interaction", cache)
        const users = this.GetInputValue("users", cache).filter((a) => a)

        const result = users.some(user => {
            const userId = user?.id ?? user

            return interaction.user.id === userId
        })

        this.RunNextBlock(result ? "action1" : "action2", cache);
    }
}
