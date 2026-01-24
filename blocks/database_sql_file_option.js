module.exports = {
    name: "Database SQL File Option",

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

    inputs: [],

    options: [
	        {
            id: "host",
            name: "Host",
            description: "The host address of the SQL database.",
            type: "TEXT"
        },
		        {
            id: "port",
            name: "Port",
            description: "The port number for the SQL database connection. Defaults to '3306' if not specified. Ports under 1000 are reserved for root (Linux), so it is not recommended to use them.",
            type: "TEXT"
        },
		        {
            id: "user",
            name: "User",
            description: "The username to authenticate the SQL database connection.",
            type: "TEXT"
        },
		        {
            id: "password",
            name: "Password",
            description: "The password to authenticate the SQL database connection.",
            type: "TEXT"
        },
		        {
            id: "database",
            name: "Database",
            description: "The name of the SQL database to connect to.",
            type: "TEXT"
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
		const hostinput = this.GetOptionValue("host", cache) + "";
		const portinput = this.GetOptionValue("port", cache) + "";
		const userinput = this.GetOptionValue("user", cache) + "";
		const pwdinput = this.GetOptionValue("password", cache) + "";
  		const dbinput = this.GetOptionValue("database", cache) + "";
        const fs = require("fs");

		const con = await mysql.createPool({
				host: fs.readFileSync(hostinput, "utf8"),
				port: fs.readFileSync(portinput, "utf8"),
				user: fs.readFileSync(userinput, "utf8"),
				password: fs.readFileSync(pwdinput, "utf8"),
				database: fs.readFileSync(dbinput, "utf8"),
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
		});
		this.getDBB().database.initdb(con)
        this.RunNextBlock("action", cache); 	
   
    }
}