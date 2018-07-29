const Discord = require("discord.js");
const database = require("./pgsql.js");
const errors = require("./util/errors.json");

const bot = new Discord.Client({disableEveryone: true});

async function setup() {
    bot.db = database;
    bot.settings = await bot.db.first('SELECT * FROM settings');
}

async function run() {
    bot.on("ready", async() => {
        bot.user.setActivity(`on ${bot.guilds.array().length} servers`, {type: "PLAYING"});
        bot.errors = errors;

        console.log(`${bot.user.username} is ready!`);
        require("./util/commandsLoader.js")(bot);
    });
    
    bot.on("message", async message => {
        if(message.author.bot) return;
        if(message.channel.type === "dm") {
            let owner = await bot.users.get(bot.settings.ownerid);
            let botPmEmbed = await new Discord.RichEmbed()
            .setAuthor(`PM Source: ${message.author.username}#${message.author.discriminator} | ${message.author.id}`, message.author.displayAvatarURL)
            .addField("Content", `${message.content}`)
            .setColor("#FF0000")
            .setTimestamp();
    
            return await owner.send(botPmEmbed)
            .catch(console.error);
        }
        if(message.content.toLocaleLowerCase().indexOf("discord.gg") !== -1) {
            let whitelist = await bot.db.total('SELECT * FROM serverwhitelist');
            let found = false;
            for(i = 0; i < whitelist.length; ++i) {
                if(`${message.guild.id}` == whitelist[i].id) {
                    found = true;
                    break;
                }
            }

            if(!found) {
                let owner = await bot.users.get(bot.settings.ownerid);
                let botPmEmbed = await new Discord.RichEmbed()
                .setAuthor(`Message source: ${message.author.username}#${message.author.discriminator} | ${message.author.id}`, message.author.displayAvatarURL)
                .addField("Invite link posted", `${message.content}`)
                .addField("Server", `${message.guild}`, true)
                .addField("Channel", `${message.channel}`, true)
                .setColor("#FF0000")
                .setTimestamp();
    
                await owner.send(botPmEmbed)
                .catch(console.error);
            }
        }
        if(!message.content.startsWith(bot.settings.prefix)) return;
    
        let messageArray = message.content.trim().split(/ +/g);
        let command = messageArray[0].toLocaleLowerCase();
        let args = messageArray.slice(1);
    
        let cmd = await bot.commands.get(command.slice(bot.settings.prefix.length)) || bot.commands.get(bot.aliases.get(command.slice(bot.settings.prefix.length)));
        if(!cmd) return;
        if(cmd) cmd.run(bot, message, args)
        .catch(console.error);
    });
    
    bot.login(bot.settings.token);
}

setup().then(() => {
    run().catch(console.error);
}).catch(console.error);