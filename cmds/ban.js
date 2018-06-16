const Discord = require("discord.js");

module.exports.run = async(bot, message, args) => {
    if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(bot.errors.userBanPerm);
    if(!message.guild.member(bot.user.id).hasPermission("BAN_MEMBERS")) return message.channel.send(bot.errors.botBanPerm);

    if(!args[0]) return message.channel.send(bot.errors.paramMissing);
    let target = await message.guild.member(message.mentions.users.first()) || message.guild.member(args[0]);
    if(!target) return message.channel.send(bot.errors.userUnknown);
    if(target.id == message.author.id) return message.channel.send(bot.errors.userBanSelf);
    if(!target.bannable) return message.channel.send(bot.errors.userUnbannable);

    let reason = args.slice(1).join(" ");
    if(!reason) reason = "None";

    let banPM = await new Discord.RichEmbed()
    .setAuthor("Banned")
    .setDescription(`You have been banned from ${message.guild.name}`)
    .addField("Reason", reason)
    .setColor("#FF0000")
    .setTimestamp();

    let banEmbed = await new Discord.RichEmbed()
    .setAuthor("User banned", target.user.displayAvatarURL)
    .setColor(message.guild.member(message.author).highestRole.color || "#FF0000")
    .addField("Username", `${target.user.username}#${target.user.discriminator}`, true)
    .addField("ID", `${target.user.id}`, true)        
    .setTimestamp();

    await target.send(banPM)
    .catch(console.error);
    await message.channel.send(banEmbed);
    await message.guild.ban(target, {days: 7, reason: `${message.author.username}#${message.author.discriminator} | ${reason}`})
    .catch(console.error);
}

module.exports.help = {
    name: "ban",
    description: "Bans a user from the server. Optionally add a reason.",
    type: "mod",
    usage: "`prefix ban @user` | `prefix ban ID`"
}

module.exports.conf = {
    aliases: ["b"]
}