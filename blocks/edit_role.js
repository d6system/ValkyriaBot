module.exports = {
    name: "Edit Role",

    description: "Edits a role.",

    category: "Role Stuff",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes this block.",
            types: ["action"],
        },
        {
            id: "role",
            name: "Role",
            description: "The role to edit.",
            types: ["object", "unspecified"],
            required: true,
        },
        {
            id: "role_name",
            name: "Role Name",
            description: "The new name for this role. (OPTIONAL)",
            types: ["text", "unspecified"],
        },
        {
            id: "role_color",
            name: "Role Colors",
            description: "The colors for this role. Use 'Role Color' Block to define. Text with Hex or Number with Base 10 works too! (OPTIONAL)",
            types: ["object", "text", "number", "unspecified"],
        },
        {
            id: "role_hoist",
            name: "Role Hoist",
            description:
                "Whether or not this role should be displayed separately from online members. (OPTIONAL)",
            types: ["boolean", "unspecified"],
        },
        {
            id: "role_position",
            name: "Role Position",
            description: "The new position for this role. (OPTIONAL)",
            types: ["number", "unspecified"],
        },
        {
            id: "role_permissions",
            name: "Role Permissions",
            description:
                "The new set of permissions for this role. Supports Bitfield. (OPTIONAL)",
            types: ["object", "number", "unspecified"],
        },
        {
            id: "role_mentionable",
            name: "Role Mentionable",
            description:
                "Whether or not should be allowed anyone to @mention this role. (OPTIONAL)",
            types: ["boolean", "unspecified"],
        },
        {
            id: "role_icon",
            name: "Role Icon",
            description:
                "The icon for this role. Either DIRECT URL to Image (Not larger than 256 kB) or Server Emoji Object or ID !!Only works for boosted servers!! (OPTIONAL)",
            types: ["text", "unspecified"],
        },
        {
            id: "reason",
            name: "Reason",
            description:
                "The reason for editing this role. This will appear in Audit Log of the server. (OPTIONAL)",
            types: ["text", "unspecified"],
        },
    ],

    options: [],

    outputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes the following blocks when this block finishes its task.",
            types: ["action"],
        },
        {
            id: "action_error",
            name: "Action (Error)",
            description: "Executes the following blocks when this block encounters an error.",
            types: ["action"],
        },
        {
            id: "error",
            name: "Error Message",
            description: "The error message.",
            types: ["text"],
        },
    ],

    async code(cache) {
        const role = this.GetInputValue("role", cache);
        const role_name = this.GetInputValue("role_name", cache);
        const role_color = this.GetInputValue("role_color", cache);
        const role_hoist = Boolean(this.GetInputValue("role_hoist", cache));
        const role_icon = this.GetInputValue("role_icon", cache);
        const role_position = parseInt(this.GetInputValue("role_position", cache));
        const role_permissions = this.GetInputValue("role_permissions", cache);
        const role_mentionable = Boolean(this.GetInputValue("role_mentionable", cache));
        const reason = this.GetInputValue("reason", cache);

        const axios = require("axios");

        async function fetchImageBuffer(url) {
            const { data } = await axios.get(url, { responseType: "arraybuffer", validateStatus: () => true });
            return data ? Buffer.from(data, "binary") : null;
        }

        let data = {
            name: role_name,
            hoist: role_hoist,
            icon: role_icon?.startsWith("http") ? await fetchImageBuffer(role_icon).catch(() => null) : role_icon?.length >= 3 ? role_icon : undefined,
            unicodeEmoji: role_icon?.length == 2 ? role_icon : undefined,
            position: role_position,
            permissions: role_permissions && role_permissions.hasOwnProperty("allow") ? role_permissions.allow : role_permissions,
            mentionable: role_mentionable,
        };

        switch (typeof role_color) {
            case "string":
                if (/^#?[0-9A-Fa-f]{6}$/.test(role_color)) {
                    data.colors = { primaryColor: parseInt(role_color.replace(/^#/, ""), 16) };
                } else if (Colors[role_color.toUpperCase()]) {
                    data.colors = { primaryColor: Colors[role_color.toUpperCase()] };
                }
                break;
            case "number":
                if (!isNaN(role_color) && role_color >= 0 && role_color <= 0xffffff) {
                    data.colors = { primaryColor: role_color };
                }
                break;
            case "object":
                data.colors = {
                    primaryColor: role_color.primaryColor || undefined,
                    secondaryColor: role_color.secondaryColor || undefined,
                    tertiaryColor: role_color.tertiaryColor || undefined,
                };
                break;
            default:
                break;
        }

        Object.keys(data).forEach((key) => {
            if ([undefined, null, NaN].includes(data[key])) delete data[key];
        });

        try {
            role.edit(data, reason).then(() => {
                this.RunNextBlock("action", cache);
            });
        } catch (e) {
            this.StoreOutputValue(e.message, "error", cache);
            this.RunNextBlock("action_error", cache);
        }
    },
};
