const { SlashCommandBuilder } = require('@discordjs/builders'); // Para los slashs
const { MessageEmbed } = require('discord.js');

module.exports = {

// Descripción del modulo

    data: new SlashCommandBuilder()
    .setName('perfil')
    .setDescription('Ver tu perfil.'),
    
    async execute(interaction) {
            
                // Log
                console.log(`${interaction.user.tag} en el canal de #${interaction.channel.name} triggereó la interación de perfil. `);
                
                // En vez de tirar la respuesta de una, primero le decimos al Discord de que existimos. [Si no responde en los primeros 3 seg, Discord lo da por perdido.]
                await interaction.deferReply({ephemeral: true });

                // Si no tienes el permiso, devolver error.
                if (!interaction.member.roles.cache.has("673232271087763459")){
                        
                        return interaction.editReply({ content: 'No tienes el permiso para ejecutar este comando.' , ephemeral: true}) ;
                }
                
                // Si el usuario no tiene perfil, devolver error.
                const UserData = await interaction.client.dbusers.findOne({ where: { discordid: interaction.user.id } });
                if (!UserData) {
                    return interaction.editReply(`No tienes un perfil actualmente. Contacta con Minos o con Jacquelynra.`);
                }

                const playerembed = new MessageEmbed()
                .setColor('#fffd85')
                .setTitle(`Lunatic Cup || Perfil de ${UserData.charname}`)
                .setThumbnail(interaction.user.avatarURL())
                .addFields(
                        { name: 'Medallas', value: `${UserData.medal_gold} <:oro:904439890777874452> ${UserData.medal_silver} <:plata:904439889175642142> ${UserData.medal_bronze} <:bronce:904439889867702324> ${UserData.medal_iron} <:hierro:904439890417180683> ${UserData.medal_cardboard} <:carton:904439891037929522>` , inline: true },
                        { name: 'Posición', value: `#${UserData.rank + 1}`, inline: true },
                );
                
                await interaction.editReply({ embeds: [playerembed] })

        }
}
