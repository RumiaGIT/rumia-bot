module.exports.run = async(bot, message, args) => {
    if(message.author.id == bot.settings.ownerid) {
        let link = await bot.generateInvite([
            "CREATE_INSTANT_INVITE", "KICK_MEMBERS", "BAN_MEMBERS",
            "MANAGE_CHANNELS", "ADD_REACTIONS", "VIEW_AUDIT_LOG",
            "VIEW_CHANNEL", "SEND_MESSAGES", "MANAGE_MESSAGES",
            "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY",
            "USE_EXTERNAL_EMOJIS", "MUTE_MEMBERS", "DEAFEN_MEMBERS",
            "CHANGE_NICKNAME", "MANAGE_NICKNAMES", "MANAGE_ROLES",
            ]);
        message.author.send(link)
        .catch(console.error);
    } else {
        message.channel.send(bot.errors.userNotOwner);
    }
}

module.exports.help = {
    name: "invite",
    description: "Send a PM to the owner containing an invite link for this bot.",
    type: "owner",
    usage: "`prefix (invite | inv)`"
}

module.exports.conf = {
    aliases: ["inv"]
}