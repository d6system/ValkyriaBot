module.exports = {
    name: "Random Item From List",

    description: "Chooses a random item from a list with equal chance for each item.",

    category: "List Stuff",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes this block.",
            types: ["action"]
        },
        {
            id: "list",
            name: "List",
            description: "The list from which a random item will be chosen.",
            types: ["list", "unspecified"],
            required: true
        }
    ],

    options: [],

    outputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes the following blocks when this block finishes its task.",
            types: ["action"]
        },
        {
            id: "item",
            name: "Random Item",
            description: "The randomly chosen item from the list.",
            types: ["unspecified"]
        },
        {
            id: "index",
            name: "Random Index",
            description: "The index of the randomly chosen item.",
            types: ["number", "unspecified"]
        }
    ],

    code(cache) {
        const list = this.GetInputValue("list", cache);

        if (!Array.isArray(list) || list.length === 0) {
            this.StoreOutputValue(undefined, "item", cache);
            this.StoreOutputValue(undefined, "index", cache);
            this.RunNextBlock("action", cache);
            return;
        }

        const index = Math.floor(Math.random() * list.length);
        const item = list[index];

        this.StoreOutputValue(item, "item", cache);
        this.StoreOutputValue(index, "index", cache);

        this.RunNextBlock("action", cache);
    }
}
