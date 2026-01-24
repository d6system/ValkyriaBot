module.exports = {
    name: "Conditional value returns text",

    description: "Compares the input to different values; returns fixed texts if matched.",

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
            name: "Text",
            description: "Acceptable Types: Unspecified, Undefined, Null, Text\n\nDescription: The text to compare your values with.",
            types: ["unspecified", "undefined", "null", "text"]
        },
        {
            id: "text",
            name: "Value",
            description: "Acceptable Types: Unspecified, Undefined, Null, Text\n\nDescription: If matched with this value returns an Output",
            types: ["unspecified", "undefined", "null", "text"],
            multiInput: true
        },
        {
            id: "output",
            name: "Output",
            description: "Acceptable Types: Unspecified, Undefined, Null, Text\n\nDescription: The text that will be send if your Text matches a Value.",
            types: ["unspecified", "undefined", "null", "text"],
            multiInput: true
        },
        {
            id: "error",
            name: "Error Text",
            description: "Acceptable Types: Unspecified, Undefined, Null, Text\n\nDescription: If nothing matches your search; this text will be send (Optional).",
            types: ["unspecified", "undefined", "null", "text"]
        }
    ],

    options: [
        {
            id: "operation",
            name: "Comparison Type",
            description: "Description: The type of comparison between the values.",
            type: "SELECT",
                options: {
                    "equal": "Equals",
                    "includes": "Includes",
                    "start_with": "Start With",
                    "end_with": "End With"
                }
        },
        {
            id: "sensitive",
            name: "Case sensitive?",
            description: "Description: Is your search case sensitive?",
            type: "checkbox",
            defaultValue: false
        },
        {
            id: "error",
            name: "Error Text",
            description: "Acceptable Types: Unspecified, Undefined, Null, Text\n\nDescription: If nothing matches your search; this text will be send (Optional).",
            type: "TEXT"
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
            description: "Type: Unspecified\n\nDescription: The return output",
            types: ["text"]
        }
    ],

    code(cache) { 
        var input = this.GetInputValue("input", cache);
        const text = this.GetInputValue("text", cache);
        const output = this.GetInputValue("output", cache); 
        const operation = this.GetOptionValue("operation", cache);  
        const sensitive = this.GetOptionValue("sensitive", cache);     
        const error = this.GetInputValue("error", cache) || this.GetOptionValue("error", cache);
           
        let result;
        
        if(sensitive == false){
            input = input.toLowerCase();
        }        
        
        if (text.length != output.length) {
            this.console("WARN", `Your values and outputs don't match in the 'Conditional Value Return Text' block.\nPlease make sure they do for the block to work properly.`);
            return
        };

        switch(operation) {
            case "equal":  
            for (const [index, value] of text.entries()) {    
                var check = value;
                if(sensitive  == false){check = value.toLowerCase()}
                if(input == check){
                    result = output[index];
                }
            }; 
            break;            
            case "includes":
                for (const [index, value] of text.entries()) {      
                    var check = value;          
                    if(sensitive  == false){check = value.toLowerCase()}
                    if(input.includes(check)){
                        result = output[index];
                    }
                };
            break;
            case "start_with":
                for (const [index, value] of text.entries()) {   
                    var check = value;          
                    if(sensitive  == false){check = value.toLowerCase()}             
                    if(input.startsWith(check)){
                        result = output[index];
                    }
                };
            break;
            case "end_with":
                for (const [index, value] of text.entries()) {   
                    var check = value;          
                    if(sensitive  == false){check = value.toLowerCase()}             
                    if(input.endsWith(check)){
                        result = output[index];
                    }
                };
            break;
        }          

        if(result == undefined){result = error || undefined}

        this.StoreOutputValue(result, "result", cache);
        this.RunNextBlock("action", cache);            
    }
}