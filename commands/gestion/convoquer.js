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
    run: async (client, message, args) => {
        if (!args[0] || !args[1] || !args[2] || !message.mentions.channels.first()) {
            return message.reply('Merci de fournir tous les arguments : `+convoquer <IdDiscord> <motif> <date-et-heure> <#salon>`');
        }

        const userId = args[0];
        const motif = args[1];
        const date = args[2];
        const salon = message.mentions.channels.first();
        const user = await client.users.fetch(userId);

        if (!user) {
            return message.reply('Utilisateur introuvable !');
        }

        const commandUser = message.author;

        const embed = new Discord.MessageEmbed()
            .setColor(0xffa500)
            .setTitle('⚠️ • Nouvelle convocation !')
            .setDescription(`<@${userId}>, vous êtes convoqué(e) par <@${commandUser.id}>`)
            .addFields(
                { name: 'Motif', value: motif },
                { name: 'Date et heure', value: date },
                { name: 'Lieu', value: `Tu devras être dans le salon vocal ${salon} à cette date.` }
            )
            .addField('Note', 'En cas d\'indisponibilité, veuillez contacter le staff du serveur via ticket support uniquement.')
            .setTimestamp();

        try {
            // Envoi du message en MP
            await user.send({ embeds: [embed] });
        } catch (error) {
            console.log(`Impossible d'envoyer un MP à ${user.tag}.`);
        }

        // Envoi du message dans le salon mentionné
        await salon.send({ content: `<@${userId}>, vous êtes convoqué(e) dans le salon vocal le ${date}`, embeds: [embed] });

        // Confirmation que le message a été envoyé
        message.reply(`Convocation envoyée à <@${userId}> et dans ${salon}.`);
    },
};
