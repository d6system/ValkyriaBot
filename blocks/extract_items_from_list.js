module.exports = {
    name: "Extract Items From List",

    description: "Extracts items from a list into another one.",

    category: "List Stuff",

    inputs: [
        {
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
        },
        {
            id: "position",
            name: "Item",
            description: "Acceptable Types: Number, Text, Unspecified\n\nDescription: The position of the item you want. If not especified, it will return the number of the position by default.\nEx: If you have 3 unspecified positions, you will get items [1, 2 and 3] from your list.",
            types: ["number", "text","unspecified"],
            multiInput: true
        }
    ],

    options: [],

    outputs: [
        {
            id: "action",
            name: "Action",
            description: "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            types: ["action"]
        },
        {
            id: "item",
            name: "List",
            description: "Type: Unspecified\n\nDescription: The new list with the selected items.",
            types: ["list"],
        }
    ],

    code(cache) {
        const list = this.GetInputValue("list", cache);
        const positions = this.GetInputValue("position", cache);
        var items = []

        for (const [index, value] of positions.entries()) {
            let result
            var position = parseFloat(value)-1;            
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

        this.StoreOutputValue(items, "item", cache);
        this.RunNextBlock("action", cache);
    }
}