const Discord = require("discord.js");

module.exports.run = async(bot, message, args) => {
    if(message.author.id == bot.settings.ownerid) {
        if(!args[0]) {
            return message.channel.send(bot.errors.paramMissing);
        } else {
            bot.settings.prefix = args[0];
            message.channel.send(`Changed the current prefix to ${args[0]}`);
        }  
    } else {
        message.channel.send(bot.errors.userNotOwner);
    }
}

module.exports.help = {
    name: "prefix",
    description: "Changes the bot's prefix.",
    type: "owner",
    usage: "`prefix (prefix | px)` `prefix`"
}

module.exports.conf = {
    aliases: ["px"]
}