const Discord = require("discord.js");

module.exports.run = async(bot, message, args) => {
    let whitelist = await bot.db.total('SELECT * FROM cbwhitelist');
    let whitelisted = false;

    for(i = 0; i < whitelist.length; ++i) {
        if(message.author.id == whitelist[i].id) {
            whitelisted = true;
            break;
        }
    }

    if(whitelisted) {
        if(message.author.id !== bot.settings.ownerid) {
            if(!message.guild.member(bot.user.id).hasPermission("BAN_MEMBERS")) return message.channel.send(bot.errors.botBanPerm);
        }

        if(!args[0]) return message.channel.send(bot.errors.paramMissing);
        let target = await bot.users.get(args[0]) || await message.mentions.users.first() || args[0];
        if(target.id == message.author.id) return message.channel.send(bot.errors.userBanSelf);

        let guildArray = await bot.guilds.array();
        let successString = "\n";
        let failString = "\n";

        let successCount = 0;
        let failCount = 0;
        let notPresent = 0;

        let reason = args.slice(1).join(" ");
        if(!reason) reason = "None";

        if(bot.users.get(args[0])) {
            for(i = 0; i < guildArray.length; ++i) {
                if(guildArray[i].member(target)) {
                    let pmKnownEmbed = await new Discord.RichEmbed()
                    .setAuthor("Banned")
                    .setDescription(`You have been banned from ${guildArray[i].name}`)
                    .addField("Reason", reason)
                    .setColor("#FF0000")
                    .setTimestamp();

                    await target.send(pmKnownEmbed)
                    .catch(console.error);
                } else {
                    ++notPresent;
                }
            }

            if(notPresent > 0) {
                let pmUnknownEmbed = await new Discord.RichEmbed()
                .setAuthor("Banned")
                .setDescription(`You have been banned from ${notPresent} more servers you're currently not present on.`)
                .addField("Reason", reason)
                .setColor("#FF0000")
                .setTimestamp();

                await target.send(pmUnknownEmbed)
                .catch(console.error);
            }
        }
        
        let resultEmbed = await new Discord.RichEmbed()
        .setAuthor("Chainban result")
        .setColor(message.guild.member(message.author).highestRole.color || "#FF0000")
        .setTimestamp();
        
        for(i = 0; i < guildArray.length; ++i) {
            await guildArray[i].ban(target, {days: 7, reason: `${message.author.username}#${message.author.discriminator} | ${reason}`})
            .then(() => {
                successString += `${guildArray[i].name}\n`;
                ++successCount;
            }).catch(() => {
                failString += `${guildArray[i].name}\n`;
                ++failCount;
            });
        }

        if(successCount > 0) {
            await resultEmbed.addField(`Success [${successCount}]`, `\`\`\`${successString}\`\`\``, true);
        }

        if(failCount > 0) {
            await resultEmbed.addField(`Failure [${failCount}]`, `\`\`\`${failString}\`\`\``, true);
        }

        await message.channel.send(resultEmbed)
        .catch(console.error); 
    } else {
        message.channel.send(bot.errors.userNotWhitelisted);
    }
}

module.exports.help = {
    name: "chainban",
    description: "Bans a user from all servers the bot is in. Optionally add a reason.\nRequires the command's user to be whitelisted.",
    type: "mod",
    usage: "`prefix (chainban | cb)` `(@user | userID)` `[reason]`"
}

module.exports.conf = {
    aliases: ["cb"]
}