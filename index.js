require("dotenv").config();
const path = require('path');
const Discord = require('gcommands');
const db = require("quick.db");
const ReadText = require('./yazı.js');

Discord.Plugins.search(__dirname);
Discord.Logger.setLevel(Discord.Logger.DEBUG);

const client = new Discord.GClient({
	dirs: [
		path.join(__dirname, 'komutlar'),
	],
    messageSupport: false,
	messagePrefix: process.env.prefix,
    intents: ["DIRECT_MESSAGES", "GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGE_REACTIONS", "DIRECT_MESSAGE_TYPING"],
});


client.on("ready", () => {
    console.log(`${client.user.tag} aktif!`);
})



client.on("messageCreate",message => {
    var abonekanal = message.guild.channels.cache.get(db.fetch(`abonekanal_${message.guild.id}`))
    var abonelog = message.guild.channels.cache.get(db.fetch(`abonelogkanal_${message.guild.id}`))
    var abonerol = message.guild.roles.cache.get(db.fetch(`abonerol_${message.guild.id}`))
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    if(!abonekanal) return;
    if(!abonelog) return;
    if(!abonerol) return;

    if(message.channel.id == abonekanal.id) {
        if(message.attachments.first() == undefined) return message.reply({content: `Bu kanala sadece resim gönderebilirsin.`}).then(a=>{message.delete();setTimeout(() => { a.delete()}, 3000);}) 
        if(message.member.roles.cache.has(abonerol.id)) return message.reply({content: "Zaten abone rolün var."}).then(a=>{message.delete();setTimeout(() => { a.delete()}, 3000);});     
        ReadText(message.attachments.first().url).then(text => {
            if(text.match("ABONEOLUNDU") || text.match("ABONE OLUNDU")){
                message.member.roles.add(abonerol).then(() => {
                    message.reply({content: "Abone rolün verildi."}).then(a=>{setTimeout(() => { a.delete()}, 3000);})
                    message.react("✅")
                    abonelog.send({embeds: [new Discord.MessageEmbed().setTitle("Abone Rolü Verildi").setDescription(`${message.author} adlı kullanıcıya <@&${abonerol.id}> rolü verildi.`).setImage(message.attachments.first().url).setColor("RANDOM").setTimestamp()]})
                }).catch(err => {
                    return message.reply(`Hata oluştu: ${err}`);
                })
            }else{
                message.reply({content: "Bu kanala abone olduğunuzu tespit edemedim."}).then(a=>{message.delete();setTimeout(() => { a.delete()}, 3000);})
                abonelog.send({embeds: [new Discord.MessageEmbed().setTitle("Abone olmayan birisi tespit edildi").setDescription(`${message.author} adlı kullanıcıya <@&${abonerol.id}> rolü verilmedi.`).setImage(message.attachments.first().url).setColor("RANDOM").setTimestamp()]})
            }
        }).catch(err => {
            console.log(err);
        })
    }
})

client.on('error', console.log);
client.on('warn', console.log);

client.login(process.env.token);
