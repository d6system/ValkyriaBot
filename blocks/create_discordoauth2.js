module.exports = {
    name: "Create DiscordOAuth2",

    description: "Create a DiscordOAuth2 Object",

    category: "DiscordOAuth2",

    auto_execute: true,

    inputs: [],

    options: [
        {
            id: "client_secret",
            name: "Client Secret",
            description: "Type: Text\n\nDescription: The Client Secret of the Bot",
            type: "TEXT"
        },
        {
            id: "redirect_uri",
            name: "Redirect URI",
            description: "Type: Text\n\nDescription: The Redirect URI of the Bot",
            type: "TEXT"
        }
    ],

    outputs: [],

    async init(DBB, blockName) {
        const { readFileSync } = await DBB.Core.require("fs");
        const values = JSON.parse(readFileSync(DBB.File.paths.workspaces)).map((workspace) => {
            if (workspace.workspaces) {
                return workspace.workspaces.map((wpc) => wpc.blocks.filter((x) => x.name == blockName)).flat();
            } else {
                return workspace.blocks.filter((x) => x.name == blockName);
            }
        }).filter(x => x[0]).map(x => x.map(x => x.options).flat()).flat()[0];
        const crypto = require("crypto");
        const packageManager = require('./!auto_package_manager').getPackageManager();

        try {
            // Wait for package installation to complete before proceeding
            await packageManager?.requires({ name: "discord-oauth2", version: "latest" });
        } catch (e) {
            console.log("Failed to install dependencies! (Create DiscordOAuth2)");
            console.log(e);
            return; // Don't proceed if installation failed
        }
        const DiscordOauth2 = require("discord-oauth2");
        const fs = require("fs");
        const client_secret = values ? values.client_secret : "";
        const redirect_uri = values ? values.redirect_uri : "";
        
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

        const oauth = new DiscordOauth2({
            clientId: DBB.DiscordJS.client.user.id,
            client_secret: client_secret,
            redirect_uri: redirect_uri
        })

        DBB.Core.setDependency("DiscordOAuth2", blockName, () => {
            return oauth;
        })
        OAuth2Data.secret = client_secret;
        OAuth2Data.redirect = redirect_uri;

        fs.writeFileSync("data/DiscordOauth2.txt", JSON.stringify(encryptData(OAuth2Data)));
    }
}