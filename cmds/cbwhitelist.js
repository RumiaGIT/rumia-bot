const Discord = require("discord.js");

module.exports.run = async(bot, message, args) => {
    let whitelist = await bot.db.total('SELECT * FROM cbwhitelist');
    let userListEmbed = await new Discord.RichEmbed()
    .setColor(message.guild.member(message.author).highestRole.color || "#FF0000")
    .setTimestamp();

    let userList = "\n";
    for(i = 0; i < whitelist.length; ++i) {
        userList += `${whitelist[i].id}\n`;
    }
    
    userListEmbed.addField(`Users [${whitelist.length}]`, `\`\`\`${userList}\`\`\``);
    message.channel.send(userListEmbed);
}

module.exports.help = {
    name: "cbwhitelist",
    description: "Returns a list of users with chainban permissions.",
    type: "help",
    usage: "`prefix (cbwhitelist | cbwl)`"
}

module.exports.conf = {
    aliases: ["cbwl"]
}