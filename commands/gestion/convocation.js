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

        // Création de l'embed de convocation
        const convocationEmbed = new Discord.MessageEmbed()
            .setTitle('📋 Convocation Officielle')
            .setColor('#00aaff')
            .addField('👤 Convoqué(e)', `${user.tag}`, true)
            .addField('📅 Date', date, true)
            .addField('⏰ Heure', time, true)
            .addField('📍 Lieu', location)
            .setFooter(`Convocation envoyée par ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));

        try {
            // Envoi du message avec mention de l'utilisateur et embed
            await message.channel.send({
                content: `<@${user.id}>`,
                embeds: [convocationEmbed]
            });
        } catch (err) {
            console.error(err);
            message.channel.send("Une erreur est survenue lors de l'envoi de la convocation.");
        }
    }
};
