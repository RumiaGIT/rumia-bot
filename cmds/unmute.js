const Discord = require("discord.js");

module.exports.run = async(bot, message, args) => {
    if(!message.member.hasPermission("MANAGE_ROLES")) return (bot.errors.userRolePerm);
    if(!message.guild.member(bot.user.id).hasPermission("MANAGE_ROLES")) return (bot.errors.botRolePerm);

    if(!args[0]) return message.channel.send(bot.errors.paramMissing);
    let target = await message.guild.member(message.mentions.users.first()) || message.guild.member(args[0]);
    if(!target) return message.channel.send(bot.errors.userUnknown);

    let muteRole = await message.guild.roles.find(r => r.name === bot.settings.muterole);
    if(!muteRole) return message.channel.send(bot.errors.muteRoleUnknown);
    if(!target.roles.has(muteRole.id)) return message.channel.send(bot.errors.userNotMuted);

    let unmuteEmbed = new Discord.RichEmbed()
    .setAuthor("User unmuted", target.user.displayAvatarURL)
    .setColor(message.guild.member(message.author).highestRole.color || "#FF0000")
    .addField("Username", `${target.user.username}#${target.user.discriminator}`, true)
    .addField("ID", `${target.user.id}`, true)        
    .setTimestamp();

    await message.channel.send(unmuteEmbed);
    await target.removeRole(muteRole)
    .catch(console.error);
}

module.exports.help = {
    name: "unmute",
    description: "Unmutes a user.",
    type: "mod",
    usage: "`prefix unmute @user` | `prefix unmute ID`"
}

module.exports.conf = {
    aliases: ["um"]
}