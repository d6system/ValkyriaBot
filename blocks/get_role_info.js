module.exports = {
    name: "Get Role Info",

    description: "Gets the role information.",

    category: "Role Stuff",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Acceptable Types: Action\n\nDescription: Executes this block.",
            types: ["action"],
        },
        {
            id: "role",
            name: "Role",
            description: "Acceptable Types: Object, Unspecified\n\nDescription: The role to get the information.",
            types: ["object", "unspecified"],
            required: true,
        },
    ],

    options: [
        {
            id: "role_info",
            name: "Role Info",
            description: "Description: The role information to get.",
            type: "SELECT",
            options: {
                1: "Role Position [Number]",
                2: "[DEPRECATED] Role Base 10 Color [Number]",
                3: "Role Created At [Date]",
                5: "Is Role Editable By The Bot? [Boolean]",
                6: "Role Server [Server]",
                7: "Role Hex Color [Text]",
                8: "Is Role Separate From Others? [Boolean]",
                9: "Role ID [Text]",
                10: "Is Role Managed By An External Service? [Boolean]",
                11: "Role Member List [List <Member>]",
                12: "Is Role Mentionable? [Boolean]",
                13: "Role Name [Text]",
                14: "Role Permissions [Permissions]",
                15: "Role Raw Position (API) [Number]",
                16: "Role Mention [Text]",
                17: "Role Emoji / Role Icon URL [Boosted Server Only]",
                20: "Role Colors Object [Object]",
                210: "Role Primary Base 10 Color [Number]",
                211: "Role Primary Color [Text]",
                220: "Role Secondary Base 10 Color [Number]",
                221: "Role Secondary Color [Text]",
                230: "Role Tertiary Base 10 Color [Number]",
                231: "Role Tertiary Color [Text]",
            },
        },
    ],

    outputs: [
        {
            id: "action",
            name: "Action",
            description: "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            types: ["action"],
        },
        {
            id: "result",
            name: "Result",
            description: "Type: Unspecified\n\nDescription: The information obtained from the role.",
            types: ["unspecified"],
        },
    ],

    code(cache) {
        const toHex = n => n == null ? null : `#${n.toString(16).padStart(6, '0').toUpperCase()}`;
        const role = this.GetInputValue("role", cache);
        const role_info = parseInt(this.GetOptionValue("role_info", cache));

        let result;
        switch (role_info) {
            case 1:
                result = role.position;
                break;
            case 2:
                // Deprecated - NEEDS TO BE REMOVED - Noted on 28/09/2025
                result = role.color;
                break;
            case 3:
                result = role.createdAt;
                break;
            case 5:
                result = role.editable;
                break;
            case 6:
                result = role.guild;
                break;
            case 7:
                result = role.hexColor;
                break;
            case 8:
                result = role.hoist;
                break;
            case 9:
                result = role.id;
                break;
            case 10:
                result = role.managed;
                break;
            case 11:
                result = Array.from(role?.members?.values());
                break;
            case 12:
                result = role?.mentionable;
                break;
            case 13:
                result = role?.name;
                break;
            case 14:
                result = role?.permissions;
                break;
            case 15:
                result = role?.rawPosition;
                break;
            case 16:
                result = role?.toString();
                break;
            case 17:
                if (role?.unicodeEmoji !== null) {
                    result = role?.unicodeEmoji;
                } else if (role?.icon !== null) {
                    result = role.iconURL({ dynamic: true, format: "png" });
                } else {
                    result = null;
                }
                break;
            case 20:
                result = role?.colors;
                break;
            case 210:
                result = role?.colors?.primaryColor;
                break;
            case 211:
                result = toHex(role?.colors?.primaryColor);
                break;
            case 220:
                result = role?.colors?.secondaryColor;
                break;
            case 221:
                result = toHex(role?.colors?.secondaryColor);
                break;
            case 230:
                result = role?.colors?.tertiaryColor;
                break;
            case 231:
                result = toHex(role?.colors?.tertiaryColor);
                break;
        }

        this.StoreOutputValue(result, "result", cache);
        this.RunNextBlock("action", cache);
    },
};
