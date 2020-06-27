'use strict';

const Discord = require('discord.js');
const envKeys = require('.env');
const bot = new Discord.Client();
const fetch = require("node-fetch");
const prefix = '.';
const token = envKeys.BOT_TOKEN;
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const keys = require('./keys.json');
const { send } = require('process');
const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets.readonly']
);
let commands = [];
let ownerAvatarUrl;
let json;
let pastebinUrl = "https://pastebin.com/eeCideBi";

(async () => {
    let response = await fetch("https://discord.com/api/users/124501230369243136", { headers: {"Authorization": "Bot " + envKeys.BOT_TOKEN} });
    json = await response.json();
})();

client.authorize(function(err,tokens){
    if(err){
        console.log(err);
        return;
    } else {
        console.log('Connected');
        gsrun(client);
    }
});

async function gsrun(cl){
    const gsapi = google.sheets({version:'v4', auth: cl});
    const opt = {
        spreadsheetId: envKeys.SPREADSHEET_ID,
        range: 'Switches!H2:H'
    };
    let data = await gsapi.spreadsheets.values.get(opt);
    commands = data.data.values;
}

bot.on('ready', () => {
    ownerAvatarUrl = "https://cdn.discordapp.com/avatars/124501230369243136/" + json.avatar + ".gif";
    console.log(`${bot.user.tag} successfully logged in!`)
    bot.user.setActivity('keyboard sounds', ({type: "LISTENING"}))
})

bot.on('message', message => {
    let msg = message;
    if(msg.content === `${prefix}info`){
        sendInfoEmbed(msg);
    }
    else if(msg.content === `${prefix}lube`){
        sendLubeEmbed(msg);
    }
    else if(msg.content === `${prefix}preference`){
        msg.channel.send("Ding dong your switch preference is wrong.");
    }
    else if(msg.content === `${prefix}changelog`){
        sendChangelogEmbed(msg);
    }
    else if(msg.content === `${prefix}via`){
        sendViaEmbed(msg);
    }
    else if(msg.content === `${prefix}qmk`){
        sendQmkEmbed(msg);
    }
    else if(msg.content === `${prefix}help`){
        sendHelpEmbed(msg);
    }
    else if(msg.content === `${prefix}switches`){
        let stringSwitch;
        let allSwitches = new Discord.MessageEmbed()
            .setColor('#2df8fc')
            .setTitle('All Switches In The Bot')
            .setThumbnail('https://i.imgur.com/T5GStPs.jpg')
            .setTimestamp()
            .addField("List of Switches", pastebinUrl, true)
            .setFooter('Bot by Nova#8400', ownerAvatarUrl);
            msg.channel.send(allSwitches);
    }
    else if (msg.content.charAt(0) === `${prefix}`){
        let command = msg.content.substr(1);
        command = command.toLowerCase();
        let row;
        for (let i = 0; i < commands.length; i++){
            let regCheck = new RegExp(commands[i]);
            let checkedSwitch = regCheck.test(command);
            if (checkedSwitch == true){
                row = i + 2;
                getswitchinfo(client, row, msg);
                i = commands.length;
            }
        }
    }
})

async function getswitchinfo(cl, row, msg){
    const gsapi = google.sheets({version:'v4', auth: cl});
    const opt = {
        spreadsheetId: envKeys.SPREADSHEET_ID,
        range: `Switches!A${row}:I${row}`
    };
    let data = await gsapi.spreadsheets.values.get(opt);
    let switchreturn = data.data.values.toString();
    let switchinfo = switchreturn.split(",");
    let switchName = switchinfo[0] + " " + switchinfo[1];

    let switchEmbed = new Discord.MessageEmbed()
        .setColor('#2df8fc')
        .setTitle(switchName)
        .setDescription('Some information might be missing due to it being unavailable.')
        .setThumbnail(switchinfo[8])
        .addField('Switch', switchName, true)
        .addField('Type', switchinfo[2], true)
        .addField('Actuation Force', switchinfo[3] + "g", true)
        .addField('Bottom Out Force', switchinfo[4] + "g", true)
        .addField('Actuation Point', switchinfo[5] + "mm", true)
        .addField('Travel Distance', switchinfo[6] + "mm", true)
        .setTimestamp()
        .setFooter('Bot by Nova#8400', ownerAvatarUrl);

    msg.channel.send(switchEmbed);
}

