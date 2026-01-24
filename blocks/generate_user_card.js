module.exports = {
    name: "Generate User Card",

    description: "Creates a user profile card image.",

    category: "Extras",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "username",
            "name": "Username",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The username to display on the card.",
            "types": ["text", "unspecified"]
        },
        {
            "id": "biography",
            "name": "Biography",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The user biography to display.",
            "types": ["text", "unspecified"]
        },
        {
            "id": "roles",
            "name": "Roles",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The roles to display on the card.",
            "types": ["text", "unspecified"]
        },
        {
            "id": "level",
            "name": "Level",
            "description": "Acceptable Types: Number, Unspecified\n\nDescription: The level to display on the card.",
            "types": ["number", "unspecified"]
        },
        {
            "id": "currentXP",
            "name": "Current XP",
            "description": "Acceptable Types: Number, Unspecified\n\nDescription: The current XP amount.",
            "types": ["number", "unspecified"]
        },
        {
            "id": "totalXP",
            "name": "Total XP",
            "description": "Acceptable Types: Number, Unspecified\n\nDescription: The total XP amount needed for next level.",
            "types": ["number", "unspecified"]
        },
        {
            "id": "avatarUrl",
            "name": "Avatar URL",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: URL to the user's avatar image.",
            "types": ["text", "unspecified"]
        },
        {
            "id": "bannerUrl",
            "name": "Banner URL",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: URL to the user's banner image.",
            "types": ["text", "unspecified"]
        }
    ],

    options: [
        {
            "id": "width",
            "name": "Width",
            "description": "Description: The width of the generated card.",
            "type": "NUMBER",
            "defaultValue": 400
        },
        {
            "id": "height",
            "name": "Height",
            "description": "Description: The height of the generated card.",
            "type": "NUMBER",
            "defaultValue": 500
        },
        {
            "id": "format",
            "name": "Format",
            "description": "Description: The format of the generated image.",
            "type": "SELECT",
            "options": {
                "png": "PNG",
                "jpg": "JPG"
            },
            "defaultValue": "png"
        },
        {
            "id": "quality",
            "name": "Quality",
            "description": "Description: The quality of the JPG image (0.1-1.0).",
            "type": "NUMBER",
            "defaultValue": 0.9
        },
        {
            "id": "fontFamily",
            "name": "Font Family",
            "description": "Description: The font family to use on the card.",
            "type": "TEXT",
            "defaultValue": "Arial, sans-serif"
        },
        {
            "id": "debug",
            "name": "Debug Mode",
            "description": "Description: Enable debug logging.",
            "type": "CHECKBOX"
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
            "id": "image",
            "name": "Image",
            "description": "Type: Object\n\nDescription: The generated user card image.",
            "types": ["object"]
        }
    ],

    async code(cache) {
        const username = this.GetInputValue("username", cache) || 'Username';
        const biography = this.GetInputValue("biography", cache) || 'Hello! How are you doing today?';
        const roles = this.GetInputValue("roles", cache) || 'Role 1, Role 2, Role 3';
        const level = this.GetInputValue("level", cache) || 100;
        const currentXP = this.GetInputValue("currentXP", cache) || 500;
        const totalXP = this.GetInputValue("totalXP", cache) || 1000;
        const avatarUrl = this.GetInputValue("avatarUrl", cache) || null;
        const bannerUrl = this.GetInputValue("bannerUrl", cache) || null;

        const width = this.GetOptionValue("width", cache);
        const height = this.GetOptionValue("height", cache);
        const format = this.GetOptionValue("format", cache);
        const quality = this.GetOptionValue("quality", cache);
        const fontFamily = this.GetOptionValue("fontFamily", cache);
        const debug = Boolean(this.GetOptionValue("debug", cache));


        const { execSync } = require('child_process');

        try {
            const { createCanvas, loadImage } = require('canvas');
            const fetch = require('node-fetch');
            
            function isWebPUrl(url) {
                if (!url) return false;
                return url.toLowerCase().endsWith('.webp') || url.toLowerCase().includes('.webp?');
            }
            
            async function loadWebPImage(url) {
                if (debug) console.log("Loading WebP image:", url);
                
                try {
                    let sharp;
                    try {
                        sharp = require('sharp');
                    } catch (error) {
                        if (debug) console.log("Installing sharp package for WebP conversion...");
                        execSync('npm install sharp', { stdio: 'inherit' });
                        sharp = require('sharp');
                    }
                    
                    const response = await fetch(url);
                    if (!response.ok) throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
                    
                    const buffer = await response.buffer();
                    
                    const pngBuffer = await sharp(buffer).png().toBuffer();
                    
                    const image = await loadImage(pngBuffer);
                    return image;
                } catch (error) {
                    console.error("Error processing WebP image:", error);
                    throw error;
                }
            }
            
            const canvas = createCanvas(width, height);
            const ctx = canvas.getContext('2d');
            
            ctx.fillStyle = '#1e2129';
            ctx.fillRect(0, 0, width, height);
            
            ctx.fillStyle = '#2a2e3a';
            roundedRect(ctx, 20, 20, width - 40, height - 40, 16);
            ctx.fill();
            
            const defaultAvatar = createDefaultAvatar(createCanvas);
            const defaultBanner = createDefaultBanner(createCanvas);
            
            let avatar, banner;
            
            try {
                if (avatarUrl) {
                    if (isWebPUrl(avatarUrl)) {
                        avatar = await loadWebPImage(avatarUrl);
                    } else {
                        avatar = await loadImage(avatarUrl);
                    }
                } else {
                    avatar = await loadImage(defaultAvatar);
                }
            } catch (error) {
                console.log("Error loading avatar:", error);
                avatar = await loadImage(defaultAvatar);
            }
            
            try {
                if (bannerUrl) {
                    if (isWebPUrl(bannerUrl)) {
                        banner = await loadWebPImage(bannerUrl);
                    } else {
                        banner = await loadImage(bannerUrl);
                    }
                } else {
                    banner = await loadImage(defaultBanner);
                }
            } catch (error) {
                console.log("Error loading banner:", error);
                banner = await loadImage(defaultBanner);
            }
            
            ctx.drawImage(banner, 20, 20, width - 40, 100);
            
            const gradient = ctx.createLinearGradient(0, 100, 0, 130);
            gradient.addColorStop(0, 'rgba(42, 46, 58, 0)');
            gradient.addColorStop(1, 'rgba(42, 46, 58, 1)');
            ctx.fillStyle = gradient;
            ctx.fillRect(20, 100, width - 40, 30);
            
            ctx.save();
            ctx.beginPath();
            roundedRect(ctx, 40, 85, 80, 80, 16);
            ctx.clip();
            ctx.drawImage(avatar, 40, 85, 80, 80);
            ctx.restore();
            
            ctx.strokeStyle = '#2a2e3a';
            ctx.lineWidth = 4;
            roundedRect(ctx, 40, 85, 80, 80, 16);
            ctx.stroke();
            
            ctx.font = `14px ${fontFamily}`;
            const usernameWidth = ctx.measureText(username).width;
            
            ctx.fillStyle = 'rgba(47, 51, 61, 0.8)';
            roundedRect(ctx, 40, 140, usernameWidth + 20, 24, 4);
            ctx.fill();
            
            ctx.fillStyle = '#ffffff';
            ctx.fillText(username, 50, 156);
            
            const bioX = 40;
            const bioY = 190;
            
            ctx.fillStyle = '#a0a0a0';
            ctx.font = `bold 12px ${fontFamily}`;
            ctx.fillText('BIOGRAPHY', bioX, bioY);
            
            ctx.fillStyle = 'rgba(47, 51, 61, 0.8)';
            roundedRect(ctx, bioX, bioY + 10, 150, 80, 8);
            ctx.fill();
            
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 1;
            roundedRect(ctx, bioX, bioY + 10, 150, 80, 8);
            ctx.stroke();
            
            ctx.fillStyle = '#d0d0d0';
            ctx.font = `12px ${fontFamily}`;
            
            wrapText(ctx, biography, bioX + 10, bioY + 30, 130, 16);
            
            const rolesX = 210;
            const rolesY = 190;
            
            ctx.fillStyle = '#a0a0a0';
            ctx.font = `bold 12px ${fontFamily}`;
            ctx.fillText('ROLES', rolesX, rolesY);
            
            ctx.fillStyle = 'rgba(47, 51, 61, 0.8)';
            roundedRect(ctx, rolesX, rolesY + 10, 150, 80, 8);
            ctx.fill();
            
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 1;
            roundedRect(ctx, rolesX, rolesY + 10, 150, 80, 8);
            ctx.stroke();
            
            ctx.fillStyle = '#d0d0d0';
            ctx.font = `12px ${fontFamily}`;
            
            wrapText(ctx, roles, rolesX + 10, rolesY + 30, 130, 16);
            
            const levelX = 40;
            const levelY = 300;
            
            ctx.fillStyle = '#a0a0a0';
            ctx.font = `bold 12px ${fontFamily}`;
            ctx.fillText('LEVEL', levelX, levelY);
            
            ctx.fillStyle = 'rgba(47, 51, 61, 0.8)';
            roundedRect(ctx, levelX, levelY + 10, 240, 20, 10);
            ctx.fill();
            
            const progressWidth = (currentXP / totalXP) * 240;
            
            let progressGradient;
            if (level >= 100) {
                progressGradient = ctx.createLinearGradient(levelX, 0, levelX + progressWidth, 0);
                progressGradient.addColorStop(0, '#FFD700');
                progressGradient.addColorStop(1, '#FFA500');
            } else if (level >= 50) {
                progressGradient = ctx.createLinearGradient(levelX, 0, levelX + progressWidth, 0);
                progressGradient.addColorStop(0, '#9C27B0');
                progressGradient.addColorStop(1, '#673AB7');
            } else {
                progressGradient = ctx.createLinearGradient(levelX, 0, levelX + progressWidth, 0);
                progressGradient.addColorStop(0, '#2196F3');
                progressGradient.addColorStop(1, '#03A9F4');
            }
            
            ctx.fillStyle = progressGradient;
            if (progressWidth > 0) {
                roundedRect(ctx, levelX, levelY + 10, progressWidth, 20, 10);
                ctx.fill();
            }
            
            ctx.fillStyle = '#ffffff';
            ctx.font = `bold 14px ${fontFamily}`;
            ctx.textAlign = 'right';
            ctx.fillText(`Level ${level}`, levelX + 320, levelY + 15);
            
            ctx.fillStyle = '#a0a0a0';
            ctx.font = `12px ${fontFamily}`;
            ctx.fillText(`${currentXP}/${totalXP} XP`, levelX + 320, levelY + 30);
            
            ctx.textAlign = 'left';
            
            function roundedRect(ctx, x, y, width, height, radius) {
                ctx.beginPath();
                ctx.moveTo(x + radius, y);
                ctx.lineTo(x + width - radius, y);
                ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
                ctx.lineTo(x + width, y + height - radius);
                ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                ctx.lineTo(x + radius, y + height);
                ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
                ctx.lineTo(x, y + radius);
                ctx.quadraticCurveTo(x, y, x + radius, y);
                ctx.closePath();
            }
            
            function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
                if (!text || text.trim() === '') {
                    return 0;
                }
                
                const words = text.split(' ');
                let line = '';
                let lines = [];
                let testWidth;
                
                for (let i = 0; i < words.length; i++) {
                    const word = words[i];
                    const testLine = line + (line ? ' ' : '') + word;
                    testWidth = ctx.measureText(testLine).width;
                    
                    if (testWidth <= maxWidth) {
                        line = testLine;
                        continue;
                    }
                    
                    const singleWordWidth = ctx.measureText(word).width;
                    if (line === '' && singleWordWidth > maxWidth) {
                        let currentPart = '';
                        let remainingWord = word;
                        
                        while (remainingWord.length > 0) {
                            let charIndex = 0;
                            let partFits = false;
                            
                            while (charIndex <= remainingWord.length) {
                                const testPart = currentPart + remainingWord.substring(0, charIndex);
                                const testPartWidth = ctx.measureText(testPart).width;
                                
                                if (testPartWidth > maxWidth) {
                                    break;
                                }
                                
                                charIndex++;
                                partFits = true;
                            }
                            
                            if (!partFits && currentPart === '') {
                                charIndex = 1;
                            } else {
                                charIndex = Math.max(1, charIndex - 1);
                            }
                            
                            let partToAdd = remainingWord.substring(0, charIndex);
                            if (charIndex < remainingWord.length) {
                                const withHyphen = partToAdd + '-';
                                if (ctx.measureText(currentPart + withHyphen).width <= maxWidth) {
                                    partToAdd = withHyphen;
                                }
                            }
                            
                            if (currentPart === '') {
                                lines.push(partToAdd);
                            } else {
                                lines.push(currentPart + partToAdd);
                            }
                            
                            remainingWord = remainingWord.substring(charIndex);
                            currentPart = '';
                        }
                    } else {
                        if (line !== '') {
                            lines.push(line);
                        }
                        line = word;
                    }
                }
                
                if (line) {
                    lines.push(line);
                }
                
                for (let i = 0; i < lines.length; i++) {
                    if (y !== undefined) {
                        ctx.fillText(lines[i], x, y + (i * lineHeight));
                    }
                    
                    if (i >= 4) {
                        if (i < lines.length - 1 && y !== undefined) {
                            const lastVisibleLine = lines[i];
                            const withEllipsis = addEllipsis(ctx, lastVisibleLine, maxWidth);
                            
                            ctx.clearRect(x - 2, y + (i * lineHeight) - lineHeight + 2, maxWidth + 4, lineHeight);
                            ctx.fillText(withEllipsis, x, y + (i * lineHeight));
                        }
                        break;
                    }
                }
                
                return Math.min(lines.length, 5);
            }
            
            function addEllipsis(ctx, text, maxWidth) {
                const ellipsis = '...';
                const ellipsisWidth = ctx.measureText(ellipsis).width;
                
                let width = ctx.measureText(text).width;
                if (width <= maxWidth) {
                    return text;
                }
                
                let newText = text;
                while (width + ellipsisWidth > maxWidth && newText.length > 0) {
                    newText = newText.slice(0, -1);
                    width = ctx.measureText(newText).width;
                }
                
                return newText + ellipsis;
            }
            
            function createDefaultAvatar(createCanvas) {
                const canvas = createCanvas(200, 200);
                const ctx = canvas.getContext('2d');
                
                const gradient = ctx.createLinearGradient(0, 0, 200, 200);
                gradient.addColorStop(0, '#5755d9');
                gradient.addColorStop(1, '#3633a3');
                
                ctx.fillStyle = gradient;
                roundedRect(ctx, 0, 0, 200, 200, 40);
                ctx.fill();
                
                ctx.fillStyle = 'white';
                ctx.font = 'bold 80px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                return canvas.toDataURL('image/png');
            }
            
            function createDefaultBanner(createCanvas) {
                const canvas = createCanvas(400, 150);
                const ctx = canvas.getContext('2d');
                
                const gradient = ctx.createLinearGradient(0, 0, 400, 150);
                gradient.addColorStop(0, '#2c3e50');
                gradient.addColorStop(1, '#1a2533');
                
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 400, 150);
                
                ctx.strokeStyle = 'rgba(255,255,255,0.07)';
                ctx.lineWidth = 1;
                
                for (let y = 0; y < 150; y += 20) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(400, y);
                    ctx.stroke();
                }
                
                for (let x = 0; x < 400; x += 40) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, 150);
                    ctx.stroke();
                }
                
                ctx.fillStyle = 'rgba(255,255,255,0.04)';
                for (let x = 10; x < 400; x += 20) {
                    for (let y = 10; y < 150; y += 20) {
                        ctx.beginPath();
                        ctx.arc(x, y, 2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                
                ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                ctx.beginPath();
                ctx.moveTo(0, 150);
                
                ctx.bezierCurveTo(130, 100, 270, 100, 400, 150);
                ctx.stroke();
                
                return canvas.toDataURL('image/png');
            }
            
            const buffer = canvas.toBuffer(`image/${format}`, { quality });
            
            const { AttachmentBuilder } = require('discord.js');
            const attachment = new AttachmentBuilder(buffer, { name: `user-card.${format}` });
            
            this.StoreOutputValue(attachment, "image", cache);
            this.RunNextBlock("action", cache);
        } catch (error) {
            console.error("Error generating user card:", error);
            
            if (error.code === 'MODULE_NOT_FOUND') {
                if (error.message.includes('canvas')) {
                    console.error("The canvas package is not installed. Installing...");
                    execSync(`npm install canvas`, { stdio: 'inherit' });
                } else if (error.message.includes('node-fetch')) {
                    console.error("The node-fetch package is not installed. Installing...");
                    execSync(`npm install node-fetch@2`, { stdio: 'inherit' });
                }
            }
            
            this.RunNextBlock("action", cache);
        }
    }
};