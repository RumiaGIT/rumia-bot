const Discord = require("discord.js");
const fs = require('fs');

module.exports = bot => {
    bot.commands = new Discord.Collection();
    bot.aliases = new Discord.Collection();

    fs.readdir("./cmds/", (err, files) => {
        if(err) console.log(err);
        let jsfiles = files.filter(f => f.split(".").pop() === "js");
        if(jsfiles.length <= 0) {
            console.log("No commands to load");
            return;
        }
    
        //console.log(`Loading ${jsfiles.length} commands`);
        jsfiles.forEach((f, i) => {
            let props = require(`../cmds/${f}`);
            //console.log(`${i + 1}: ${f} loaded`);
            bot.commands.set(props.help.name, props);
            if(!props.conf || !props.conf.aliases) return;
            props.conf.aliases.forEach(alias => {
                bot.aliases.set(alias, props.help.name);
            });
        });
    });
}