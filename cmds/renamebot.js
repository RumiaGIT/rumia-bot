const Discord = require("discord.js");

module.exports.run = async(bot, message, args) => {
    if(message.author.id == bot.settings.ownerid) {
        if(!args[0]) return message.channel.send(bot.errors.paramMissing);
        bot.user.setUsername(args.join(" "))
        .catch(console.log);
    } else {
        message.channel.send(bot.errors.userNotOwner);
    }
}

module.exports.help = {
    name: "renamebot",
    description: "Changes the account name of the bot.",
    type: "owner",
    usage: "`prefix (renamebot | rb)` `name`"
}

module.exports.conf = {
    aliases: ["rb"]
}