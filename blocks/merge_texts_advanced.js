module.exports = {
    name: "Merge Texts [Advanced]",

    description: "Merge several texts into one or several outputs.",

    category: "Extras",

    aliases: ["Merge Text"],

    inputs: (data) => [
        {
            id: 'action',
            name: 'Action',
            description: 'Executes this block.',
            types: ['action']
        },
        {
            id: 'input_text',
            name: 'Text',
            description: 'Acceptable Types: Text, Unspecified, Undefined, Null, Object, Boolean, Date, Number, List\n\nDescription: The text to merge with the source text. Supports everything (converts to text automatically).',
            types: [
                'text',
                'unspecified',
                'undefined',
                'null',
                'object',
                'boolean',
                'date',
                'number',                
                'list'
            ],
            multiInput: true
        }
    ],

    options(data) {
        let options = [];

        Array.apply(null, Array(data?.outputs?.text?.length)).forEach((_, i) => {
            options.push({
                id: `text${i + 1}`,
                name: `Text ${i + 1}`,
                description: "Description: The source text to add the Text. Use the folowing codes to implement the Text: \"${text1}\", \"${text2}\", \"${text3}\".",
                type: "TEXT",
            });
        });

        options.push({
            "id": "utilize_escape",
            "name": "Utilize Escape Characters",
            "description": "Description: Utilizes escape characters in Input Text. (\\n, \\t, etc.)",
            "type": "CHECKBOX",
        });
        return options;
    },    

    outputs: [
        {
            id: "action",
            name: "Action",
            description: "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            types: ["action"]
        },
        {
            id: "text",
            name: "Text",
            description: "Type: Text\n\nDescription: The merged text.",
            types: ["text"],
            multiOutput: true,
        }
    ],

    code(cache) {
        const variables = this.GetInputValue("input_text", cache);
        const utilizeEscape = this.GetOptionValue("utilize_escape", cache);

        this.StoreOutputValue(
            Object.keys(cache.options).map((option, index) => {
                if(option === "utilize_escape") return null;
                let text = this.GetOptionValue(option, cache)
                text = text?.replace(/\${text(\d+)}/g, (_, index) => variables[index - 1] ?? "");
                if(utilizeEscape) {
                    text = text?.replace(/\\n/g, '\n')
                        .replace(/\\r/g, '\r')
                        .replace(/\\t/g, '\t')
                        .replace(/\\v/g, '\v')
                        .replace(/\\f/g, '\f')
                        .replace(/\\b/g, '\b')
                        .replace(/\\0/g, '\0')
                        .replace(/\\'/g, "'")
                        .replace(/\\"/g, '"')
                        .replace(/\\\\/g, '\\');
                }
                return text;
            }),
            "text",
            cache
        );

        this.RunNextBlock("action", cache);
    }
}