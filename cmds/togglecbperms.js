const Discord = require("discord.js");

module.exports.run = async(bot, message, args) => {
    if(message.author.id !== bot.settings.ownerid) return message.channel.send(bot.errors.userNotOwner);
    if(!args[0]) return message.channel.send(bot.errors.paramMissing);

    let whitelist = await bot.db.total('SELECT * FROM cbwhitelist');
    let found = false;

    if(message.author.id == bot.settings.ownerid) {
        for(i = 0; i < whitelist.length; ++i) {
            if(`${args[0]}` == whitelist[i].id) {
                found = true;
                break;
            }
        }

        let toggleEmbed = await new Discord.RichEmbed()
        .setColor(message.guild.member(message.author).highestRole.color || "#FF0000")

        if(found) {
            bot.db.query(`DELETE FROM cbwhitelist WHERE id = '${args[0]}'`);
            toggleEmbed.setDescription(`Removed user ${args[0]} from the chainban whitelist.`);
            message.channel.send(toggleEmbed);
        } else {
            let target = await bot.users.get(args[0]) || await message.mentions.users.first();
            if(target) {
                bot.db.query(`INSERT INTO cbwhitelist VALUES ('${target.id}')`);
                toggleEmbed.setDescription(`Added user ${target.id} to the chainban whitelist.`);
                message.channel.send(toggleEmbed);
            } else {
                message.channel.send(bot.errors.userUnknown);
            }
        }    
    }
}

module.exports.help = {
    name: "togglecbperms",
    description: "Toggle's a user's chainban permissions by adding or removing them from the whitelist.",
    type: "owner",
    usage: "`prefix (togglecbperms | tcbp)` `(@user | userID)`"
}

module.exports.conf = {
    aliases: ["tcbp"]
}