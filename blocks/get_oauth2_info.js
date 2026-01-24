module.exports = {
    name: "Get OAuth2 Info",

    description: "Gets Info about the Authorization which the User used to Authorize the Bot",

    category: "DiscordOAuth2",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        },
        {
            "id": "req/user",
            "name": "Request/User",
            "description": "Type: Object\n\nDescription: If coming from the Express Event you can directly connect the Request Object, otherwise the User will work to get info",
            "types": ["object", "unspecified"],
            "required": true
        },
        {
            "id": "server",
            "name": "Server/ID",
            "description": "Type: Text\n\nDescription: The Server to either Add the Member to or get the Member from",
            "types": ["object", "text", "unspecified"]
        }
    ],

    options: [
        {
            id: "oauth2_info",
            name: "OAuth2 Info",
            description: "Type: SELECT\n\nDescription: The OAuth2 Info you want to get",
            type: "SELECT",
            options: /* {
                "authorized?": "Authorized? [BOOLEAN]",
                "userinfo": "User Info [OBJECT]",
                "userguilds": "User Guilds [LIST <Server>]",
                "userconnections": "User Connections [LIST <Connection>]",
                "getmember": "Get Member [PARTIAL <OBJECT>]",
                "joinserver": "Join Server [OBJECT?]",
                "server": "Server [TEXT <ID>]",
                "channel": "Channel [TEXT <ID>]",
                "message": "Message [TEXT <ID>]",
                "userid": "User ID [TEXT <ID>]",
                "redirect": "Redirect URI [TEXT <discord://>]"
            } */
                [
                    ["authorized?", "Authorized? [BOOLEAN]"],
                    {
                        type: "GROUP",
                        name: "Infos",
                        options: [
                            ["userinfo", "User Info [OBJECT]"],
                            ["userguilds", "User Guilds [LIST <Server>]"],
                            ["userconnections", "User Connections [LIST <Connection>]"],
                            ["getmember", "Get Member [PARTIAL <OBJECT>]"],
                            ["server", "Server [TEXT <ID>]"],
                            ["channel", "Channel [TEXT <ID>]"],
                            ["message", "Message [TEXT <ID>]"],
                            ["userid", "User ID [TEXT <ID>]"],
                            ["redirect", "Redirect URI [TEXT <discord://>"]
                        ]
                    },
                    {
                        type: "GROUP",
                        name: "Actions",
                        options: [
                            ["joinserver", "Join Server [OBJECT?]"]
                        ]
                    }
                ]
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
            "id": "info",
            "name": "Info",
            "description": "Type: Object\n\nDescription: The Info you requested",
            "types": ["unspecified", "object", "list", "text"]
        }
    ],

    async code(cache) {
        const { User } = require("discord.js");
        const fs = require("fs");
        const crypto = require('crypto')
        const DiscordOAuth2 = await this.getDependency("DiscordOAuth2", cache, false);
        const request = this.GetInputValue("req/user", cache);
        const info = this.GetOptionValue("oauth2_info", cache);
        const state = request.id ?? request.query.state;

        String.prototype.hexEncode = function () {
            var hex, i;

            var result = "";
            for (i = 0; i < this.length; i++) {
                hex = this.charCodeAt(i).toString(16);
                result += ("000" + hex).slice(-4);
            }

            return result
        }

        String.prototype.hexDecode = function () {
            var j;
            var hexes = this.match(/.{1,4}/g) || [];
            var back = "";
            for (j = 0; j < hexes.length; j++) {
                back += String.fromCharCode(parseInt(hexes[j], 16));
            }

            return back;
        }

        if (!DiscordOAuth2) {
            console.error("You need to create a DiscordOAuth2 Object first!");
            return;
        }
        const temp = this;

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

        if (!fs.existsSync("data/DiscordOauth2.txt")) fs.writeFileSync("data/DiscordOauth2.txt", JSON.stringify(encryptData({})));
        let OAuth2Data = decryptData(JSON.parse(fs.readFileSync("data/DiscordOauth2.txt")));

        if (OAuth2Data.saves && OAuth2Data.saves[request.id ? state : state?.hexDecode()]) {
            if (OAuth2Data.saves[request.id ? state : state?.hexDecode()]?.data) {
                DiscordOAuth2.tokenRequest({
                    clientId: this.client.user.id,
                    clientSecret: OAuth2Data.secret,

                    refreshToken: OAuth2Data.saves[request.id ? state : state?.hexDecode()]?.data.refresh_token,
                    grantType: "refresh_token",
                    scopes: OAuth2Data.scopes || ["identify"],

                    redirectUri: OAuth2Data.redirect
                }).then(async (data) => {
                    OAuth2Data.saves[request.id ? state : state?.hexDecode()].data = data;
                    fs.writeFileSync("data/DiscordOauth2.txt", JSON.stringify(encryptData(OAuth2Data)));
                    nowinfo()
                }).catch((err) => {
                    //console.error(1, err)
                    temp.StoreOutputValue(null, "info", cache);
                    temp.RunNextBlock("action", cache);
                    return;
                })
            } else {
                DiscordOAuth2.tokenRequest({
                    clientId: this.client.user.id,
                    clientSecret: OAuth2Data.secret,

                    code: typeof request === "object" ? request.id ? request.id : request?.query?.code : request,
                    grantType: "authorization_code",
                    scopes: OAuth2Data.scopes || ["identify"],

                    redirectUri: OAuth2Data.redirect
                }).then(async (data) => {
                    OAuth2Data.saves[request.id ? state : state.hexDecode()].data = data;
                    fs.writeFileSync("data/DiscordOauth2.txt", JSON.stringify(encryptData(OAuth2Data)));
                    nowinfo()
                }).catch((err) => {
                    //console.error(2, err)
                    temp.StoreOutputValue(null, "info", cache);
                    temp.RunNextBlock("action", cache);
                    return;
                })
            }
        } else {
            if (request instanceof User) return nowinfo();
            DiscordOAuth2.tokenRequest({
                clientId: this.client.user.id,
                clientSecret: OAuth2Data.secret,

                code: typeof request === "object" ? request.query.code : request,
                grantType: "authorization_code",
                scopes: OAuth2Data.scopes || ["identify"],

                redirectUri: OAuth2Data.redirect
            }).then(async (data) => {
                OAuth2Data.saves[request.id ? state : state.hexDecode()].data = data;
                fs.writeFileSync("data/DiscordOauth2.txt", JSON.stringify(encryptData(OAuth2Data)));
                nowinfo()
            }).catch((err) => {
                //console.error(3, err)
                temp.StoreOutputValue(null, "info", cache);
                temp.RunNextBlock("action", cache);
                return;
            })
        }

        function nowinfo() {
            if (!OAuth2Data.saves || !OAuth2Data.saves[request.id ? state : state.hexDecode()]) {
                temp.StoreOutputValue(false, "info", cache);
                temp.RunNextBlock("action", cache);
                return;
            }
            switch (info) {
                case "authorized?":
                    temp.StoreOutputValue((OAuth2Data.saves[request.id ? state : state.hexDecode()] && OAuth2Data.saves[request.id ? state : state.hexDecode()].data) ? true : false, "info", cache);
                    temp.RunNextBlock("action", cache);
                    break;
                case "userinfo":
                    DiscordOAuth2.getUser(OAuth2Data.saves[request.id ? state : state.hexDecode()].data.access_token).then((user) => {
                        temp.StoreOutputValue(user, "info", cache);
                        temp.RunNextBlock("action", cache);
                    }).catch((err) => {
                        temp.StoreOutputValue(err.message, "info", cache);
                        temp.RunNextBlock("action", cache);
                    })
                    break;
                case "userguilds":
                    DiscordOAuth2.getUserGuilds(OAuth2Data.saves[request.id ? state : state.hexDecode()].data.access_token).then((guilds) => {
                        temp.StoreOutputValue(guilds, "info", cache);
                        temp.RunNextBlock("action", cache);
                    }).catch((err) => {
                        temp.StoreOutputValue(err.message, "info", cache);
                        temp.RunNextBlock("action", cache);
                    })
                    break;
                case "userconnections":
                    DiscordOAuth2.getUserConnections(OAuth2Data.saves[request.id ? state : state.hexDecode()].data.access_token).then((connections) => {
                        temp.StoreOutputValue(connections, "info", cache);
                        temp.RunNextBlock("action", cache);
                    }).catch((err) => {
                        temp.StoreOutputValue(err.message, "info", cache);
                        temp.RunNextBlock("action", cache);
                    })
                    break;
                case "getmember":
                    let s1 = temp.GetInputValue("server", cache);
                    if (!s1) {
                        console.error("Server is not provided!");
                        return;
                    }
                    if (typeof s1 === "object") s1 = s1.id;
                    DiscordOAuth2.getGuildMember(OAuth2Data.saves[request.id ? state : state.hexDecode()].data.access_token, s1).then((member) => {
                        temp.StoreOutputValue(member, "info", cache);
                        temp.RunNextBlock("action", cache);
                    }).catch((err) => {
                        temp.StoreOutputValue(err.message, "info", cache);
                        temp.RunNextBlock("action", cache);
                    })
                    break;
                case "joinserver":
                    let s2 = temp.GetInputValue("server", cache);
                    if (!s2) {
                        console.error("Server is not provided!");
                        return;
                    }
                    if (typeof s2 === "object") s2 = s2.id;
                    DiscordOAuth2.addMember({
                        accessToken: OAuth2Data.saves[request.id ? state : state.hexDecode()].data.access_token,
                        botToken: temp.getDBB().Data.token,
                        guildId: s2,
                        userId: request.id ? state : state.hexDecode(),
                        deaf: false,
                        mute: false
                    }).then((smth) => {
                        temp.StoreOutputValue(smth, "info", cache);
                        temp.RunNextBlock("action", cache);
                    }).catch((err) => {
                        temp.StoreOutputValue(err.message, "info", cache);
                        temp.RunNextBlock("action", cache);
                    })
                    break;
                case "server":
                    temp.StoreOutputValue(OAuth2Data.saves[request.id ? state : state.hexDecode()].server, "info", cache);
                    temp.RunNextBlock("action", cache);
                    break;
                case "channel":
                    temp.StoreOutputValue(OAuth2Data.saves[request.id ? state : state.hexDecode()].channel, "info", cache);
                    temp.RunNextBlock("action", cache);
                    break;
                case "message":
                    temp.StoreOutputValue(OAuth2Data.saves[request.id ? state : state.hexDecode()].message, "info", cache);
                    temp.RunNextBlock("action", cache);
                    break;
                case "userid":
                    temp.StoreOutputValue(request.id ? state : state.hexDecode(), "info", cache);
                    temp.RunNextBlock("action", cache);
                    break;
                case "redirect":
                    let s = OAuth2Data.saves[request.id ? state : state.hexDecode()].server;
                    let c = OAuth2Data.saves[request.id ? state : state.hexDecode()].channel;
                    temp.StoreOutputValue((s !== null && c !== null) ? `discord://-/channels/${s}/${c}` : (s !== null) ? `discord://-/guilds/${s}` : "discord://", "info", cache);
                    temp.RunNextBlock("action", cache);
                    break;
            }
        }
    }
}