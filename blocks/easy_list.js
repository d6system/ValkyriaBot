module.exports = {
    name: "Easy List Create",

    description: "Easily Create Predefined Lists.",

    category: "List Stuff",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes this block.",
            types: ["action"],
        },
        {
            id: "list",
            name: "List (Merge)",
            description: "The list to merge.",
            types: ["list", "unspecified"],
        },
    ],

    options(data) {
        const list = [
            {
                id: "list_item_type",
                name: "List Item Type",
                description: "Description: The type of list item.",
                type: "SELECT",
                options: {
                    text: "Text",
                    number: "Number",
                },
            },
            {
                id: "list_item_amount",
                name: "List Item Amount",
                description: "Description: The amount of list items.",
                type: "NUMBER",
                defaultValue: 3,
            },
        ];

        const amount = data?.options?.list_item_amount || 3;
        const content = data?.options?.list_item_type || "Text";

        for (let i = 0; i < amount; i++) {
            list.push({
                id: `list_item_${i + 1}`,
                name: `List Item ${i + 1}`,
                description: `The ${content.toLowerCase()} of the list item.`,
                type: content,
            });
        }

        return list;
    },

    outputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes the following blocks when this block finishes its task.",
            types: ["action"],
        },
        {
            id: "list",
            name: "List",
            description: "The list created.",
            types: ["list"]
        },
    ],

    code(cache) {
        const list = [];
        const oldList = this.GetInputValue("list", cache);

        if (oldList && Array.isArray(oldList)) {
            for (let i = 0; i < oldList.length; i++) {
                list.push(oldList[i]);
            }
        }

        for (let i = 0; i < cache.options.list_item_amount; i++) {
            list.push(this.GetOptionValue(`list_item_${i + 1}`, cache));
        }

        this.StoreOutputValue(list, "list", cache);
        this.RunNextBlock("action", cache);
    },
};
