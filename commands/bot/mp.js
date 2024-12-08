const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: 'mp',
    aliases: ['messageprive', 'dm'],
    run: async (client, message, args) => {
        // Vérification si l'utilisateur a le droit d'exécuter la commande
        if (!client.config.owner.includes(message.author.id) && db.get(`ownermd_${client.user.id}_${message.author.id}`) !== true) {
            return message.channel.send("Vous n'avez pas les permissions pour exécuter cette commande.");
        }

        // Vérifier si l'ID de l'utilisateur et le message sont fournis
        if (!args[0] || !args[1]) {
            return message.channel.send("Usage : `+mp ID_utilisateur message_à_envoyer`");
        }

        let user;
        try {
            // Récupérer l'utilisateur par ID
            user = await client.users.fetch(args[0]);
        } catch (err) {
            return message.channel.send(`Aucun utilisateur trouvé pour \`${args[0] || "rien"}\``);
        }

        if (!user) {
            return message.channel.send(`Aucun utilisateur trouvé pour \`${args[0] || "rien"}\``);
        }

        // Créer le message à envoyer
        const dmMessage = args.slice(1).join(' ');

        try {
            // Envoyer le message privé
            await user.send(dmMessage);
            message.channel.send(`Message envoyé à <@${user.id}> : "${dmMessage}"`);
        } catch (err) {
            console.error(err);
            message.channel.send(`Je n'ai pas pu envoyer le message à <@${user.id}>.`);
        }
    }
};
