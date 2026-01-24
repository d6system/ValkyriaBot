module.exports = {
  name: "Weighted Items From Object List",
  description: "Pickes an Item from a list of objects with different choosing weights.",
  category: "Math",
  inputs: [
    {
      id: "action",
      name: "Action",
      description: "Executes this block.",
      types: ["action"],
    },
    {
      id: "items",
      name: "Item List",
      description: "The list of objects to select from. Object Format must be: { weight: / id: }",
      types: ["list", "undefined"],
    }
  ],
  options: [],

  outputs: [
    {
      id: "action",
      name: "Action",
      description: "Triggers the next block.",
      types: ["action"],
    },
    {
      id: "random_item",
      name: "Random Item",
      description: "The random item slected.",
      types: ["undefined"],
    }
  ],
  async code(cache) {
    const  rwc = await this.require("random-weighted-choice");
    const items = await this.GetInputValue('items', cache)
    
    this.StoreOutputValue(rwc(items) , 'random_item', cache)
    
    this.RunNextBlock("action", cache);
  },
};
