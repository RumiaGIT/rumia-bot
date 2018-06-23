const Discord = require("discord.js");

module.exports.run = async(bot, message, args) => {
    let whitelist = await bot.db.total('SELECT * FROM serverwhitelist');
    let serverListEmbed = await new Discord.RichEmbed()
    .setColor(message.guild.member(message.author).highestRole.color || "#FF0000")
    .setTimestamp();

    let serverList = "\n";
    for(i = 0; i < whitelist.length; ++i) {
        serverList += `${whitelist[i].id}\n`;
    }
    
    serverListEmbed.addField(`Users [${whitelist.length}]`, `\`\`\`${serverList}\`\`\``);
    message.channel.send(serverListEmbed);
}

module.exports.help = {
    name: "serverwhitelist",
    description: "Returns a list of servers on the advertisement whitelist.",
    type: "help",
    usage: "`prefix (serverwhitelist | swl)`"
}

module.exports.conf = {
    aliases: ["swl"]
}