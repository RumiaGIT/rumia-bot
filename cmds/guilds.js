const Discord = require("discord.js");

module.exports.run = async(bot, message, args) => {
    let guildListEmbed = await new Discord.RichEmbed()
    .setColor(message.guild.member(message.author).highestRole.color || "#FF0000")
    .setTimestamp();

    let guildArray = await bot.guilds.array();
    let guildList = "";
    for(i = 0; i < guildArray.length; ++i) {
        guildList += `${guildArray[i].name}\n`;
    }

    guildListEmbed.addField(`Guilds [${guildArray.length}]`, `\`\`\`${guildList}\`\`\``);
    message.channel.send(guildListEmbed);
}

module.exports.help = {
    name: "guilds",
    description: "Returns a list of all guilds the bot is present in.",
    type: "help",
    usage: "`prefix guilds`"
}

module.exports.conf = {
    aliases: ["g"]
}