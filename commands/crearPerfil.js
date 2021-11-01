const { SlashCommandBuilder } = require('@discordjs/builders'); // Para los slashs
const { MessageEmbed } = require('discord.js');

module.exports = {

// Descripción del modulo

    data: new SlashCommandBuilder()
    .setName('crearperfil')
    .setDescription('Le crea el perfil a alguien.')
	.addUserOption(option => option.setName('usuario').setDescription('Selecciona un usuario').setRequired(true))
	.addStringOption(option => option.setName('nick').setDescription('Que nombre tendrá en la base de datos').setRequired(true)),
    
    async execute(interaction) {
        
        // Log
        console.log(`${interaction.user.tag} en el canal de #${interaction.channel.name} triggereó la interación de crear perfil. `);

        // En vez de tirar la respuesta de una, primero le decimos al Discord de que existimos. [Si no responde en los primeros 3 seg, Discord lo da por perdido.]
        await interaction.deferReply({ephemeral: true });
        
        // Checkear permisos
        if (!interaction.member.roles.cache.has("554672385979056158")){
            interaction.editReply({ content: 'No tienes el permiso para ejecutar este comando.' , ephemeral: true})
            return;
        }

        // Load information
        const newuserid = interaction.options.getUser('usuario');
        const newusernick = interaction.options.getString('nick');

        // Checkear si la persona ya tiene perfil.
        const UserData = await interaction.client.dbusers.findOne({ where: { discordid: newuserid.id } });
        if (UserData) {
            return interaction.editReply({ content: `Ya tiene un perfil.`, ephemeral: true} );
        }

        // Crear el perfil
        const newuserdata = await interaction.client.dbusers.create({ discordid: newuserid.id, charname: newusernick });
        newuserdata.save();

        // Listo
        return interaction.editReply({ content: `Se ha creado el perfil.`, ephemeral: true });

        }
}
