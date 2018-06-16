const Discord = require("discord.js");

module.exports.run = async(bot, message, args) => {
    if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(bot.errors.userBanPerm);
    if(!message.guild.member(bot.user.id).hasPermission("BAN_MEMBERS")) return message.channel.send(bot.errors.botBanPerm);
    if(!args[0]) return message.channel.send(bot.errors.paramMissing);
    if(args[0] == message.author.id) return message.channel.send(bot.errors.userBanSelf);

    let successString = "";
    let failString = "";

    var successCount = 0;
    var failCount = 0;

    for(i = 0; i < args.length; ++i) {
        await message.guild.ban(args[i])
        .then(() => {
            successString += `${args[i]}\n`;
            ++successCount;
        }).catch(() => {
            failString += `${args[i]}\n`;
            ++failCount;
        });
    }

    let banEmbed = await new Discord.RichEmbed()
    .setAuthor("Hackban result")
    .setColor(message.guild.member(message.author).highestRole.color || "#FF0000")
    .setTimestamp();

    if(successCount > 0) {
        await banEmbed.addField(`Success [${successCount}]`, `\`\`\`${successString}\`\`\``, true);
    }
    
    if(failCount > 0) {
        await banEmbed.addField(`Failure [${failCount}]`, `\`\`\`${failString}\`\`\``, true);
    }

    await message.channel.send(banEmbed)
    .catch(console.error);
}

module.exports.help = {
    name: "hackban",
    description: "Hackbans one or multiple users from the server, even if they aren't present.",
    type: "mod",
    usage: "`prefix hackban ID`"
}

module.exports.conf = {
    aliases: ["hb"]
}