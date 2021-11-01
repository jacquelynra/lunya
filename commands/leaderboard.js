const { SlashCommandBuilder } = require('@discordjs/builders'); // Para los slashs
const { MessageEmbed } = require('discord.js');

module.exports = {

// Descripción del modulo

    data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Lista de los comandos disponibles del servidor.'),
    
    async execute(interaction) {

        // Log
        console.log(`${interaction.user.tag} en el canal de #${interaction.channel.name} triggereó la interación de leaderboard. `);
                
        // En vez de tirar la respuesta de una, primero le decimos al Discord de que existimos. [Si no responde en los primeros 3 seg, Discord lo da por perdido.]
        await interaction.deferReply();

        // Checkear permiso, si no, error.
        if (!interaction.member.roles.cache.has("673232271087763459")){
                interaction.editReply({ content: 'No tienes el permiso para ejecutar este comando.' , ephemeral: true})
                return;
        }
        
        let users = await interaction.client.dbusers.findAll({ limit: 10, order: [['score', 'DESC']] });

        const playerembed = new MessageEmbed()
        .setColor('#fffd85')
        .setAuthor(`Lunatic Cup || Ranking`)
        .setThumbnail('https://i.imgur.com/CDlIagn.png')
        .setDescription(
                users.sort((a, b) => b.balance - a.balance)
                .map((user, position) => ` \`\`${position + 1}.\`\` **| ${user.charname}**\n${user.medal_gold} <:oro:904439890777874452> ${user.medal_silver} <:plata:904439889175642142> ${user.medal_bronze} <:bronce:904439889867702324> ${user.medal_iron} <:hierro:904439890417180683> ${user.medal_cardboard} <:carton:904439891037929522>`)
                .join('\n'),
        )
        
        await interaction.editReply({ embeds: [playerembed] })

        }
}
