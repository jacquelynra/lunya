const { SlashCommandBuilder } = require('@discordjs/builders'); // Para los slashs
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

module.exports = {

// Descripción del modulo

    data: new SlashCommandBuilder()
    .setName('addmedalla')
    .setDescription('Le da medallas a alguien.')
	.addUserOption(option => option.setName('usuario').setDescription('Selecciona un usuario').setRequired(true))
	.addIntegerOption(option => option.setName('oro').setDescription('Medallas de oro conseguidas').setRequired(true))
	.addIntegerOption(option => option.setName('plata').setDescription('Medallas de plata conseguidas').setRequired(true))
	.addIntegerOption(option => option.setName('bronce').setDescription('Medallas de bronce conseguidas').setRequired(true))
	.addIntegerOption(option => option.setName('hierro').setDescription('Medallas de hierro conseguidas').setRequired(true))
	.addIntegerOption(option => option.setName('carton').setDescription('Medallas de carton conseguidas').setRequired(true)),
    
    async execute(interaction) {
        
        // Log
        console.log(`${interaction.user.tag} en el canal de #${interaction.channel.name} triggereó la interación de agregar medallas. `);

        // En vez de tirar la respuesta de una, primero le decimos al Discord de que existimos. [Si no responde en los primeros 3 seg, Discord lo da por perdido.]
        await interaction.deferReply({ephemeral: true });
        
        // Checkear permisos
        if (!interaction.member.roles.cache.has("554672385979056158")){
            interaction.editReply({ content: 'No tienes el permiso para ejecutar este comando.' , ephemeral: true})
            return;
        }

        // Load information
        const newuserid = interaction.options.getUser('usuario');
        const medallaoro = interaction.options.getInteger('oro');
        const medallaplata = interaction.options.getInteger('plata');
        const medallabronce = interaction.options.getInteger('bronce');
        const medallahierro = interaction.options.getInteger('hierro');
        const medallamadera = interaction.options.getInteger('carton');

        // Checkear si la persona no tiene perfil.
        const UserData = await interaction.client.dbusers.findOne({ where: { discordid: newuserid.id } });
        if (!UserData) {
            return interaction.editReply({ content: `No tiene un perfil.`, ephemeral: true} );
        }

        // Confirmar

        const embed = new MessageEmbed()
        .setColor('#1565C0')
        .setTitle('Confirma los detalles')
        .setDescription(`Le estás agregando medallas a <@${newuserid.id}>: ${medallaoro} <:oro:904816810812145694> ${medallaplata} <:silver:904816810568843285> ${medallabronce} <:bronze:904816810224930858> ${medallahierro} <:iron:904816810686287922> ${medallamadera} <:carton:904816810803757096>`);

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('1')
                .setLabel('Confirmar')
                .setStyle('PRIMARY')
                .setEmoji('✅'),
        );

        const msg = await interaction.editReply({embeds: [embed], components: [row], ephemeral: true})

        const collector = msg.createMessageComponentCollector({ componentType: 'BUTTON', time: 60000 });

        collector.on('collect', i => {
            collector.stop();
            i.deferUpdate();
            var new_score = UserData.score          + (medallaoro * 5) + (medallaplata * 4) + (medallabronce * 3) + (medallahierro * 2) + (medallamadera * 1);
            var new_gold = UserData.medal_gold      + medallaoro;
            var new_silver = UserData.medal_silver  + medallaplata;
            var new_bronze = UserData.medal_bronze  + medallabronce;
            var new_iron = UserData.medal_iron      + medallahierro;
            var new_cardboard = UserData.medal_cardboard + medallamadera;
            async function saveone(){
                await interaction.client.dbusers.update({ score:new_score, medal_gold:new_gold , medal_silver:new_silver, medal_bronze:new_bronze, medal_iron:new_iron, medal_cardboard:new_cardboard}, {where: {discordid: newuserid.id}});
            }
            saveone();
            const embed2 = new MessageEmbed()
            .setColor('#1565C0')
            .setTitle('El perfil se ha editado correctamente');

            interaction.editReply({embeds: [embed2], components: [], ephemeral: true})

        });
        
        collector.on('end', collected => {
            if (!collected.some(collected => collected.user.id === interaction.user.id)){
                interaction.editReply({embeds: [], components: [], content:'No se ha hecho ningún cambio.', ephemeral: true})
            }
        });
        }
}
