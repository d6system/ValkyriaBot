module.exports = {
    name: "Get Items From List",

    description: "Gets different items from the list.",

    category: "List Stuff",
    
    inputs(data) {
        let inputs = [];

        inputs.push({
            id: "action",
            name: "Action",
            description: "Acceptable Types: Action\n\nDescription: Executes this block.",
            types: ["action"]
            },
            {
                id: "list",
                name: "List",
                description: "Acceptable Types: List, Unspecified\n\nDescription: The list to get the items.",
                types: ["list", "unspecified"],
                required: true
            });

        Array.apply(null, Array(data?.outputs?.item?.length)).forEach((_, i) => {
            inputs.push({
                id: `position${i + 1}`,
                name: `Position ${i + 1}`,
                description: "Acceptable Types: Number, Text, Unspecified\n\nDescription: The position of the item(s) you want.",
                types: ["number", "text","unspecified"],
            });
        });

        return inputs;
    }, 


    options(data) {
        let options = [];

        Array.apply(null, Array(data?.outputs?.item?.length)).forEach((_, i) => {
            options.push({
                id: `position${i + 1}`,
                name: `Position ${i + 1}`,
                description: "Description: The position of the item you want. Item position in OPTIONS starts at: 1",
                type: "NUMBER",
                defaultValue: 1,
            });
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
            id: "item",
            name: "Item",
            description: "Type: Unspecified\n\nDescription: The item obtained from the list.",
            types: ["unspecified", "undefined", "null", "object", "boolean", "date", "number", "text", "list"],
            multiOutput: true
        }
    ],

    code(cache) {
        const list = this.GetInputValue("list", cache);

        var positions_options = cache.options;
        positions_options = Object.values(positions_options).map(value => Number(value) - 1);
        
        const position_inputs = [];
        Object.keys(cache.inputs)
        .filter((key) => key.startsWith("position"))
        .forEach((key) => {
            position_inputs.push(this.GetInputValue(key, cache));
        });        

        const positions = positions_options.map((item, index) => {
            if (typeof position_inputs[index] === "number") {
                return position_inputs[index];
            }else if(item == 0 && position_inputs[index] == undefined){
                return undefined;
            }else{
                return item
            }
            });

        var items = []
        for (const [index, value] of positions.entries()) {
            let result
            var position = parseFloat(value);            
            if(isNaN(position)){
                position = index;
            }else if(position == -2){
                position = list.length - 1;
            }else if(position == -3){
                position = Math.floor(Math.random() * (list.length));
            }
            result = list[position]
            items.push(result);
        };

        this.StoreOutputValue(
            Object.keys(cache.options).map((option, index) => {
                return items[index];
            }),
            "item",
            cache
        );
        
        this.RunNextBlock("action", cache);
        
    }
}