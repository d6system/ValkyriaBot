module.exports = {
    name: "Delete Channel Permission Overwrite",

    description: "Deletes the permission overwrite of the channel.",

    category: "Permissions Stuff",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "channel",
            "name": "Channel",
            "description": "Acceptable Types: Object, Unspecified\n\nDescription: The text channel, voice channel or category to delete the overwrite from.",
            "types": ["object", "unspecified"],
            "required": true
        },
        {
            "id": "target",
            "name": "Target (Role/Member/User)",
            "description": "Acceptable Types: Object, Unspecified\n\nDescription: The role, member or user to delete the permission overwrite.",
            "types": ["object", "unspecified"],
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
        const channel = this.GetInputValue("channel", cache);
        const target = this.GetInputValue("target", cache);

        channel.permissionOverwrites.delete(target).then(() => {
            this.RunNextBlock("action", cache);
        });
    }
}