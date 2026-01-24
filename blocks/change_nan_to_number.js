module.exports = {
    name: "Change NaN to number",

    description: "Changes non-number values to a default number of your choice, while keeping numbers intact.",

    category: "Extras",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Acceptable Types: Action\n\nDescription: Executes this block.",
            types: ["action"]
        },
        {
            id: "input",
            name: "Input",
            description: "Acceptable Types: Unspecified, Undefined, Null, Object, Boolean, Date, Number, Text, List\n\nDescription: The input to check if its NaN.",
            types: ["unspecified", "undefined", "null", "object", "boolean", "date", "number", "text", "list"],
            required: true
        },
        {
            id: "number",
            name: "Number if NaN",
            description: "Acceptable Types: Number, Text\n\nDescription: The number tu return if Input is NaN.",
            types: ["number", "text", "unspecified", "undefined", "null"]
        }
    ],

    options: [        
        {
            id: "number",
            name: "Number if NaN",
            description: "Description: The number tu return if Input is NaN.",
            type: "NUMBER"
        }
    ],

    outputs: [
        {
            id: "action",
            name: "Action",
            description: "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            types: ["action"]
        },
        {
            id: "result",
            name: "Result",
            description: "Type: Number\n\nDescription: Returns the number in input or a your selected number if NaN",
            types: ["Number"]
        }
    ],

    code(cache) {
		const input_number = parseFloat(this.GetInputValue("input", cache));
		const defaultnumber = parseFloat(this.GetInputValue("number", cache)) || parseFloat(this.GetOptionValue("number", cache));
		
		let result = input_number;
		if(isNaN(input_number)){
			result = defaultnumber;
		}
       
        this.StoreOutputValue(result, "result", cache);
        this.RunNextBlock("action", cache);
    }
}