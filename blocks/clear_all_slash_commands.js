module.exports = {
    name: "Clear All Slash Commands",

    description: "Clears all registered slash (application) commands from the bot.",

    category: "Interactions",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        }
    ],

    options: [],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Continues after clearing the commands.",
            "types": ["action"]
        }
    ],

    async code(cache) {
        const client = this.client;

        try {
            // Clear global slash commands
            await client.application.commands.set([]);

            // Optionally clear all guild commands for all guilds
            const guilds = client.guilds.cache.map(g => g.id);
            for (const guildId of guilds) {
                await client.application.commands.set([], guildId);
            }

            this.RunNextBlock("action", cache);
        } catch (err) {
            console.error("Failed to clear slash commands:", err);
        }
    }
}
