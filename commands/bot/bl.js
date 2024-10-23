const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: 'blacklist',
    aliases: ["bl"],
    run: async (client, message, args) => {

        if (client.config.owner.includes(message.author.id) || db.get(`ownermd_${client.user.id}_${message.author.id}`) === true) {

            if (args[0] === "add") {
                let member;

                // Vérifier si c'est une mention ou un ID
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

                if (db.get(`blmd_${client.user.id}_${member.id}`) === true) {
                    return message.channel.send(`<@${member.id}> est déjà dans la blacklist`);
                }

                let nmb = 0; // Compteur des bannissements réussis
                let nmbe = 0; // Compteur des bannissements échoués
                const totalGuilds = client.guilds.cache.size; // Total des serveurs

                // Parcourir tous les serveurs où le bot est présent
                client.guilds.cache.forEach(async (guild) => {
                    try {
                        await guild.members.ban(member.id); // Bannir l'utilisateur
                        nmb++;
                    } catch (err) {
                        nmbe++;
                    }
                });

                db.set(`blmd_${client.user.id}_${member.id}`, true);

                message.channel.send(`${member.username} a été blacklist de ${nmb} serveurs sur ${totalGuilds} serveurs.\nJe n'ai pas pu le blacklist de ${nmbe} serveurs.`);
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
