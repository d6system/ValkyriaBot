module.exports = {
    name: "Read Google Spreadsheet",

    description: "Read Public Spreadsheet from GoogleDocs.",

    category: "Extras",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "data",
            "name": "URL / ID",
            "description": "Acceptable Types: Text\n\nDescription: The spreadsheet URL or ID.\nRemember yor sheet needs to be Public for anyone to read for it to work.",
            "types": ["text", "unspecified"]
        },
        {
            "id": "sheet",
            "name": "Sheet Name",
            "description": "Acceptable Types: Text\n\nDescription: Sheet name (Optional)",
            "types": ["text", "unspecified"]
        },
        {
            "id": "string",
            "name": "String Values Only",
            "description": "Get numeric and date values as formatted in Google Sheets.",     
            "types": ["boolean", "unspecified"]
        }
    ],

    options: [        
        {
            "id": "data",
            "name": "URL / ID",
            "description": "Description: The spreadsheet URL or ID.\nRemember yor sheet needs to be Public for anyone to read for it to work.",
            "type": "TEXT"
        },
        {
            "id": "sheet",
            "name": "Sheet Name",
            "description": "Description: Sheet name (Optional)",
            "type": "TEXT"
        },
        {
            "id": "string",
            "name": "String Values Only",
            "description": "Get numeric and date values as formatted in Google Sheets.",            
            "type": "CHECKBOX",
            "defaultValue": false
        }
    ],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks for each item in the list.",
            "types": ["action"]
        },
        {
            "id": "table",
            "name": "Table",
            "description": "Description: Your list of objects from the Spreadsheet.",
            "types": ["list"]
        }
    ],

  async  code(cache) {    
    /*Run: 
    npm i public-google-sheets-parser 
    if needed*/
    const PublicGoogleSheetsParser = require('public-google-sheets-parser')
    var spreadsheetId  = this.GetInputValue("data", cache) || this.GetOptionValue("data", cache); 
    const sheetname  = this.GetInputValue("sheet", cache) || this.GetOptionValue("sheet", cache); 
    const string = this.GetInputValue("string", cache) || this.GetOptionValue("string", cache);     

    if(spreadsheetId.includes("/")){
        const regex = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
        const match = spreadsheetId.match(regex);
        spreadsheetId = match[1]
    }

    let  option = { useFormat: string };
    if (sheetname) { option.sheetName = sheetname }
    const parser = new PublicGoogleSheetsParser(spreadsheetId, option)
    var table = await parser.parse()
    
    this.StoreOutputValue(table, "table", cache);          
    this.RunNextBlock("action", cache);

    }
}