const Discord = require("discord.js");
const moment = require("moment");

module.exports.run = async(bot, message, args) => {
    let target;

    if(!args[0]) {
        target = message.author;
    } else {
        target = await bot.users.get(args[0]) || await message.mentions.users.first();
        if(!target) return message.channel.send(bot.errors.userUnknown);
    }

    let embed = await new Discord.RichEmbed()
    .setAuthor(`${target.username}'s information`, target.displayAvatarURL)
    .setThumbnail(target.displayAvatarURL)
    .setColor(message.guild.member(message.author).highestRole.color || "#FF0000")
    .addField("Full username", `${target.username}#${target.discriminator}`, true)
    .addField("ID", `${target.id}`, true)
    .addField("Created at", moment(target.createdAt).format("MMMM Do YYYY, h:mm:ss a"), true)
    .addField("Joined at", moment(target.joinedAt).format("MMMM Do YYYY, h:mm:ss a"), true)
    .setTimestamp();

    message.channel.send(embed);
}

module.exports.help = {
    name: "userinfo",
    description: "Returns a user's various account information.",
    type: "util",
    usage: "`prefix (userinfo | uinfo)` `(@user | userID)`"
}

module.exports.conf = {
    aliases: ["ui"]
}