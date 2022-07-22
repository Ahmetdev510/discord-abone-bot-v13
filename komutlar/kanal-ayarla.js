const Discord = require('discord.js');
const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const db = require("quick.db");

new Command({
    name: 'kanal-ayarla',
    description: 'Kanal ayarlar.',
    type: [CommandType.SLASH, CommandType.MESSAGE],
    arguments: [
        new Argument({
            name: 'kanal',
            description: 'Kanal belirle.',
            type: ArgumentType.CHANNEL,
            required: true,
        }),
        new Argument({
            name: 'log',
            description: 'Log kanal belirle.',
            type: ArgumentType.CHANNEL,
            required: true,
        }),
        new Argument({
            name: 'rol',
            description: 'Abone rol belirle.',
            type: ArgumentType.ROLE,
            required: true,
        })
    ],
    run: (ctx) => {
        const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTimestamp()
        
        if(!ctx.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return ctx.reply({embeds: [embed.setDescription("Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın.")], ephemeral:true})
        const kanal = ctx.arguments.getChannel('kanal')
        const logkanal = ctx.arguments.getChannel('log')
        const abonerol = ctx.arguments.getRole('rol')
        db.set(`abonekanal_${ctx.guild.id}`,kanal.id)
        db.set(`abonelogkanal_${ctx.guild.id}`,logkanal.id)
        db.set(`abonerol_${ctx.guild.id}`,abonerol.id)
        ctx.reply({embeds: [embed.setDescription(`Abone kanalı <#${db.fetch(`abonekanal_${ctx.guild.id}`)}>\nAbone log kanalı <#${db.fetch(`abonelogkanal_${ctx.guild.id}`)}>\nAbone Rol <@&${db.fetch(`abonerol_${ctx.guild.id}`)}> olarak ayarlandı`)], ephemeral:true})
    }
})