async function sendChangelogEmbed(msg){
    let changelogEmbed = new Discord.MessageEmbed()
        .setColor('#2df8fc')
        .setTitle('Switchbot Changelog v1.4')
        .addField('Changes', '- Added user intuivity\n- Bug fixes', true)
        .addField('User intuivity?', 'Try using .mxreds and .cherryred', true)
        .setTimestamp()
        .setFooter('Bot by Nova#8400', ownerAvatarUrl);
    msg.channel.send(changelogEmbed);
}

async function sendInfoEmbed(msg){
    let infoEmbed = new Discord.MessageEmbed()
        .setColor('#2df8fc')
        .setTitle('Switchbot Info')
        .setAuthor('Nova#8400', ownerAvatarUrl)
        .setThumbnail('https://i.imgur.com/T5GStPs.jpg')
        .addField('Info', 'Switchbot is a bot created by Nova#8400 to easily get information on all switches.', true)
        .addField('Available Switches', 'Currently not all switches are available but more are being added.', true)
        .setTimestamp()
        .setFooter('Bot by Nova#8400', ownerAvatarUrl);
    msg.channel.send(infoEmbed);
}

async function sendLubeEmbed(msg){
    let lubeEmbed = new Discord.MessageEmbed()
        .setColor('#2df8fc')
        .setTitle('Lube Info')
        .setThumbnail('https://www.1upkeyboards.com/wp-content/uploads/2018/02/switchlube-tribosys-3204-1ml_1.jpg')
        .addField('Krytox 205g0', 'This lube is recommended for most linear switches and stabilizers.', true)
        .addField('Krytox 205g2', 'This lube is good for linear switches but is thicker than 205g0 so requires a thinner layer.', true)
        .addField('Krytox 105', 'This lube is very good for lubing springs.', true)
        .addField('Tribosys 3204', 'Good all around lube for switches. Recommended for beginners.', true)
        .addField('Tribosys 3203', 'An option for those who want to preserve the tactility of tactile switches.', true)
        .addField('Dielectric grease', 'This is recommended for the wire on your stabilizers.', true)
        .setTimestamp()
        .setFooter('Bot by Nova#8400', ownerAvatarUrl);
    msg.channel.send(lubeEmbed);
}

async function sendViaEmbed(msg){
    let viaEmbed = new Discord.MessageEmbed()
        .setColor('#2df8fc')
        .setTitle('VIA Firmware')
        .setURL('https://caniusevia.com')
        .setThumbnail('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.P7m5pSsWPuJMu94w1ZkIggHaHa%26pid%3DApi&f=1')
        .addField('What is VIA?', 'VIA is a QMK keyboard firmware that allows for realtime changes unlike standard QMK where you have to re-flash the firmware for any changes.', true)
        .addField('URL', 'https://caniusevia.com')
        .addField('Tutorial', 'https://www.youtube.com/watch?v=lyvf7Yp1z5g')
        .setTimestamp()
        .setFooter('Bot by Nova#8400', ownerAvatarUrl);
    msg.channel.send(viaEmbed);
}

async function sendQmkEmbed(msg){
    let qmkEmbed = new Discord.MessageEmbed()
        .setColor('#2df8fc')
        .setTitle('QMK')
        .setURL('https://config.qmk.fm')
        .setThumbnail('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.ouO7ClUtS6280yq-YcTp_AAAAA%26pid%3DApi&f=1')
        .addField('What is QMK?', 'QMK Allows multiple layouts to be flashed onto your PCB.', true)
        .addField('URL', 'https://config.qmk.fm')
        .addField('Tutorial', 'https://www.youtube.com/watch?v=VR53Wo9Z960')
        .setTimestamp()
        .setFooter('Bot by Nova#8400', ownerAvatarUrl);
    msg.channel.send(qmkEmbed);
}

async function sendHelpEmbed(msg){  
    let helpEmbed = new Discord.MessageEmbed()
        .setColor('#2df8fc')
        .setTitle('Help/Commands')
        .setThumbnail('https://i.imgur.com/T5GStPs.jpg')
        .addField('.switches', 'List all switches available in the bot.', true)
        .addField('.lube', 'Useful tips on which lube to choose.')
        .addField('.via', 'Information on via.')
        .addField('.qmk', 'Information on qmk.')
        .addField('.switchname', 'Get information on a switch from the list of switches found using the .switches command.')
        .addField('.info', 'Info about Switchbot.')
        .addField('.changelog', 'Recent changes made to the bot.')
        .setTimestamp()
        .setFooter('Bot by Nova#8400', ownerAvatarUrl);
    msg.channel.send(helpEmbed);
}

 
bot.login(token);
