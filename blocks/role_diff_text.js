module.exports = {
  name: "Role Diff Text",
  description: "Output removed/added role based on role inputs",
  category: "Serveerster",

  inputs: [
    {
      id: "action",
      name: "Action",
      description: "Description: Activates the block.",
      types: ["action"],
    },
    {
      id: "old-roles",
      name: "Old Roles",
      description: "Description: list of old roles",
      types: ["list", "undefined", "null"],
    },
    {
      id: "new-roles",
      name: "New Roles",
      description: "Description: list of new roles",
      types: ["list", "undefined", "null"],
    },
  ],

  options: [],

  outputs: [
    {
      id: "action",
      name: "Action",
      description: "Description: Runs next blocks.",
      types: ["action"],
    },
    {
      id: "result",
      name: "Result",
      description: "Type: Text\n\nDescription: The role added/removed text.",
      types: ["text"],
    },
  ],

  code(cache) {
    const oldRoles = this.GetInputValue("old-roles", cache) ?? [];
    const newRoles = this.GetInputValue("new-roles", cache) ?? [];

    const addedRoles = newRoles.filter((v) => !oldRoles.includes(v));
    const removedRoles = oldRoles.filter((v) => !newRoles.includes(v));

    this.StoreOutputValue(
      addedRoles.length > 0
        ? `Rol toegevoegd: ${addedRoles[0]}`
        : `Rol verwijderd: ${removedRoles[0]}`,
      "result",
      cache,
    );
    this.RunNextBlock("action", cache);
  },
};
