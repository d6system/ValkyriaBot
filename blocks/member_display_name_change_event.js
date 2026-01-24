module.exports = {
    name: "Member Display Name Change [Event]",

    description: "Triggers when a member's display name changes.",

    category: "Events",

    auto_execute: true,

    inputs: [],

    options: [
        {
            "id": "exclude_bots",
            "name": "Exclude Bots?",
            "description": "Should bots be excluded from this event?",
            "type": "CHECKBOX",
            "defaultValue": true
        }
    ],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this event triggers.",
            "types": ["action"]
        },
        {
            "id": "old_member",
            "name": "Old Member",
            "description": "Type: Object\n\nDescription: The member before the change.",
            "types": ["object"]
        },
        {
            "id": "new_member",
            "name": "New Member",
            "description": "Type: Object\n\nDescription: The member after the change.",
            "types": ["object"]
        }
    ],

    code(cache) {
        this.events.on("guildMemberUpdate", (oldMember, newMember) => {
            const excludeBots = this.GetOptionValue("exclude_bots", cache);

            // Check if the display name changed
            if (oldMember.displayName !== newMember.displayName) {
                // Check if bots should be excluded
                if (excludeBots && newMember.user.bot) return;

                this.StoreOutputValue(oldMember, "old_member", cache);
                this.StoreOutputValue(newMember, "new_member", cache);
                this.RunNextBlock("action", cache);
            }
        });
    }
};
