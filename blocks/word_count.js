module.exports = {
    name: "Word Count",

    description: "Count how many times a word is in a text.",

    category: "Extras",

    inputs(data){
        let inputs = [                
            {
                id: "action",
                name: "Action",
                description: "Description: Executes this block.",
                types: ["action"]
            }
        ]

        Array.apply(null, Array(data?.outputs?.result?.length)).forEach((_, i) => {
            inputs.push(
                {
                    id: `text${i + 1}`,
                    name: `Text ${i + 1}`,
                    description: "The text you are counting your words.",
                    types: ["unspecified", "text"],
                    required: true,
                },
                {
                    id: `word${i + 1}`,
                    name: `Word ${i + 1}`,
                    description: "The word you are counting",
                    types: ["unspecified", "undefined", "text"],
                }  
            )
        });      
        return inputs;
    },


    options(data) {
        let options = []

        Array.apply(null, Array(data?.outputs?.result?.length)).forEach((_, i) => {
            options.push(
                {
                    id: `sensitive${i + 1}`,
                    name: `Case Sensitive ${i + 1}`,
                    description: "Should the search be case sensitive? (Default: No)",
                    type: "SELECT",
                    options:  {
                        "no": "No",
                        "yes": "Yes"
                    }
                },
                {
                    id: `word${i + 1}`,
                    name: `Word ${i + 1}`,
                    description: "Fixed value for your search.",
                    type: "TEXT"
                }  
            )
        });
        return options;
    },

    outputs(data) {
        return [
            {
                id: "action",
                name: "Action",
                description: "Executes blocks.",
                types: ["action"]
            },
            {
                id: "result",
                name: "Result",
                description: "The ammount of times the word was repeted in your text.",
                types: ["number"],
                multiOutput: true
            }
        ]
    },


    code: function(cache) {
        let results = []

        Object.keys(cache.outputs.result).map((option, i) => {
            const word = this.GetInputValue(`word${i + 1}`, cache) || this.GetOptionValue(`word${i + 1}`, cache)
            const string = this.GetInputValue(`text${i + 1}`, cache);
            const sensitive = this.GetOptionValue(`sensitive${i + 1}`, cache);

            switch(sensitive) {
                case "no":
                    search = ("" + word).toLowerCase();
                    text = ("" + string).toLowerCase();
                    break;
                case "yes":          
                    search = word;
                    text = string;
                    break;
            }

            return results.push(text.split(search).length -1)
        })


        this.StoreOutputValue(results, "result", cache);
        this.RunNextBlock("action", cache);        
    }
};