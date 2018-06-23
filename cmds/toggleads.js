const Discord = require("discord.js");

module.exports.run = async(bot, message, args) => {
    if(message.author.id !== bot.settings.ownerid) return message.channel.send(bot.errors.userNotOwner);

    let whitelist = await bot.db.total('SELECT * FROM serverwhitelist');
    let found = false;

    if(message.author.id == bot.settings.ownerid) {
        for(i = 0; i < whitelist.length; ++i) {
            if(`${message.guild.id}` == whitelist[i].id) {
                found = true;
                break;
            }
        }

        let toggleEmbed = await new Discord.RichEmbed()
        .setColor(message.guild.member(message.author).highestRole.color || "#FF0000")

        if(found) {
            bot.db.query(`DELETE FROM serverwhitelist WHERE id = '${message.guild.id}'`);
            toggleEmbed.setDescription(`Removed server ${message.guild.name} from the server advertisement whitelist.`);
            message.channel.send(toggleEmbed);
        } else {
            bot.db.query(`INSERT INTO serverwhitelist VALUES ('${message.guild.id}')`);
            toggleEmbed.setDescription(`Added server ${message.guild.name} to the server advertisement whitelist.`);
            message.channel.send(toggleEmbed);
        }    
    }
}

module.exports.help = {
    name: "toggleads",
    description: "Toggle's a server's presence on the advertisement notification whitelist.",
    type: "owner",
    usage: "`prefix (toggleads | ta)`"
}

module.exports.conf = {
    aliases: ["ta"]
}