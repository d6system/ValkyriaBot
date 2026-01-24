module.exports = {
  name: "Format Number to 00.00",

  description: "Formats a number to at least 2 digits before the decimal and a user-defined amount of digits after the decimal.",

  category: "Text",

  inputs: [
    {
      id: "action",
      name: "Action",
      description: "Executes this block.",
      types: ["action"]
    },
    {
      id: "number",
      name: "Number",
      description: "The number to format.",
      types: ["number", "text", "unspecified"],
      required: true
    }
  ],

  options: [
    {
      id: "decimal_places",
      name: "Decimal Places",
      description: "The number of decimal places to format to (e.g., 2).",
      type: "NUMBER",
      defaultValue: 2
    }
  ],

  outputs: [
    {
      id: "action",
      name: "Action",
      description: "Executes the following blocks when this block finishes its task.",
      types: ["action"]
    },
    {
      id: "formatted",
      name: "Formatted Text",
      description: "The formatted number as text.",
      types: ["text"]
    }
  ],

  code(cache) {
    const raw = this.GetInputValue("number", cache);
    const decimals = this.GetOptionValue("decimal_places", cache);

    const num = parseFloat(raw);
    if (isNaN(num)) {
      this.StoreOutputValue("NaN", "formatted", cache);
      this.RunNextBlock("action", cache);
      return;
    }

    const integerPart = Math.floor(Math.abs(num)).toString().padStart(2, '0');
    const decimalPart = num.toFixed(decimals).split(".")[1];
    const sign = num < 0 ? "-" : "";

    const result = `${sign}${integerPart}.${decimalPart}`;
    this.StoreOutputValue(result, "formatted", cache);
    this.RunNextBlock("action", cache);
  }
};
