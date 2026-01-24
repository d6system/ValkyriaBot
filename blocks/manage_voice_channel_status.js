module.exports = {
    name: "Manage Voice Channel Status",

    description: "Sets or clears a custom text status on a voice channel using the Discord voice-status endpoint.",

    category: "Channel Stuff",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes this block.",
            types: ["action"],
        },
        {
            id: "channel",
            name: "Voice Channel",
            description: "The voice channel object to modify.",
            types: ["object", "unspecified"],
            required: true,
        },
        {
            id: "status",
            name: "Status Text",
            description: "The custom text status to set. Leave empty or null to clear.",
            types: ["text", "unspecified"],
        },
    ],

    options: [
        {
            id: "remove_status",
            name: "Remove Status?",
            description: "If checked, removes any existing voice channel status instead of setting a new one.",
            type: "CHECKBOX",
        },
    ],

    outputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes the next block after completion.",
            types: ["action"],
        },
        {
            id: "success",
            name: "Success?",
            description: "True if the status was updated successfully.",
            types: ["boolean", "unspecified"],
        },
        {
            id: "error",
            name: "Error Message",
            description: "Any error message if the operation fails.",
            types: ["text", "unspecified"],
        },
    ],

    async code(cache) {
        const { REST } = require("discord.js");
        const channel = this.GetInputValue("channel", cache);
        const statusText = this.GetInputValue("status", cache);
        const removeStatus = this.GetOptionValue("remove_status", cache);

        if (!channel?.id) {
            this.StoreOutputValue(false, "success", cache);
            this.StoreOutputValue("Invalid voice channel.", "error", cache);
            this.RunNextBlock("action", cache);
            return;
        }

        const rest = new REST({ version: "10" }).setToken(this.client.token);
        const url = `/channels/${channel.id}/voice-status`;

        try {
            const res = await rest.put(url, { body: { status: removeStatus ? "" : statusText || "" } });
            const success = [200, 204].includes(res?.status ?? 200);
            this.StoreOutputValue(success, "success", cache);
            this.StoreOutputValue(null, "error", cache);
        } catch (err) {
            this.StoreOutputValue(false, "success", cache);
            this.StoreOutputValue(err.message, "error", cache);
        }

        this.RunNextBlock("action", cache);
    },
};
