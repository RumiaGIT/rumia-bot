const Discord = require("discord.js");

module.exports.run = async(bot, message, args) => {
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return (bot.errors.userPrunePerm);
    if(!message.guild.member(bot.user.id).hasPermission("MANAGE_MESSAGES")) return (bot.errors.botPrunePerm);

    let messageHistory;
    let target;
    let pruneEmbed = await new Discord.RichEmbed()
    .setAuthor("Messages pruned", message.author.displayAvatarURL)
    .setColor(message.guild.member(message.author).highestRole.color || "#FF0000")
    .setTimestamp();

    if(args[0]) {
        if(!parseInt(args[0])) return message.channel.send(bot.errors.paramWrong);
        messageHistory = await message.channel.fetchMessages({limit: args[0]})
        .catch(console.error);
        if(!messageHistory) return message.channel.send(bot.errors.pruneLimit); 
    } else {
        messageHistory = await message.channel.fetchMessages({limit: 50})
        .catch(console.error);
    }
    
    if(args[1]) {
        target = await message.guild.member(message.mentions.users.first()) || message.guild.member(args[1])
    }

    if(!target) {
        await message.channel.bulkDelete(messageHistory)
        .catch(console.error);

        await pruneEmbed.addField("Total messages pruned", `${messageHistory.size}`)
        message.channel.send(pruneEmbed);
    } else {
        let messageHistoryArray = await messageHistory.array();
        let pruneMessages = [];

        for (i = 0; i < messageHistoryArray.length; ++i) {
            if(messageHistoryArray[i].author.id == target.id) {
                pruneMessages.push(messageHistoryArray[i]);
            }
        }
        
        await message.channel.bulkDelete(pruneMessages)
        .catch(console.error);

        await pruneEmbed.addField(`Total messages pruned from ${target.user.username}#${target.user.discriminator}`, `${pruneMessages.length}`)
        message.channel.send(pruneEmbed);
    }
}

module.exports.help = {
    name: "prune",
    description: "Prunes messages from this channel. Supply a mention or ID to prune only that user's messages.\nDefault history limit is 50 and maxes out at 100.",
    type: "mod",
    usage: "`prefix prune` | `prefix prune 100` | `prefix prune 100 @user`"
}

module.exports.conf = {
    aliases: ["pr"]
}