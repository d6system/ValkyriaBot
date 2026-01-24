module.exports = {
    name: "Rich Presence Update [Event]",
    description: "Triggered when a user updates their Rich Presence. Bots can be ignored.",
    category: "Events",
    auto_execute: true,
    inputs: [],
    options: [
        {
            "id": "ignore_streaming",
            "name": "Ignore Streaming",
            "description": "Should the event be ignored if someone is streaming?",
            "type": "CHECKBOX"
        },
        {
            "id": "ignore_bots",
            "name": "Ignore Bots",
            "description": "Should the event be ignored if the user is a bot?",
            "type": "CHECKBOX"
        }
    ],
    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the next blocks when this event is triggered.",
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
        },
        {
            "id": "old_presence",
            "name": "Old Presence",
            "description": "Type: Object\n\nDescription: The old presence object.",
            "types": ["object"]
        },
        {
            "id": "new_presence",
            "name": "New Presence",
            "description": "Type: Object\n\nDescription: The new presence object.",
            "types": ["object"]
        },
        {
            "id": "status_text_old",
            "name": "old Status",
            "description": "Type: Text\n\nDescription: The user's old status.",
            "types": ["text"]
        },
        {
            "id": "status_text_new",
            "name": "new Status",
            "description": "Type: Text\n\nDescription: The user's new status.",
            "types": ["text"]
        }
    ],
    async code(cache) {
        this.events.on("presenceUpdate", (oldPresence, newPresence) => {
            if (!newPresence || !newPresence.member) return;
  
            if (newPresence.member && newPresence.member.user && newPresence.member.user.bot) {
                const ignoreBots = this.GetOptionValue("ignore_bots", cache);
                if (ignoreBots) return;
            }
            
            const oldActivity = oldPresence?.activities?.find(act => act.type !== "CUSTOM");
            const newActivity = newPresence.activities?.find(act => act.type !== "CUSTOM");
            
            if (!newActivity) return;
            if (!newActivity.name) return;

            const ignoreStreaming = this.GetOptionValue("ignore_streaming", cache);
            if (ignoreStreaming && newActivity.type === "STREAMING") return;
            
            this.StoreOutputValue(oldPresence.member, "old_member", cache);
            this.StoreOutputValue(newPresence.member, "new_member", cache);
            this.StoreOutputValue(newActivity.name, "status_text_new", cache);
          
            if (oldActivity && oldActivity.name) {
                this.StoreOutputValue(oldActivity.name, "status_text_old", cache);
            } else {
                this.StoreOutputValue(null, "status_text_old", cache);
            }
            
            this.StoreOutputValue(newPresence, "new_presence", cache);
            this.StoreOutputValue(oldPresence, "old_presence", cache);
            this.RunNextBlock("action", cache);
        });
    }
};