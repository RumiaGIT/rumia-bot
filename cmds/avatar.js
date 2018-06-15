const Discord = require("discord.js");

module.exports.run = async(bot, message, args) => {
    let target;

    if(!args[0]) {
        target = message.author;
    } else {
        target = await bot.users.get(args[0]) || await message.mentions.users.first();
        if(!target) return message.channel.send(bot.errors.userUnknown);
    }  

    let avatarEmbed = await new Discord.RichEmbed()
    .setImage(target.displayAvatarURL)
    .setColor(message.guild.member(message.author).highestRole.color || "#FF0000");

    message.channel.send(avatarEmbed);
}

module.exports.help = {
    name: "avatar",
    description: "Returns the avatar of a user.",
    type: "util",
    usage: "`prefix avatar @user` | `prefix avatar ID`"
}

module.exports.conf = {
    aliases: ["av"]
}