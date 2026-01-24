module.exports = {
    name: "Role Colors",

    description: "Creates role colors with support for Discord's new color system (Simple, Fade, or Holographic).",

    category: "Inputs",

    auto_execute: true,

    inputs(data) {
        if (!data?.options?.show_inputs) return;

        const inputs = [
            {
                id: "action",
                name: "Action",
                description: "Executes this block.",
                types: ["action"]
            },
            {
                id: "colorMode",
                name: "Color Mode",
                description: "Select the color mode for the role (simple, fade, or holographic).",
                types: ["text", "unspecified"]
            }
        ];

        const colorMode = data?.options?.colorMode || "simple";

        if (colorMode === "simple") {
            inputs.push({
                id: "primaryColor",
                name: "Primary Color",
                description: "The primary color for the role.",
                types: ["text", "number", "object", "unspecified"]
            });
        } else if (colorMode === "fade") {
            inputs.push(
                {
                    id: "primaryColor",
                    name: "Primary Color",
                    description: "The primary color for the role.",
                    types: ["text", "number", "object", "unspecified"]
                },
                {
                    id: "secondaryColor",
                    name: "Secondary Color",
                    description: "The secondary color for the fade effect.",
                    types: ["text", "number", "object", "unspecified"]
                }
            );
        }
        // Holographic mode doesn't need color inputs as it uses Discord's predefined colors

        return inputs;
    },

    options(data) {
        const options = [
            {
                id: "show_inputs",
                name: "Enable Inputs?",
                description: "Use inputs instead of static options and allow action chaining.",
                type: "CHECKBOX"
            },
            {
                id: "colorMode",
                name: "Color Mode",
                description: "Select the color mode for the role.",
                type: "SELECT",
                options: {
                    "simple": "Simple (Primary Color Only)",
                    "fade": "Fade (Primary + Secondary Colors)",
                    "holographic": "Holographic (Discord's Holographic Style)"
                }
            }
        ];

        const colorMode = data?.options?.colorMode || "simple";

        if (colorMode === "simple") {
            options.push({
                id: "primaryColor",
                name: "Primary Color",
                description: "The primary color for the role.",
                type: "color"
            });
        } else if (colorMode === "fade") {
            options.push(
                {
                    id: "primaryColor",
                    name: "Primary Color",
                    description: "The primary color for the role.",
                    type: "color"
                },
                {
                    id: "secondaryColor",
                    name: "Secondary Color",
                    description: "The secondary color for the fade effect.",
                    type: "color"
                }
            );
        }
        // Holographic mode doesn't need color inputs as it uses Discord's predefined colors

        return options;
    },

    outputs(data) {
        const outputs = [
            {
                id: "colors",
                name: "Role Colors",
                description: "The color object for Discord roles.",
                types: ["object"],
            }
        ];

        if (data?.options?.show_inputs) {
            outputs.unshift({
                id: "action",
                name: "Action",
                description: "Executes the following blocks when this block finishes its task.",
                types: ["action"]
            });
        }

        return outputs;
    },

    code(cache) {
        const { Colors, Constants } = require("discord.js");
        
        const executedFrom = cache.executedFrom?.[0];
        const showInputs = this.GetOptionValue("show_inputs", cache);
        if (executedFrom != "action" && showInputs) return;
        
        const get = (id) => this.GetInputValue(id, cache) ?? this.GetOptionValue(id, cache);
        
        const colorMode = get("colorMode") || "simple";
        let colorsObject = {};

        const processColor = (color) => {
            if (!color) return Colors.Default;
            
            // Handle color objects from other blocks
            if (typeof color === "object") {
                if (color.primaryColor !== undefined) return color.primaryColor;
                if (color.colors && color.colors.primaryColor !== undefined) return color.colors.primaryColor;
                return Colors.Default;
            }
            
            // Handle hex strings
            if (typeof color === "string" && color.startsWith("#")) {
                return parseInt(color.replace("#", ""), 16);
            }
            
            // Handle numbers or other formats
            return color || Colors.Default;
        };

        if (colorMode === "simple") {
            const primaryColor = get("primaryColor");
            colorsObject.primaryColor = processColor(primaryColor);
        } else if (colorMode === "fade") {
            const primaryColor = get("primaryColor");
            const secondaryColor = get("secondaryColor");
            
            colorsObject.primaryColor = processColor(primaryColor);
            colorsObject.secondaryColor = processColor(secondaryColor);
        } else if (colorMode === "holographic") {
            // Use Discord's predefined holographic colors
            colorsObject.primaryColor = Constants.HolographicStyle.Primary;
            colorsObject.secondaryColor = Constants.HolographicStyle.Secondary;
            colorsObject.tertiaryColor = Constants.HolographicStyle.Tertiary;
        }

        this.StoreOutputValue(colorsObject, "colors", cache);
        
        if (executedFrom === "action") {
            this.RunNextBlock("action", cache);
        }
    },
}