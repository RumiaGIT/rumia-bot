const Discord = require("discord.js");

module.exports.run = async(bot, message, args) => {
    if(message.author.id !== bot.settings.ownerid) {
        if(!message.member.hasPermission("MANAGE_ROLES")) return (bot.errors.userRolePerm);
        if(!message.guild.member(bot.user.id).hasPermission("MANAGE_ROLES")) return (bot.errors.botRolePerm);
    }

    if(!args[0]) return message.channel.send(bot.errors.paramMissing);
    let target = await message.guild.member(message.mentions.users.first()) || message.guild.member(args[0]);
    if(!target) return message.channel.send(bot.errors.userUnknown);

    let muteRole = await message.guild.roles.find(r => r.name === bot.settings.muterole);
    if(!muteRole) {
        muteRole = await message.guild.createRole({
            name: "Muted",
            color: "000000",
            permissions: []
        }).catch(console.error);

        message.guild.channels.forEach(async (channel, id) => {
            await channel.overwritePermissions(muteRole, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false
            }).catch(console.error);
        })
    }

    let muteEmbed = new Discord.RichEmbed()
    .setAuthor("User muted", target.user.displayAvatarURL)
    .setColor(message.guild.member(message.author).highestRole.color || "#FF0000")
    .addField("Username", `${target.user.username}#${target.user.discriminator}`, true)
    .addField("ID", `${target.user.id}`, true)        
    .setTimestamp();

    await message.channel.send(muteEmbed);
    await target.addRole(muteRole)
    .catch(console.error);
}

module.exports.help = {
    name: "mute",
    description: "Mutes a user.",
    type: "mod",
    usage: "`prefix (mute | m)` `(@user | userID)`"
}

module.exports.conf = {
    aliases: ["m"]
}