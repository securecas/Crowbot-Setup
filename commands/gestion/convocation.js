const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: 'convocation',
    aliases: ['rdv', 'rendezvous'],
    run: async (client, message, args) => {
        if (!client.config.owner.includes(message.author.id) && db.get(`ownermd_${client.user.id}_${message.author.id}`) !== true) {
            return message.channel.send("Vous n'avez pas les permissions pour exécuter cette commande.");
        }

        if (args.length < 4) {
            return message.channel.send("Usage : `+convocation ID_utilisateur date heure lieu`");
        }

        const userID = args[0];
        const date = args[1];
        const time = args[2];
        const location = args.slice(3).join(' ');

        let user;
        try {
            user = await client.users.fetch(userID);
        } catch (err) {
            return message.channel.send(`Aucun utilisateur trouvé pour \`${userID}\``);
        }

        if (!user) {
            return message.channel.send(`Aucun utilisateur trouvé pour \`${userID}\``);
        }

        // Création de l'embed de convocation
        const convocationEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff') // Couleur personnalisée pour l'embed
            .setTitle('Convocation')
            .setThumbnail(message.client.user.displayAvatarURL()) // Icône avec l'avatar du bot
            .addField('Utilisateur', `<@${user.id}>`, true) // Ping utilisateur sans embed
            .addField('Date', date, true)
            .addField('Heure', time, true)
            .addField('Lieu', location)
            .setFooter(`Demandé par ${message.author.tag}`, message.author.displayAvatarURL())
            .setTimestamp();

        try {
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
