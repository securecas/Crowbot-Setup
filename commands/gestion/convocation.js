const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: 'convocation',
    aliases: ['rendezvous', 'rdv'],
    run: async (client, message, args) => {
        // Vérification des permissions
        if (!client.config.owner.includes(message.author.id) && db.get(`ownermd_${client.user.id}_${message.author.id}`) !== true) {
            return message.channel.send("Vous n'avez pas les permissions pour exécuter cette commande.");
        }

        // Vérification des arguments
        if (args.length < 4) {
            return message.channel.send("Usage : `+convocation ID_utilisateur date heure lieu`");
        }

        // Récupération des informations
        const userID = args[0];
        const date = args[1];
        const time = args[2];
        const location = args.slice(3).join(' ');

        let user;
        try {
            // Récupérer l'utilisateur par ID
            user = await client.users.fetch(userID);
        } catch (err) {
            return message.channel.send(`Aucun utilisateur trouvé pour \`${userID}\``);
        }

        if (!user) {
            return message.channel.send(`Aucun utilisateur trouvé pour \`${userID}\``);
        }

        // Création de l'embed avec une approche alternative
        const convocationEmbed = new Discord.MessageEmbed();
        convocationEmbed.setTitle('📋 Convocation Officielle');
        convocationEmbed.setColor('#00aaff');
        convocationEmbed.addFields(
            { name: '👤 Convoqué(e)', value: `${user.tag}`, inline: true },
            { name: '📅 Date', value: date, inline: true },
            { name: '⏰ Heure', value: time, inline: true },
            { name: '📍 Lieu', value: location }
        );
        convocationEmbed.setFooter({
            text: `Convocation envoyée par ${message.author.tag}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
        });

        try {
            // Envoyer la mention et l'embed
            await message.channel.send({
                content: `<@${user.id}>`, // Mentionner l'utilisateur
                embeds: [convocationEmbed], // Envoyer l'embed
            });
        } catch (err) {
            console.error(err);
            message.channel.send("Une erreur est survenue lors de l'envoi de la convocation.");
        }
    },
};
