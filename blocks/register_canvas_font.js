module.exports = {
    name: "Register Canvas Font",

    description: "Registers a Custom font for Usage on Servers which don't have the option to intall Fonts. Block has to be used BEFORE Canvas Creation!",

    category: "Canvas",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        }
    ],

    options: [
        {
            "id": "path",
            "name": "Path (REQUIRED)",
            "description": "Type: Text\n\nDescription: The Path to the Font File. Can be a URL or a Relative or Absolute File Path.",
            "type": "TEXT"
        },
        {
            "id": "family",
            "name": "Family (REQUIRED)",
            "description": "Type: Text\n\nDescription: The Font Family Name.",
            "type": "TEXT"
        },
        {
            "id": "weight",
            "name": "Weight (OPTIONAL)",
            "description": "Type: Text\n\nDescription: The Font Weight.",
            "type": "TEXT"
        },
        {
            "id": "style",
            "name": "Style (OPTIONAL)",
            "description": "Type: Text\n\nDescription: The Font Style.",
            "type": "TEXT"
        }
    ],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        }
    ],

    async code(cache) {
        const { registerFont } = await this.require('canvas')
        
        const path = this.GetOptionValue("path", cache);
        const family = this.GetOptionValue("family", cache);
        const weight = this.GetOptionValue("weight", cache) || undefined;
        const style = this.GetOptionValue("style", cache)  || undefined;

        registerFont(path, { family, weight, style });

        this.RunNextBlock("action", cache);
    }
}