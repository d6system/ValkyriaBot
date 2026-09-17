module.exports = {
    name: "Send Message/Interaction (Multi)",

    description:
        "This State of the Art block allows you to either Reply to Interactions, send(/reply) messages to channels or follow-up messages to interactions.",

    category: "Message Stuff",

    inputs(data) {
        const type = data?.options?.type || "int_reply";
        const componentsv2 = data?.options?.["use-componentsv2"] || false;
        let inputs = [
            {
                id: "content",
                name: "Text",
                description: "The text to reply.",
                types: ["text", "unspecified"],
            },
            {
                id: "embeds",
                name: "Embed",
                description: "The embeds to reply.",
                types: ["object", "list", "unspecified"],
                multiInput: true,
            },
            {
                id: "components",
                name: "Component",
                description: "The components to reply.",
                types: ["object", "list", "unspecified"],
                multiInput: true,
            },
            {
                id: "files",
                name: "Attachment",
                description: "The attachments to reply. Supports Image, file path and URL.",
                types: ["object", "list", "text", "unspecified"],
                multiInput: true,
            },
        ];

        if(componentsv2) {
            inputs.shift();
            inputs.shift();
        }

        if (["msg_send"].includes(type)) {
            inputs.unshift({
                id: "channel",
                name: "Channel",
                description: "The channel to send the message.",
                types: ["object", "text", "unspecified"],
                required: true,
            });
            if(!componentsv2) inputs.push({
                id: "poll",
                name: "Poll",
                description: "The poll to send with the message.",
                types: ["object", "unspecified"],
            });
        }

        if (type == "msg_delete") inputs = [];

        if (["msg_reply", "msg_edit", "msg_delete"].includes(type)) {
            inputs.unshift({
                id: "message",
                name: "Message",
                description: "The message to reply.",
                types: ["object", "unspecified"],
                required: true,
            });
        }

        if (["int_defer", "int_full-defer"].includes(type)) {
            inputs = [];
        }

        if (type == "int_delete-reply") {
            inputs = [];
        }

        if (["int_reply", "int_defer", "int_full-defer", "int_edit", "int_update", "int_followup", "int_delete-reply"].includes(type)) {
            inputs.unshift({
                id: "interaction",
                name: "Interaction",
                description: "The interaction to reply.",
                types: ["object", "unspecified"],
                required: true,
            });
            inputs.push({
                id: "ephemeral",
                name: "Private?",
                description: "Whether the reply should be ephemeral (private).",
                types: ["boolean", "unspecified"],
            });
        }

        if (type === "int_fetch-reply") {
            inputs = [];
            inputs.unshift({
                id: "interaction",
                name: "Interaction",
                description: "The interaction to reply.",
                types: ["object", "unspecified"],
                required: true,
            });
        }

        inputs.unshift({
            id: "action",
            name: "Action",
            description: "Executes this block.",
            types: ["action"],
        });

        return inputs;
    },

    options(data) {
        const type = data?.options?.type || "int_reply";
        let options = [
            {
                id: "type",
                name: "Type",
                description: "The type of the message.",
                type: "SELECT",
                options: [
                    {
                        type: "GROUP",
                        name: "Interactions",
                        options: [
                            { id: "int_reply", name: "Reply to Interaction", description: "Replies to the interaction." },
                            { id: "int_defer", name: "Defer Reply", description: "Defers the interaction." },
                            { id: "int_full-defer", name: "Full Defer", description: "Gets Rid of Reply Message entirely." },
                            { id: "int_edit", name: "Edit Reply", description: "Edits the interaction." },
                            { id: "int_update", name: "Update", description: "Updates the interaction." },
                            { id: "int_followup", name: "Follow-up", description: "Sends a follow-up message to the interaction." },
                            { id: "int_delete-reply", name: "Delete Reply", description: "Deletes the interaction." },
                            { id: "int_fetch-reply", name: "Fetch Reply", description: "Fetches the Reply Interaction." },
                        ],
                    },
                    {
                        type: "GROUP",
                        name: "Messages",
                        options: [
                            { id: "msg_send", name: "Send Message", description: "Sends a message to a channel." },
                            { id: "msg_reply", name: "Reply to Message", description: "Replies to a message." },
                            { id: "msg_edit", name: "Edit Message", description: "Edits a message." },
                            { id: "msg_delete", name: "Delete Message", description: "Deletes a message." },
                        ],
                    },
                ],
            },
        ];

        if (["int_reply", "int_defer", "int_full-defer", "int_edit", "int_update", "int_followup", "int_delete-reply"].includes(type)) {
            options.push({
                id: "ephemeral",
                name: "Private?",
                description: "Whether the reply should be ephemeral (private).",
                type: "CHECKBOX",
                defaultValue: true,
            });
        }

        if (["int_edit", "int_update", "msg_edit"].includes(type)) {
            options.push({
                id: "removecomponents",
                name: "Remove Components",
                description: "Sets the Selected components to empty.",
                type: "MULTISELECT",
                options: {
                    components: "Components",
                    embeds: "Embeds",
                    files: "Files",
                },
                allowUserOptions: false,
                duplicates: false,
            });
        }

        if (["int_reply", "int_edit", "int_update", "int_followup", "msg_send", "msg_edit"].includes(type)) {
            options.push(
                {
                    id: "splittext",
                    name: "Split Content (2000 Chars)",
                    description: "If the content is more than 2000 characters, it will split the content into multiple messages.",
                    type: "CHECKBOX",
                },
                {
                    id: "use-componentsv2",
                    name: "Use Components V2",
                    description: "Whether to use Components V2.",
                    type: "CHECKBOX",
                    defaultValue: false,
                }
            );
        }

        return options;
    },

    outputs(data) {
        const type = data?.options?.type || "int_reply";
        let outputs = [];

        if (
            ["int_reply", "int_defer", "int_full-defer", "int_edit", "int_update", "int_followup", "int_delete-reply", "int_fetch-reply"].includes(
                type
            )
        ) {
            outputs.push({
                id: "interaction",
                name: "Interaction",
                description: "The interaction replied.",
                types: ["object"],
            });
        }

        if (
            ["msg_send", "msg_reply", "msg_edit", "int_reply", "int_edit", "int_update", "int_followup", "int_fetch-reply", "int_defer"].includes(
                type
            )
        ) {
            outputs.push({
                id: "message",
                name: "Message",
                description: "The message that was sent.",
                types: ["object", "list", "unspecified"],
            });
        }

        outputs.unshift({
            id: "action",
            name: "Action",
            description: "Executes the following blocks when this block finishes its task.",
            types: ["action"],
        });

        outputs.push(
            {
                id: "action_error",
                name: "Action (Error)",
                description: "Executes the following blocks when an error occurs.",
                types: ["action"],
            },
            {
                id: "error",
                name: "Error Message",
                description: "The error message.",
                types: ["text", "unspecified"],
            }
        );

        return outputs;
    },

    async code(cache) {
        const { ActionRowBuilder, MessageFlags, ContainerBuilder, AttachmentBuilder, FileBuilder, MediaGalleryBuilder, SectionBuilder, SeparatorBuilder, TextDisplayBuilder } = require("discord.js");
        const axios = require("axios");
        const type = this.GetOptionValue("type", cache) || "int_reply";

        const typeFunctionList = {
            int_reply: "reply",
            int_defer: "deferReply",
            int_edit: "editReply",
            int_update: "update",
            int_followup: "followUp",
            "int_delete-reply": "deleteReply",
            "int_fetch-reply": "fetchReply",
            msg_send: "send",
            msg_reply: "reply",
            msg_edit: "edit",
            msg_delete: "delete",
        };

        const isInteraction = type.startsWith("int_");
        const isMessage = type.startsWith("msg_");

        function getComponents(components) {
            if (!Array.isArray(components) || components.length === 0) return;

            const res = [];
            let defaultRow;

            for (const item of components) {
                if (!item) continue;

                // If it's already an ActionRowBuilder, add it directly
                if (item instanceof ActionRowBuilder) {
                    if (defaultRow) {
                        res.push(defaultRow);
                        defaultRow = undefined;
                    }
                    res.push(item);
                }

                else if (item instanceof ContainerBuilder || item instanceof FileBuilder || item instanceof MediaGalleryBuilder || item instanceof SectionBuilder || item instanceof SeparatorBuilder || item instanceof TextDisplayBuilder) {
                    if (defaultRow) {
                        res.push(defaultRow);
                        defaultRow = undefined;
                    }
                    res.push(item);
                }
                // If it's an array
                else if (Array.isArray(item)) {
                    if (item.length === 0) continue;

                    if (defaultRow) {
                        res.push(defaultRow);
                        defaultRow = undefined;
                    }

                    const row = new ActionRowBuilder();
                    row.addComponents(...item);
                    res.push(row);
                }
                // Single button or component
                else {
                    if (!defaultRow) defaultRow = new ActionRowBuilder();

                    if (defaultRow.components.length === 5) {
                        res.push(defaultRow);
                        defaultRow = new ActionRowBuilder();
                    }

                    defaultRow.addComponents(item);
                }
            }

            if (defaultRow) res.push(defaultRow);

            return res;
        }

        async function handleInteraction(opts) {
            if (opts.interaction.deferred && !opts.update) return await opts.interaction.editReply(opts.options);
            if ((opts.interaction.replied || opts.followUp) && !opts.update) return await opts.interaction.followUp(opts.options);
            return await opts.interaction[typeFunctionList[type]](opts.options);
        }

        if (isInteraction) {
            const interaction = this.GetInputValue("interaction", cache);
            const ephemeral = this.GetInputValue("ephemeral", cache) || this.GetOptionValue("ephemeral", cache);
            const useComponentsV2 = this.GetOptionValue("use-componentsv2", cache) || false;

            if (type === "int_full-defer") {
                try {
                    await interaction.deferReply({ flags: ephemeral ? MessageFlags.Ephemeral : undefined });
                    await interaction.deleteReply();
                    this.RunNextBlock("action", cache);
                    return;
                } catch (err) {
                    this.StoreOutputValue(err.message, "error", cache);
                    this.RunNextBlock("action_error", cache);
                    return;
                }
            }

            if (type === "int_fetch-reply") {
                try {
                    const message = await interaction.fetchReply();
                    this.StoreOutputValue(message, "message", cache);
                    this.StoreOutputValue(interaction, "interaction", cache);
                    this.RunNextBlock("action", cache);
                    return;
                } catch (err) {
                    this.StoreOutputValue(err.message, "error", cache);
                    this.RunNextBlock("action_error", cache);
                    return;
                }
            }

            if (type === "int_delete-reply") {
                try {
                    await interaction.deleteReply();
                    this.RunNextBlock("action", cache);
                    return;
                } catch (err) {
                    this.StoreOutputValue(err.message, "error", cache);
                    this.RunNextBlock("action_error", cache);
                    return;
                }
            }

            if (type === "int_defer") {
                try {
                    const i = await interaction.deferReply({ flags: ephemeral ? MessageFlags.Ephemeral : undefined, withResponse: true });
                    this.StoreOutputValue(i?.resource?.message, "message", cache);
                    this.StoreOutputValue(interaction, "interaction", cache);
                    this.RunNextBlock("action", cache);
                    return;
                } catch (err) {
                    this.StoreOutputValue(err.message, "error", cache);
                    this.RunNextBlock("action_error", cache);
                    return;
                }
            }

            let content = this.GetInputValue("content", cache);
            const removecomponents = this.GetOptionValue("removecomponents", cache);
            const embeds = this.GetInputValue("embeds", cache)?.filter((a) => a);
            const components = this.GetInputValue("components", cache)?.filter((a) => a);
            const files = (await Promise.all(
                this.GetInputValue("files", cache)
                    ?.filter((a) => a)
                    .map(async (a) => {
                        if (typeof a === "string" && a.startsWith("http")) {
                            try {
                                const returnvalue = await axios.get(a, { responseType: "arraybuffer" });
                            let possiblefilename = a.split("/").pop();
                            return new AttachmentBuilder(Buffer.from(returnvalue.data), {
                                name: possiblefilename.includes(".")
                                    ? possiblefilename
                                    : `${possiblefilename}.${returnvalue.headers["content-type"].split("/")[1]}`,
                            });
                            } catch {
                                return a;
                            }
                        } else {
                            return a;
                        }
                    })
            )).flat();

            const splittext = this.GetOptionValue("splittext", cache);

            let flags = [];
            if (ephemeral) flags.push(MessageFlags.Ephemeral);
            if (useComponentsV2) flags.push(MessageFlags.IsComponentsV2);

            if (splittext && content?.length > 2000) {
                const splitContent = content.match(/[\s\S]{1,2000}/g);
                for (let i = 0; i < splitContent.length; i++) {
                    const options = {
                        content: splitContent[i],
                        embeds: embeds.length > 0 ? embeds : undefined,
                        components: getComponents(components),
                        files: files.length > 0 ? files : undefined,
                        flags,
                        withResponse: true,
                    };

                    if (removecomponents) {
                        removecomponents.forEach((c) => {
                            if (c === "components") options.components = [];
                            if (c === "embeds") options.embeds = [];
                            if (c === "files") options.files = [];
                        });
                    }

                    try {
                        const i = await handleInteraction({ interaction: interaction, options: options, followUp: i >= 1 });
                        this.StoreOutputValue(i?.response?.resource?.message, "message", cache);
                        this.StoreOutputValue(i, "interaction", cache);
                    } catch (err) {
                        this.StoreOutputValue(err.message, "error", cache);
                        this.RunNextBlock("action_error", cache);
                        return;
                    }
                }
                this.RunNextBlock("action", cache);
            } else {
                let flags = [];
                if (ephemeral) flags.push(MessageFlags.Ephemeral);
                if (useComponentsV2) flags.push(MessageFlags.IsComponentsV2);

                const options = {
                    content: content,
                    embeds: embeds?.length > 0 ? embeds : undefined,
                    components: getComponents(components),
                    files: files?.length > 0 ? files : undefined,
                    flags,
                };

                if (removecomponents) {
                    removecomponents.forEach((c) => {
                        if (c === "components") options.components = [];
                        if (c === "embeds") options.embeds = [];
                        if (c === "files") options.files = [];
                    });
                }

                handleInteraction({ interaction: interaction, options: options, update: ["int_edit", "int_update"].includes(type) })
                    .then((message) => {
                        this.StoreOutputValue(interaction, "interaction", cache);
                        this.StoreOutputValue(message, "message", cache);
                        this.RunNextBlock("action", cache);
                    })
                    .catch((err) => {
                        console.log(err)
                        this.StoreOutputValue(err.message, "error", cache);
                        this.RunNextBlock("action_error", cache);
                        return;
                    });
            }
        } else if (isMessage) {
            const useComponentsV2 = this.GetOptionValue("use-componentsv2", cache) || false;
            let flags = [];
            if (useComponentsV2) flags.push(MessageFlags.IsComponentsV2);
            if (type === "msg_send") {
                const channel = this.GetInputValue("channel", cache);
                const content = this.GetInputValue("content", cache);
                const embeds = this.GetInputValue("embeds", cache)?.filter((a) => a);
                const components = this.GetInputValue("components", cache)?.filter((a) => a);
                const files = (await Promise.all(
                    this.GetInputValue("files", cache)
                        ?.filter((a) => a)
                        .map(async (a) => {
                            if (typeof a === "string" && a.startsWith("http")) {
                                try {
                                    const returnvalue = await axios.get(a, { responseType: "arraybuffer" });
                                let possiblefilename = a.split("/").pop();
                                return new AttachmentBuilder(Buffer.from(returnvalue.data), {
                                    name: possiblefilename.includes(".")
                                        ? possiblefilename
                                        : `${possiblefilename}.${returnvalue.headers["content-type"].split("/")[1]}`,
                                });
                                } catch {
                                    return a;
                                }
                            } else {
                                return a;
                            }
                        })
                )).flat();
                const poll = this.GetInputValue("poll", cache);

                const splittext = this.GetOptionValue("splittext", cache);

                if (splittext && content?.length > 2000) {
                    const splitContent = content.match(/[\s\S]{1,2000}/g);
                    for (let i = 0; i < splitContent.length; i++) {
                        const options = {
                            content: splitContent[i],
                            embeds: embeds?.length > 0 ? embeds : undefined,
                            components: i === 0 ? getComponents(components) : [],
                            files: files?.length > 0 ? files : undefined,
                            flags,
                            poll: poll,
                        };

                        try {
                            const returnvalue = await channel.send(options);
                            this.StoreOutputValue(returnvalue, "message", cache);
                        } catch (err) {
                            this.StoreOutputValue(err.message, "error", cache);
                            this.RunNextBlock("action_error", cache);
                            return;
                        }
                    }
                    this.RunNextBlock("action", cache);
                    return;
                } else {
                    const options = {
                        content,
                        embeds: embeds?.length > 0 ? embeds : undefined,
                        components: getComponents(components),
                        files: files?.length > 0 ? files : undefined,
                        flags,
                        poll: poll,
                    };

                    try {
                        const returnvalue = await channel.send(options);
                        this.StoreOutputValue(returnvalue, "message", cache);
                    } catch (err) {
                        console.log(err)
                        this.StoreOutputValue(err.message, "error", cache);
                        this.RunNextBlock("action_error", cache);
                        return;
                    }
                }
            } else if (type === "msg_reply") {
                const message = this.GetInputValue("message", cache);
                const content = this.GetInputValue("content", cache);
                const embeds = this.GetInputValue("embeds", cache)?.filter((a) => a);
                const components = this.GetInputValue("components", cache)?.filter((a) => a);
                const files = (await Promise.all(
                    this.GetInputValue("files", cache)
                        ?.filter((a) => a)
                        .map(async (a) => {
                            if (typeof a === "string" && a.startsWith("http")) {
                                try {
                                    const returnvalue = await axios.get(a, { responseType: "arraybuffer" });
                                let possiblefilename = a.split("/").pop();
                                return new AttachmentBuilder(Buffer.from(returnvalue.data), {
                                    name: possiblefilename.includes(".")
                                        ? possiblefilename
                                        : `${possiblefilename}.${returnvalue.headers["content-type"].split("/")[1]}`,
                                });
                                } catch {
                                    return a;
                                }
                            } else {
                                return a;
                            }
                        })
                )).flat();

                const options = {
                    content,
                    embeds: embeds?.length > 0 ? embeds : undefined,
                    components: getComponents(components),
                    flags,
                    files: files?.length > 0 ? files : undefined,
                };

                try {
                    const returnvalue = await message.reply(options);
                    this.StoreOutputValue(returnvalue, "message", cache);
                } catch (err) {
                    this.StoreOutputValue(err.message, "error", cache);
                    this.RunNextBlock("action_error", cache);
                    return;
                }
            } else if (type === "msg_edit") {
                const message = this.GetInputValue("message", cache);
                const content = this.GetInputValue("content", cache);
                const removecomponents = this.GetOptionValue("removecomponents", cache);
                const embeds = this.GetInputValue("embeds", cache)?.filter((a) => a);
                const components = this.GetInputValue("components", cache)?.filter((a) => a);
                const files = (await Promise.all(
                    this.GetInputValue("files", cache)
                        ?.filter((a) => a)
                        .map(async (a) => {
                            if (typeof a === "string" && a.startsWith("http")) {
                                try {
                                    const returnvalue = await axios.get(a, { responseType: "arraybuffer" });
                                let possiblefilename = a.split("/").pop();
                                return new AttachmentBuilder(Buffer.from(returnvalue.data), {
                                    name: possiblefilename.includes(".")
                                        ? possiblefilename
                                        : `${possiblefilename}.${returnvalue.headers["content-type"].split("/")[1]}`,
                                });
                                } catch {
                                    return a;
                                }
                            } else {
                                return a;
                            }
                        })
                )).flat();

                const options = {
                    content,
                    embeds: embeds?.length > 0 ? embeds : undefined,
                    components: getComponents(components),
                    flags,
                    files: files?.length > 0 ? files : undefined,
                };

                if (removecomponents) {
                    removecomponents.forEach((c) => {
                        if (c === "components") options.components = [];
                        if (c === "embeds") options.embeds = [];
                        if (c === "files") options.files = [];
                    });
                }

                try {
                    const returnvalue = await message.edit(options);
                    this.StoreOutputValue(returnvalue, "message", cache);
                } catch (err) {
                    this.StoreOutputValue(err.message, "error", cache);
                    this.RunNextBlock("action_error", cache);
                    return;
                }
            } else if (type === "msg_delete") {
                const message = this.GetInputValue("message", cache);
                try {
                    await message.delete();
                } catch (err) {
                    this.StoreOutputValue(err.message, "error", cache);
                    this.RunNextBlock("action_error", cache);
                    return;
                }
            }
            this.RunNextBlock("action", cache);
        }
    },
};
