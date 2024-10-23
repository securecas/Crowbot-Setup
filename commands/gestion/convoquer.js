const Discord = require('discord.js');
const db = require('quick.db');
const { 
    MessageActionRow, 
    MessageButton, 
    MessageMenuOption, 
    MessageMenu 
} = require('discord-buttons');

module.exports = {
    name: 'convoquer',
    description: 'Permet de convoquer une personne avec un motif, une date/heure et un salon.',
    execute: async (client, message, args) => {
        if (!args[0] || !args[1] || !args[2] || !message.mentions.channels.first()) {
            return message.reply('Merci de fournir tous les arguments : `+convoquer <IdDiscord> <motif> <date-et-heure> <#salon>`');
        }

        const userId = args[0]; // Récupère l'ID de l'utilisateur convoqué
        const motif = args[1]; // Le motif de la convocation
        const date = args[2]; // La date et l'heure de la convocation
        const salon = message.mentions.channels.first(); // Le salon mentionné
        const user = await client.users.fetch(userId); // Récupère l'utilisateur convoqué

        if (!user) {
            return message.reply('Utilisateur introuvable !');
        }

        const commandUser = message.author; // L'utilisateur qui a fait la commande

        // Création de l'embed
        const embed = new Discord.MessageEmbed()
            .setColor(0xffa500) // Couleur orange
            .setTitle('⚠️ • Nouvelle convocation !')
            .setDescription(`<@${userId}>, vous êtes convoqué(e) par <@${commandUser.id}>`)
            .addFields(
                { name: 'Voici plus d\'informations :', value: `Tu devras être dans le salon vocal Salle d'attente le : ${date}` },
                { name: 'Note :', value: 'En cas d\'indisponibilité, veuillez contacter le staff du serveur via ticket support uniquement.' }
            )
            .setTimestamp();

        // Envoie l'embed en message privé à la personne convoquée
        try {
            await user.send({ embeds: [embed] });
        } catch (error) {
            console.log(`Impossible d'envoyer un MP à ${user.tag}.`);
        }

        // Envoie l'embed dans le salon mentionné
        await salon.send({ content: `<@${userId}>, vous êtes convoqué(e) dans le salon vocal le ${date}`, embeds: [embed] });

        // Confirme que la convocation a été envoyée
        message.reply(`Convocation envoyée à <@${userId}> et dans ${salon}.`);
    },
};
