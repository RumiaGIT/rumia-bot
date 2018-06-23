const Discord = require("discord.js");

module.exports.run = async(bot, message, args) => {
    if(!args[0]) {
        let listMod, listUtil, listHelp, listOwner;
        listMod = listUtil = listHelp = listOwner = "";

        await bot.commands.forEach(e => {
            switch (e.help.type) {
                case "mod": 
                    listMod += `${e.help.name}`.padEnd(12);
                    listMod += `[${e.conf.aliases}]\n`;
                    break;
                case "util":
                    listUtil += `${e.help.name}`.padEnd(12);
                    listUtil += `[${e.conf.aliases}]\n`;
                    break;
                case "help":
                    listHelp += `${e.help.name}`.padEnd(12);
                    listHelp += `[${e.conf.aliases}]\n`;
                    break;
                case "owner":
                    listOwner += `${e.help.name}`.padEnd(12);
                    listOwner += `[${e.conf.aliases}]\n`;
                    break;
                default:
                    break;
            }
        });    

        let helpListEmbed = await new Discord.RichEmbed()
        .setAuthor("Available commands and aliases")
        .setColor(message.guild.member(message.author).highestRole.color || "#FF0000")
        .addField("Moderation", `\`\`\`ini\n${listMod}\`\`\``, true)
        .addField("Utility", `\`\`\`ini\n${listUtil}\`\`\``, true)
        .addField("Help", `\`\`\`ini\n${listHelp}\`\`\``, true)
        .addField("Owner", `\`\`\`ini\n${listOwner}\`\`\``, true)
        .addBlankField(true)
        .addBlankField(true)
        .setTimestamp();

        return message.channel.send(helpListEmbed);
               
    } else {
        let command = await bot.commands.get(args[0]) || bot.commands.get(bot.aliases.get(args[0]));
        if(!command) return message.channel.send(bot.errors.commandUnknown);

        let helpCommandEmbed = await new Discord.RichEmbed()
        .setAuthor(``)
        .setColor(message.guild.member(message.author).highestRole.color || "#FF0000")
        .addField(`${command.help.name}`, `${command.help.description}`)
        .addField("Usage", `${command.help.usage}`.replace(/prefix /g, `${bot.settings.prefix}`))
        .setTimestamp();

        return message.channel.send(helpCommandEmbed)
    }
}

module.exports.help = {
    name: "help",
    description: "Returns a list of all available commands. Optionally add a command name or alias to return individual command help.",
    type: "help",
    usage: "`prefix (help | h)` `[command | alias]`"
}

module.exports.conf = {
    aliases: ["h"]
}