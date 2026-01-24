module.exports = {
    name: "Get Modal Field Value",

    description: "Gets the Argument by Name from a Modal by @XCraftTM",

    category: "Interaction Stuff",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes this block.",
            types: ["action"],
        },
        {
            id: "interaction",
            name: "Interaction",
            description: "The Interaction of the Modal Input Event",
            types: ["object", "unspecified"],
            required: true,
        },
        {
            id: "customid",
            name: "CustomID",
            description: "The CustomID of the Input Field you want to get the Arguments from!",
            types: ["text", "unspecified"],
        },
    ],

    options: [
        {
            id: "customid",
            name: "CustomID",
            description: "The CustomID of the Input Field you want to get the Arguments from!",
            type: "TEXT",
        },
        {
            id: "type",
            name: "Type",
            description: "The Type of Value you want to get.",
            type: "SELECT",
            options: {
                textinput: "Text Input Value <Text>",
                fileupload: "Uploaded Files <Attachments>",
                selectmenu: "Selected Menu Values <Texts>",
                userselect: "Selected Users <Users>",
                roleselect: "Selected Roles <Roles>",
                mentionableselect: "Selected Mentionables <Object<Users/Roles/Members>>",
                channelselect: "Selected Channels <Channels>",
            },
        },
    ],

    outputs(data) {
        const type = data?.options?.type || "textinput";
        const names = {
            textinput: "Text Input",
            fileupload: "Uploaded Files",
            selectmenu: "Text Select Menu",
            userselect: "User Select Menu",
            roleselect: "Role Select Menu",
            mentionableselect: "Mentionable Select Menu",
            channelselect: "Channel Select Menu",
        };
        const name = names[type] || "Text Input Value";
        const outputs = [
            {
                id: "action",
                name: "Action",
                description: "Executes the following blocks when this block finishes its task.",
                types: ["action"],
            },
            {
                id: "result",
                name: name,
                description: `The Obtained ${name}.`,
                types: type == "textinput" ? ["text", "unspecified"] : ["list", "unspecified"],
            },
        ];

        if (type == "mentionableselect") {
            outputs.pop();
            outputs.push(
                {
                    id: "users",
                    name: "Selected Users",
                    description: "The Obtained Selected Users.",
                    types: ["list", "unspecified"],
                },
                {
                    id: "roles",
                    name: "Selected Roles",
                    description: "The Obtained Selected Roles.",
                    types: ["list", "unspecified"],
                },
                {
                    id: "members",
                    name: "Selected Members",
                    description: "The Obtained Selected Members.",
                    types: ["list", "unspecified"],
                }
            );
        }

        return outputs;
    },

    async code(cache) {
        /**
         * @type {import("discord.js").ModalSubmitInteraction}
         */
        const interaction = this.GetInputValue("interaction", cache);
        const fieldname = this.GetInputValue("customid", cache) ?? this.GetOptionValue("customid", cache);
        const type = this.GetOptionValue("type", cache) || "textinput";

        try {
            if (!interaction.fields) {
                this.StoreOutputValue(null, "result", cache);
                this.RunNextBlock("action", cache);
                return;
            }
            let field;
            let values;
            switch (type) {
                case "textinput":
                    field = interaction.fields.getTextInputValue(fieldname);
                    break;
                case "selectmenu":
                    field = interaction.fields.getStringSelectValues(fieldname);
                    break;
                case "fileupload":
                    field = interaction.fields.getUploadedFiles(fieldname, false)?.toJSON();
                    break;
                case "userselect":
                    field = interaction.fields.getSelectedUsers(fieldname, false)?.toJSON();
                    break;
                case "roleselect":
                    field = interaction.fields.getSelectedRoles(fieldname, false)?.toJSON();
                    break;
                case "mentionableselect":
                    values = interaction.fields.getSelectedMentionables(fieldname, false);
                    if (values) {
                        this.StoreOutputValue(Array.from(values?.users?.values()), "users", cache);
                        this.StoreOutputValue(Array.from(values?.roles?.values()), "roles", cache);
                        this.StoreOutputValue(Array.from(values?.members?.values()), "members", cache);
                    }
                    break;
                case "channelselect":
                    values = interaction.fields.getSelectedChannels(fieldname, false)?.toJSON();
                    field = values ? Array.from(values.values()) : null;
                    break;
                default:
                    field = interaction.fields.getField(fieldname);
                    break;
            }
            this.StoreOutputValue(field, "result", cache);
            this.RunNextBlock("action", cache);
        } catch (e) {
            this.end(e, true, false);
            this.StoreOutputValue(null, "result", cache);
            this.RunNextBlock("action", cache);
        }
    },
};
