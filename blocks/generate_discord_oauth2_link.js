module.exports = {
    name: "Generate Discord OAuth2 Link",

    description: "Generate a Discord OAuth2 Link for a User to Authorize the Bot",

    category: "DiscordOAuth2",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        },
        {
            "id": "user",
            "name": "User",
            "description": "Type: Object\n\nDescription: The User Object of the User you want to authorize",
            "types": ["object", "unspecified"],
            "required": true
        },
        {
            "id": "server",
            "name": "Server",
            "description": "Type: Object\n\nDescription: The Server Object of the Server you want to authorize the Bot in",
            "types": ["object", "unspecified"],
            "required": false
        },
        {
            "id": "channel",
            "name": "Channel",
            "description": "Type: Object\n\nDescription: The Channel Object of the Channel you want to authorize the Bot in",
            "types": ["object", "unspecified"],
            "required": false
        },
        {
            "id": "message",
            "name": "Message",
            "description": "Type: Object\n\nDescription: The Message Object of the Message you want to authorize the Bot in",
            "types": ["object", "unspecified"]
        }
    ],

    options: [
        {
            id: "identify",
            name: "Identify Scope",
            description: "Type: CHECKBOX\n\nDescription: If the 'identify' scope should be added to the OAuth2 Link",
            type: "CHECKBOX"
        },
        {
            id: "email",
            name: "Email Scope",
            description: "Type: CHECKBOX\n\nDescription: If the 'email' scope should be added to the OAuth2 Link",
            type: "CHECKBOX"
        },
        {
            id: "connections",
            name: "Connections Scope",
            description: "Type: CHECKBOX\n\nDescription: If the 'connections' scope should be added to the OAuth2 Link",
            type: "CHECKBOX"
        },
        {
            id: "guilds",
            name: "Guilds Scope",
            description: "Type: CHECKBOX\n\nDescription: If the 'guilds' scope should be added to the OAuth2 Link",
            type: "CHECKBOX"
        },
        {
            id: "guilds_join",
            name: "Guilds Join Scope",
            description: "Type: CHECKBOX\n\nDescription: If the 'guilds.join' scope should be added to the OAuth2 Link",
            type: "CHECKBOX"
        },
        {
            id: "guilds_member_read",
            name: "Guild Members Read Scope",
            description: "Type: CHECKBOX\n\nDescription: If the 'guilds.members.read' scope should be added to the OAuth2 Link",
            type: "CHECKBOX"
        }
    ],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        },
        {
            "id": "url",
            "name": "OAuth2 URL",
            "description": "The URL the user has to click on to authorize the bot",
            "types": ["text", "unspecified"]
        }
    ],

    async code(cache) {
        const fs = require("fs");
        const crypto = require('crypto')
        const DiscordOAuth2 = await this.getDependency("DiscordOAuth2", cache, false);
        const user = this.GetInputValue("user", cache);

        const scopes = [];
        if(this.GetOptionValue("identify", cache)) scopes.push("identify");
        if(this.GetOptionValue("email", cache)) scopes.push("email");
        if(this.GetOptionValue("connections", cache)) scopes.push("connections");
        if(this.GetOptionValue("guilds", cache)) scopes.push("guilds");
        if(this.GetOptionValue("guilds_join", cache)) scopes.push("guilds.join");
        if(this.GetOptionValue("guilds_member_read", cache)) scopes.push("guilds.members.read");

        if(scopes.length === 0) scopes.push("identify");

        String.prototype.hexEncode = function(){
            var hex, i;
        
            var result = "";
            for (i=0; i<this.length; i++) {
                hex = this.charCodeAt(i).toString(16);
                result += ("000"+hex).slice(-4);
            }
        
            return result
        }

        String.prototype.hexDecode = function(){
            var j;
            var hexes = this.match(/.{1,4}/g) || [];
            var back = "";
            for(j = 0; j<hexes.length; j++) {
                back += String.fromCharCode(parseInt(hexes[j], 16));
            }
        
            return back;
        }

        const url = DiscordOAuth2.generateAuthUrl({
            scope: scopes,
            state: user.id.hexEncode(),
        });

        function generateKeyPair() {
            const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 2048,
            });
            fs.writeFileSync('data/privatekey.txt', privateKey.export({ type: 'pkcs1', format: 'pem' }));
            return publicKey;
        }
        
        function encryptData(jsonObject) {
            let privateKey;
        
            if (!fs.existsSync('data/privatekey.txt')) {
                const publicKey = generateKeyPair();
                return encryptWithPublicKey(publicKey, jsonObject);
            } else {
                privateKey = fs.readFileSync('data/privatekey.txt', 'utf8');
                const publicKey = crypto.createPublicKey(privateKey);
                return encryptWithPublicKey(publicKey, jsonObject);
            }
        }
        
        function encryptWithPublicKey(publicKey, jsonObject) {
            const jsonString = JSON.stringify(jsonObject);
            const symmetricKey = crypto.randomBytes(32);
            const iv = crypto.randomBytes(16);
        
            const aesCipher = crypto.createCipheriv('aes-256-cbc', symmetricKey, iv);
            let encryptedData = aesCipher.update(jsonString, 'utf8', 'base64');
            encryptedData += aesCipher.final('base64');
        
            const encryptedSymmetricKey = crypto.publicEncrypt(
                {
                    key: publicKey,
                    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                    oaepHash: 'sha256',
                },
                symmetricKey
            );
        
            return {
                encryptedData,
                encryptedSymmetricKey: encryptedSymmetricKey.toString('base64'),
                iv: iv.toString('base64'),
            };
        }
        
        function decryptData(encryptedPackage) {
            const privateKey = fs.readFileSync('data/privatekey.txt', 'utf8');
        
            let symmetricKey;
            try {
                symmetricKey = crypto.privateDecrypt(
                    {
                        key: privateKey,
                        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                        oaepHash: 'sha256',
                    },
                    Buffer.from(encryptedPackage.encryptedSymmetricKey, 'base64')
                );
            } catch (err) {
                return null;
            }
        
            try {
                const aesDecipher = crypto.createDecipheriv(
                    'aes-256-cbc',
                    symmetricKey,
                    Buffer.from(encryptedPackage.iv, 'base64')
                );
                let decryptedData = aesDecipher.update(encryptedPackage.encryptedData, 'base64', 'utf8');
                decryptedData += aesDecipher.final('utf8');
                return JSON.parse(decryptedData);
            } catch (err) {
                return null;
            }
        }

        if(!fs.existsSync("data/DiscordOauth2.txt")) fs.writeFileSync("data/DiscordOauth2.txt", JSON.stringify(encryptData({})));
        let OAuth2Data = decryptData(JSON.parse(fs.readFileSync("data/DiscordOauth2.txt")));

        OAuth2Data.scopes = scopes;
        if(!OAuth2Data.saves) OAuth2Data.saves = {};
        OAuth2Data.saves[user.id] = {
            user: user.id,
            server: this.GetInputValue("server", cache) ? this.GetInputValue("server", cache).id : null,
            channel: this.GetInputValue("channel", cache) ? this.GetInputValue("channel", cache).id : null,
            message: this.GetInputValue("message", cache) ? this.GetInputValue("message", cache).id : null
        }

        fs.writeFileSync("data/DiscordOauth2.txt", JSON.stringify(encryptData(OAuth2Data)));

        this.StoreOutputValue(url, "url", cache);
        this.RunNextBlock("action", cache);
    }
}