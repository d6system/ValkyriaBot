module.exports = {
    name: "Transform Value",

    description: "Transforms a value into another format or a variation of the same format.",

    category: "Extras",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Executes this block.",
            "types": ["action"]
        },
        {
            "id": "value",
            "name": "Value",
            "description": "The value to transform.",
            "types": ["unspecified", "number", "text", "list", "object"],
        }
    ],

    options(data) {
        return [
            {
                id: "transformation_type",
                name: "Transformation Type",
                description: "The type of transformation for the value.",
                type: "SELECT",
                options: [
                    {
                        type: "GROUP",
                        name: "Value to Text",
                        options: [
                            { id: "text", name: "Text", description: "Turn the input value into text form (works with lists)"},
                            { id: "uppercase", name: "Uppercase", description: "TURN THE VALUE INTO UPPERCASE TEXT"},
                            { id: "lowercase", name: "Lowercase", description: "turn the value into lowecase text"},
                            { id: "capitalize1", name: "Capitalize (First Word Per Sentence)", description: "Capitalize the first. Word per. Sentance"},
                            { id: "capitalize2", name: "Capitalize (All Words)", description: "Capitalize All Words Within The Value"},
                            { id: "remNumber", name: "Remove Numbers", description: "Remove all numbers from the value"},
                            { id: "listToText", name: "List to Text (With custom Separator)", description: "Turn the input list into text form"},
                            { id: "color", name: "Color", description: "Turn a text value into a color"},
                        ]
                    },
                    {
                        type: "GROUP",
                        name: "Value to Number",
                        options: [
                            { id: "integar", name: "Integar", description: "Turn the input value into a whole number"},
                            { id: "decimal", name: "Decimal", description: "Turn the input value into a decimal number"},
                            { id: "remDecimal", name: "Remove Decimals", description: "Remove the decimal from a value"},
                            { id: "round", name: "Round", description: "Round the value to the nearest whole number"},
                            { id: "remLetters", name: "Remove Letters", description: "Remove all letters from the value"},
                            { id: "punctuate", name: "Add punctuation", description: "Adds local punctuation to the value"},
                        ]
                    },
                    {
                        type: "GROUP",
                        name: "Object",
                        options: [
                            { id: "toObject", name: "To Object", description: "Turn a text based object into a object"},
                        ]
                    },                  
                ]
            },
            data?.options?.transformation_type == "listToText" ?
                {
                    "id": "separator",
                    "name": "Separator",
                    "description": "The text to insert between the items from the list. Default: \", \". (OPTIONAL)",
                    "type": "TEXT"
                }
            : undefined
        ]
    },

    outputs(data) {
        const isText = ["text", "uppercase", "lowercase", "capitalize1", "capitalize2", "remNumber", "listToText", "color"].includes(data?.options?.transformation_type || "text");
        const isNumber = ["integar", "decimal", "remDecimal", "round", "remLetters", "punctuate"].includes(data?.options?.transformation_type);
        return [
            {
                "id": "action",
                "name": "Action",
                "description": "Executes the following blocks when this block finishes its task.",
                "types": ["action"]
            },
            {
                "id": "result",
                "name": "Result",
                "description": "The value transformed.",
                "types": isText ? ["text", "unspecified"] : isNumber ? ["number", "unspecified"] : ["object", "unspecified"]
            }
        ]
    },

    async code(cache) {
        const value = this.GetInputValue("value", cache);
        const transformation_type = this.GetOptionValue("transformation_type", cache);
        const separator = this.GetOptionValue("seperator", cache) || ", ";
        const text = "" + value

        let res = value;
        switch(transformation_type) {
            case "integar":
                res = parseInt(value);
                break;
            case "decimal":
                res = parseFloat(value);
                break;
            case "remDecimal":
                res = Math.floor(value);
                break;
            case "round":
                res = Math.round(value);
                break;
            case "remNumber":
                res = value.replace(/[0-9]/g, '');
                break;
            case "remLetters":
                res = value.replace(/\D/g, '')
                break;
            case "punctuate":
                res = Number(value.replace(/\D/g, '')).toLocaleString()
                break;
            case "text":
                if (Array.isArray(value)) {
                    res = value.join(",")
                } else {
                    res = text
                }
                break;
            case "uppercase":
                res = text.toUpperCase();
                break;
            case "lowercase":
                res = text.toLowerCase();
                break;
            case "capitalize1":
                res = text.replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
                break;
            case "capitalize2":
                res = text.replace(/(^[\s]*|[.?!] *|\n\s+)\S/g, match => match.toUpperCase());
                break;
            case "listToText":
                res = value.join(separator)
                break;
            case "toObject":
                try {
                    res = JSON.parse(text);
                } catch {}
                break;
            case "color":
                const stc = await this.require("string-to-color");
                try {
                    res = await stc(text);
                } catch (e) {}
                break;
        }

        this.StoreOutputValue(res, "result", cache);
        this.RunNextBlock("action", cache);
    }
}