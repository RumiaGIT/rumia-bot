const Discord = require("discord.js");

module.exports.run = async(bot, message, args) => {
    if(message.author.id !== bot.settings.ownerid) {
        if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send(bot.errors.userKickPerm);
        if(!message.guild.member(bot.user.id).hasPermission("KICK_MEMBERS")) return message.channel.send(bot.errors.botKickPerm);
    }

    if(!args[0]) return message.channel.send(bot.errors.paramMissing);
    let target = await message.guild.member(message.mentions.users.first()) || message.guild.member(args[0]);
    if(!target) return message.channel.send(bot.errors.userUnknown);
    if(target.id == message.author.id) return message.channel.send(bot.errors.userKickSelf);
    if(!target.kickable) return message.channel.send(bot.errors.userUnkickable);

    let reason = args.slice(1).join(" ");
    if(!reason) reason = "None"; 

    let kickPM = await new Discord.RichEmbed()
    .setAuthor("Kicked")
    .setDescription(`You have been kicked from ${message.guild.name}`)
    .addField("Reason", reason)
    .setColor("#FF0000")
    .setTimestamp();

    let kickEmbed = await new Discord.RichEmbed()
    .setAuthor("User kicked", target.user.displayAvatarURL)
    .setColor(message.guild.member(message.author).highestRole.color || "#FF0000")
    .addField("Username", `${target.user.username}#${target.user.discriminator}`, true)
    .addField("ID", `${target.user.id}`, true)      
    .setTimestamp();

    await target.send(kickPM)
    .catch(console.error);
    await message.channel.send(kickEmbed);
    await message.guild.member(target).kick()
    .catch(console.error);
}

module.exports.help = {
    name: "kick",
    description: "Kicks a user from the server. Optionally add a reason.",
    type: "mod",
    usage: "`prefix (kick | k)` `(@user | userID)` `[reason]`"
}

module.exports.conf = {
    aliases: ["k"]
}   