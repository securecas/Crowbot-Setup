const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: 'blacklist',
    aliases: ["bl"],
    run: async (client, message, args) => {

        if (client.config.owner.includes(message.author.id) || db.get(`ownermd_${client.user.id}_${message.author.id}`) === true) {

            if (args[0] === "add") {
                let member;

                // Vérification si mention ou ID
                if (message.mentions.users.first()) {
                    member = message.mentions.users.first();
                } else if (args[1]) {
                    try {
                        member = await client.users.fetch(args[1]); // Récupérer l'utilisateur par ID
                    } catch (err) {
                        return message.channel.send(`Aucun membre trouvé pour \`${args[1] || "rien"}\``);
                    }
                }

                if (!member) {
                    return message.channel.send(`Aucun membre trouvé pour \`${args[1] || "rien"}\``);
                }

                if (db.get(`blmd_${client.user.id}_${member.id}`) === true) {
                    return message.channel.send(`<@${member.id}> est déjà dans la blacklist`);
                }

                let successfulBans = 0; // Compteur des bans réussis
                let failedBans = 0; // Compteur des bans échoués
                const totalGuilds = client.guilds.cache.size; // Nombre total de serveurs

                // Parcourir tous les serveurs où le bot est présent
                await Promise.all(client.guilds.cache.map(async (guild) => {
                    try {
                        await guild.members.ban(member.id, { reason: 'Blacklist' }); // Forcer le ban par ID
                        successfulBans++; // Incrémenter si succès
                    } catch (err) {
                        failedBans++; // Incrémenter si échec
                    }
                }));

                // Ajouter l'utilisateur à la blacklist
                db.set(`blmd_${client.user.id}_${member.id}`, true);

                // Envoyer le message formaté avec les bons compteurs
                message.channel.send(`${member.tag} a été blacklist de **${successfulBans}** serveurs sur **${totalGuilds}** serveurs.\nJe n'ai pas pu le blacklist de **${failedBans}** serveurs.`);
            }

            // Suppression de la blacklist
            else if (args[0] === "remove") {
                let member;

                if (message.mentions.users.first()) {
                    member = message.mentions.users.first();
                } else if (args[1]) {
                    try {
                        member = await client.users.fetch(args[1]);
                    } catch (err) {
                        return message.channel.send(`Aucun membre trouvé pour \`${args[1] || "rien"}\``);
                    }
                }

                if (!member) {
                    return message.channel.send(`Aucun membre trouvé pour \`${args[1] || "rien"}\``);
                }

                if (db.get(`blmd_${client.user.id}_${member.id}`) === null) {
                    return message.channel.send(`<@${member.id}> n'est pas dans la blacklist`);
                }

                db.delete(`blmd_${client.user.id}_${member.id}`);
                message.channel.send(`<@${member.id}> n'est plus dans la blacklist`);
            }
        }
    }
};
