module.exports = {
    name: "Database SQL Conf",

    description: "This block is used to establish a connection with a SQL database. Created by @ju#1111. Updated by d6system",

    category: "Database Stuff",

	init(DBB){
		DBB.database = {
			initdb: (con) => {
				DBB.database.con = con
			},
			con: undefined
		}
	},
	
    auto_execute: true,

    inputs: [
        {
            "id": "host",
            "name": "Host",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The host address of the SQL database.",
            "types": ["text", "unspecified"]
        },
		{
            "id": "port",
            "name": "Port",
            "description": "Acceptable Types: Number, Unspecified\n\nDescription: The port number for the SQL database connection. Defaults to '3306' if not specified. Ports under 1000 are reserved for root (Linux), so it is not recommended to use them.",
            "types": ["number", "unspecified"]
        },  
		{
            "id": "user",
            "name": "User",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The username to authenticate the SQL database connection.",
            "types": ["text", "unspecified"]
        },  
		{
            "id": "database",
            "name": "Database",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The name of the SQL database to connect to.",
            "types": ["text", "unspecified"]
        },
        {
            "id": "pwdinput",
            "name": "Password input",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The path of the file (e.g. \"E:\\myFolder\\data.json\").",
            "types": ["text", "unspecified"]
        }		
    ],

    options: [
        {
            "id": "password_input",
            "name": "Password Input",
            "description": "Description: The input type for the password",
            "type": "SELECT",
            "options": {
                "file": "File",
                "text": "Raw text"
            }
        }
],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        }
    ],

    async code(cache) {
		await this.require('mysql2');
		const mysql = require('mysql2/promise');
		const password_input = this.GetOptionValue("password_input", cache) + "";
  		const pwdinput = this.GetInputValue("pwdinput", cache) + "";
        	const fs = require("fs");
	if(password_input == "file") {
		const con = await mysql.createPool({
				host: this.GetInputValue("host", cache),
				port: this.GetInputValue("port", cache),
				user: this.GetInputValue("user", cache),
				password: fs.readFileSync(pwdinput, "utf8"),
				database: this.GetInputValue("database", cache),
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
		});
		this.getDBB().database.initdb(con)
        	this.RunNextBlock("action", cache); 
	}else{
		const con = await mysql.createPool({
				host: this.GetInputValue("host", cache),
				port: this.GetInputValue("port", cache),
				user: this.GetInputValue("user", cache),
				password: this.GetInputValue("pwdinput", cache),
				database: this.GetInputValue("database", cache),
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
		});
		this.getDBB().database.initdb(con)
        	this.RunNextBlock("action", cache); 
}		
   
    }
}