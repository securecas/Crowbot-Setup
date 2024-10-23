const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('convoquer')
        .setDescription('Permet de convoquer une personne avec un motif, une date/heure et un salon.')
        .addStringOption(option => 
            option.setName('id')
                .setDescription('L\'ID Discord de la personne à convoquer')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('motif')
                .setDescription('Le message ou motif de la convocation')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('date')
                .setDescription('La date et l\'heure de la convocation (format: JJ/MM/AAAA HH:MM)')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('salon')
                .setDescription('Le salon où la convocation sera annoncée')
                .setRequired(true)),

    async execute(interaction) {
        const userId = interaction.options.getString('id');
        const motif = interaction.options.getString('motif');
        const date = interaction.options.getString('date');
        const salon = interaction.options.getChannel('salon');
        const user = await interaction.client.users.fetch(userId);
        const commandUser = interaction.user; // L'utilisateur qui a fait la commande

        if (!user) {
            return interaction.reply({ content: 'Utilisateur introuvable !', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(0xffa500) // Couleur orange pour l'alerte
            .setTitle('⚠️ • Nouvelle convocation !')
            .setDescription(`<@${userId}>, vous êtes convoqué(e) par <@${commandUser.id}>`)
            .addFields(
                { name: 'Voici plus d\'informations :', value: `Tu devras être dans le salon vocal Salle d'attente le : ${date}` },
                { name: 'Note :', value: 'En cas d\'indisponibilité, veuillez contacter le staff du serveur via ticket support uniquement.' }
            )
            .setTimestamp();

        // Envoie le message en MP à la personne convoquée
        await user.send({ embeds: [embed] }).catch(error => {
            console.log(`Impossible d'envoyer un MP à ${user.tag}.`);
        });

        // Envoie le message dans le salon spécifié
        await salon.send({ content: `<@${userId}>, vous êtes convoqué(e) dans le salon vocal le ${date}`, embeds: [embed] });

        await interaction.reply({ content: `Convocation envoyée à ${user.tag} et dans ${salon}.`, ephemeral: true });
    },
};
