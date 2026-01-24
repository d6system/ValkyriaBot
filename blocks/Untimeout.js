module.exports = {
    name: "Untimeout Member",

    description: "Removes the timeout from a member of the guild",

    category: "Member Stuff",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "member",
            "name": "Member",
            "description": "Acceptable Types: Object, Unspecified\n\nDescription: Member to remove the timeout from",
            "types": ["object", "unspecified"],
            "required": true
        },
        {
            "id": "reason",
            "name": "Reason",
            "description": "Acceptable Types: Object, Unspecified\n\nDescription: The reason for removing the timeout (leave blank for nothing!)",
            "types": ["text", "unspecified"],
            "required": false
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

    async code(cache) {
        const member = this.GetInputValue("member", cache);
        const reason = this.GetInputValue("reason", cache);

        await member.timeout(null, reason);

        this.RunNextBlock("action", cache);
    }
}
