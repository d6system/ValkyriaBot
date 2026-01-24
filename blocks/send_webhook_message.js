
module.exports = {
    name: "Send Webhook Message",

    description: "Sends a message with a webhook, supporting multi-input Embeds, Components, and Attachments.",

    category: "Webhook Stuff",

    inputs: [
        {
            id: "action",
            name: "Action",
            types: ["action"]
        },
        {
            id: "webhook",
            name: "Webhook",
            types: ["object", "unspecified"],
            required: true
        },
        {
            id: "webhook_username_override",
            name: "Webhook Username Override",
            types: ["text", "unspecified"]
        },
        {
            id: "webhook_avatar_url_override",
            name: "Webhook Avatar URL Override",
            types: ["text", "unspecified"]
        },
        {
            id: "message",
            name: "Text",
            types: ["text", "unspecified"]
        },
        {
            id: "embeds",
            name: "Embed",
            types: ["object", "list", "unspecified"],
            multiInput: true
        },
        {
            id: "components",
            name: "Component",
            types: ["object", "list", "unspecified"],
            multiInput: true
        },
        {
            id: "attachments",
            name: "Attachment",
            types: ["object", "text", "list", "unspecified"],
            multiInput: true
        }
    ],

    options: [],

    outputs: [
        {
            id: "action",
            name: "Action",
            types: ["action"]
        },
        {
            id: "message",
            name: "Message",
            types: ["object"]
        }
    ],

    async code(cache) {
        const webhook = this.GetInputValue("webhook", cache);
        const username = this.GetInputValue("webhook_username_override", cache);
        const avatarURL = this.GetInputValue("webhook_avatar_url_override", cache);
        const content = this.GetInputValue("message", cache);
        const embeds = this.GetInputValue("embeds", cache) || [];
        const components = this.GetInputValue("components", cache) || [];
        const attachments = this.GetInputValue("attachments", cache) || [];

        const { ActionRowBuilder, AttachmentBuilder } = await this.require("discord.js");
        const path = await this.require("path");
        const fs = await this.require("fs");

        const normalizeList = (value) => Array.isArray(value) ? value : value ? [value] : [];

        const flatten = (arr) =>
          arr.flatMap(v => Array.isArray(v) ? flatten(v) : v).filter(x => x !== undefined && x !== null);

        const buildComponents = (comps) => {
            const result = [];
            let row = new ActionRowBuilder();

            for (const comp of normalizeList(comps)) {
                if (!comp) continue;

                if (Array.isArray(comp)) {
                    const r = new ActionRowBuilder().addComponents(...comp);
                    result.push(r);
                } else if (comp instanceof ActionRowBuilder) {
                    result.push(comp);
                } else {
                    if (row.components.length >= 5) {
                        result.push(row);
                        row = new ActionRowBuilder();
                    }
                    row.addComponents(comp);
                }
            }

            if (row.components.length > 0) result.push(row);

            return result;
        };

        const isValidEmbed = (embed) =>
            embed && typeof embed === "object" && Object.keys(embed).length > 0;

        const safeEmbeds = normalizeList(embeds).filter(isValidEmbed);

        const safeAttachments = flatten(attachments).map(a => {
            if (typeof a === "string") {
                try {
                    return fs.existsSync(a) ? { attachment: a, name: path.basename(a) } : null;
                } catch {
                    return null;
                }
            }
            if (a.attachment || a.url) return a;
            return null;
        }).filter(Boolean);

        const payload = {
            content,
            username,
            avatarURL,
            embeds: safeEmbeds,
            components: buildComponents(components),
            files: safeAttachments
        };

        const cleanData = Object.fromEntries(
            Object.entries(payload).filter(([_, val]) =>
                val !== undefined && val !== null && (Array.isArray(val) ? val.length > 0 : true)
            )
        );

        try {
            const msg = await webhook.send(cleanData);
            this.StoreOutputValue(msg, "message", cache);
            this.RunNextBlock("action", cache);
        } catch (err) {
            console.error("Webhook send failed:", err);
        }
    }
};
