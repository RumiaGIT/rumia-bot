const Discord = require("discord.js");

module.exports.run = async(bot, message, args) => {
    if(message.author.id !== bot.settings.ownerid) {
        if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(bot.errors.userBanPerm);
        if(!message.guild.member(bot.user.id).hasPermission("BAN_MEMBERS")) return message.channel.send(bot.errors.botBanPerm);
    }
    if(!args[0]) return message.channel.send(bot.errors.paramMissing);

    let reason = args.slice(1).join(" ");
    if(!reason) reason = "None";

    let embed = await new Discord.RichEmbed()
    .setAuthor("User unbanned")
    .setColor(message.guild.member(message.author).highestRole.color || "#FF0000")
    .addField("ID", `${args[0]}`)
    .setTimestamp();

    try {
        await message.guild.unban(args[0], `${reason}`);
        return await message.channel.send(embed);
    } catch(e) {
        return await message.channel.send("Cannot unban user due to invalid ID");
    }
}

module.exports.help = {
    name: "unban",
    description: "Unbans a user from the server based on a user ID. Optionally add a reason.",
    type: "mod",
    usage: "`prefix (unban | ub)` `userID` `[reason]`"
}

module.exports.conf = {
    aliases: ["ub"]
}