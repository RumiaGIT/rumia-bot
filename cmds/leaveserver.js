const Discord = require("discord.js");

module.exports.run = async(bot, message, args) => {
    if(message.author.id == bot.settings.ownerid) {
        if(!args[0]) return message.channel.send(bot.errors.paramMissing);
        let server = await bot.guilds.get(args[0])
        if(!server) return message.channel.send(bot.errors.serverUnknown);
        server.leave();
    } else {
       message.channel.send(bot.errors.userNotOwner);
    }
}

module.exports.help = {
    name: "leaveserver",
    description: "Forces the bot to leave a server.",
    type: "owner",
    usage: "`prefix leaveserver ID`"
}

module.exports.conf = {
    aliases: ["lsr"]
}