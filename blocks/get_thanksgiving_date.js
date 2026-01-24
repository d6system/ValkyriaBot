module.exports = {
  name: "Get Thanksgiving Date",

  description: "Calculates the date of Thanksgiving (4th Thursday of November) for a given year in ISO 8601 format.",

  category: "Date",

  inputs: [
    {
      id: "action",
      name: "Action",
      description: "Executes this block.",
      types: ["action"]
    },
    {
      id: "year",
      name: "Year",
      description: "The year to calculate Thanksgiving for.",
      types: ["number", "text", "unspecified"],
      required: true
    }
  ],

  options: [],

  outputs: [
    {
      id: "action",
      name: "Action",
      description: "Executes the next block after calculation.",
      types: ["action"]
    },
    {
      id: "date",
      name: "Thanksgiving Date",
      description: "The ISO 8601 formatted date for Thanksgiving.",
      types: ["text"]
    }
  ],

  code(cache) {
    const year = parseInt(this.GetInputValue("year", cache));
    const november = 10; // November is month index 10 (0-based)

    // Start from the 1st of November
    let date = new Date(year, november, 1);
    let thursdayCount = 0;

    // Loop through November days until 4th Thursday is found
    while (date.getMonth() === november) {
      if (date.getDay() === 4) { // 4 = Thursday
        thursdayCount++;
        if (thursdayCount === 4) {
          break;
        }
      }
      date.setDate(date.getDate() + 1);
    }

    const isoDate = date.toISOString().split("T")[0];

    this.StoreOutputValue(isoDate, "date", cache);
    this.RunNextBlock("action", cache);
  }
};