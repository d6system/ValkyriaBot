module.exports = {
    name: "Delete Invite",

    description: "Deletes an existing invite for the channel. (by @eldediamante)",

    category: "Invite Stuff",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "invite",
            "name": "Invite",
            "description": "Acceptable Types: Object\n\nDescription: The invite object to delete.",
            "types": ["object"],
            "required": true
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

    code(cache) {
        const invite = this.GetInputValue("invite", cache);

        try {
            if (!invite || typeof invite.delete !== "function") {
                throw new Error("Invalid invite object.");
            }

            invite.delete();
            console.log("Invite deleted successfully.");
            this.RunNextBlock("action", cache);
        } catch (e) {
            console.error("Error deleting invite:", e);
            this.RunNextBlock("action", cache);
        }
    }
}