module.exports = {
    name: "Get Interaction Option",

    description: "Gets the Argument by Name from an Interaction(e.g. Slash Command) by @XCraftTM",

    category: "Interaction Stuff",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Acceptable Types: Action\n\nDescription: Executes this block.",
            types: ["action"],
        },
        {
            id: "interaction",
            name: "Interaction",
            description: "Acceptable Types: Object, Unspecified\n\nDescription: The Interaction to get the Argument from.",
            types: ["object", "unspecified"],
            required: true,
        },
        {
            id: "name",
            name: "Name",
            description: "Acceptable Types: Text, Unspecified\n\nDescription: The Name of the Argument",
            types: ["text", "unspecified"],
        },
    ],

    options: [
        {
            id: "name",
            name: "Argument Name",
            description: "Description: The Name of the Argument you want to get",
            type: "TEXT",
        },
        {
            id: "get",
            name: "Get Type",
            description: "Description: What Type the Argument is...",
            type: "SELECT",
            options: {
                Text: "Text",
                Channel: "Channel",
                User: "User",
                Member: "Member",
                Role: "Role",
                Number: "Number",
                Attachment: "Attachment",
                Mentionable: "Mentionable",
                Message: "Message",
                Boolean: "Boolean",
                "Sub Command Group": "Sub Command Group",
                "Sub Command": "Sub Command",
                Anything: "Anything",
                "Anything (RAW)": "Anything_Raw"
            },
        },
    ],

    outputs(data) {
        function getType(get) {
            switch (get) {
                case "Text":
                    return ["text", "unspecified"];
                case "Channel":
                    return ["object", "unspecified"];
                case "User":
                    return ["object", "unspecified"];
                case "Member":
                    return ["object", "unspecified"];
                case "Role":
                    return ["object", "unspecified"];
                case "Number":
                    return ["number", "unspecified"];
                case "Attachment":
                    return ["object", "unspecified"];
                case "Mentionable":
                    return ["object", "unspecified"];
                case "Message":
                    return ["object", "unspecified"];
                case "Boolean":
                    return ["boolean", "unspecified"];
                case "Sub Command Group":
                    return ["text", "unspecified"];
                case "Sub Command":
                    return ["text", "unspecified"];
                case "Anything":
                    return ["unspecified"];
                case "Anything_Raw":
                    return ["object", "unspecified"];
            }
        }

        type = data?.options?.get || "Text";

        return [
            {
                id: "action",
                name: "Action",
                description: "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
                types: ["action"],
            },
            {
                id: "output",
                name: getType(type)[0] != "object" ? getType(type)[0].charAt(0).toUpperCase() + getType(type)[0].slice(1) : data?.options?.get || "Text",
                description: "The Property Value Obtained.",
                types: getType(type),
            },
        ];
    },

    async code(cache) {
        const interaction = this.GetInputValue("interaction", cache);
        var get = this.GetOptionValue("get", cache);
        var name = this.GetInputValue("name", cache);

        if (name === undefined) {
            name = this.GetOptionValue("name", cache);
        }

        let output;
        switch (get) {
            case "Text":
                output = await interaction.options.getString(name);
                break;
            case "Channel":
                output = await interaction.options.getChannel(name);
                break;
            case "User":
                output = await interaction.options.getUser(name);
                break;
            case "Member":
                output = await interaction.options.getMember(name);
                break;
            case "Role":
                output = await interaction.options.getRole(name);
                break;
            case "Number":
                output = await interaction.options.getNumber(name);
                if (output === undefined) {
                    output = await interaction.options.getInteger(name);
                }
                break;
            case "Attachment":
                output = await interaction.options.getAttachment(name);
                break;
            case "Mentionable":
                output = await interaction.options.getMentionable(name);
                break;
            case "Message":
                output = await interaction.options.getMessage(name);
                break;
            case "Boolean":
                output = await interaction.options.getBoolean(name);
                break;
            case "Sub Command Group":
                output = await interaction.options.getSubcommandGroup();
                break;
            case "Sub Command":
                output = await interaction.options.getSubcommand(false);
                break;
            case "Anything":
                var json = await interaction.options.get(name, false);
                if (json.hasOwnProperty("value")) {
                    output = json.value;
                } else {
                    output = undefined;
                }
                break;
            case "Anything_Raw":
                var json = await interaction.options.get(name, false)
                output = json;
                break;
        }

        this.StoreOutputValue(output, "output", cache);
        this.RunNextBlock("action", cache);
    },
};