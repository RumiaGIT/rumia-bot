const Discord = require("discord.js");

module.exports.run = async(bot, message, args) => {
    const p = await message.channel.send("Pinging...");

    pingEmbed = await new Discord.RichEmbed()
    .setAuthor(`${message.author.username}#${message.author.discriminator}`)
    .setTitle(`${p.createdTimestamp - message.createdTimestamp}ms.`)
    .setColor(message.guild.member(message.author).highestRole.color || "#FF0000")
    .setTimestamp();

    await p.delete();
    await message.channel.send(pingEmbed);
}

module.exports.help = {
    name: "ping",
    description: "Checks your ping/latency.",
    type: "help",
    usage: "`prefix ping`"
}

module.exports.conf = {
    aliases: ["p"]
}