const Discord = require('discord.js');
const db = require('quick.db');
const {
    MessageActionRow,
    MessageButton,
} = require('discord-buttons');

module.exports = {
    name: 'blacklist',
    aliases: ["bl"],
    run: async (client, message, args, prefix, color) => {

        if (client.config.owner.includes(message.author.id) || db.get(`ownermd_${client.user.id}_${message.author.id}`) === true) {

            // Ajout à la blacklist
            if (args[0] === "add") {
                let member;

                // Vérifier si l'utilisateur est mentionné ou si l'ID est donné
                if (message.mentions.users.first()) {
                    member = message.mentions.users.first();
                } else if (args[1] && client.users.cache.get(args[1])) {
                    member = client.users.cache.get(args[1]);
                }

                if (!member) {
                    return message.channel.send(`Aucun membre trouvé pour \`${args[1] || "rien"}\``);
                }

                if (db.get(`blmd_${client.user.id}_${member.id}`) === true) {
                    return message.channel.send(`<@${member.id}> est déjà dans la blacklist`);
                }

                let nmb = 0;
                let nmbe = 0;

                client.guilds.cache.forEach(g => {
                    if (g.members.cache.get(member.id)) {
                        g.members.cache.get(member.id).ban()
                            .then(() => nmb++)
                            .catch(err => nmbe++);
                    }
                });

                db.set(`blmd_${client.user.id}_${member.id}`, true);

                message.channel.send(`**${member.username}** a été ajouté à la blacklist.\nIl a été **ban** de **${nmb}** serveur(s)\nJe n'ai pas pu le **ban** de ${nmbe} serveur(s)`);
            }

            // Suppression de la blacklist
            else if (args[0] === "remove") {
                let member;

                if (message.mentions.users.first()) {
                    member = message.mentions.users.first();
                } else if (args[1] && client.users.cache.get(args[1])) {
                    member = client.users.cache.get(args[1]);
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

            // Actualisation de la blacklist toutes les 2 heures
            setInterval(async () => {
                let blacklisted = db.all().filter(data => data.ID.startsWith(`blmd_${client.user.id}`));

                blacklisted.forEach(entry => {
                    let memberID = entry.ID.split('_')[2];
                    client.guilds.cache.forEach(guild => {
                        let member = guild.members.cache.get(memberID);
                        if (member) {
                            member.ban().catch(err => console.log(`Impossible de bannir ${memberID} dans le serveur ${guild.name}`));
                        }
                    });
                });
            }, 2 * 60 * 60 * 1000); // toutes les 2 heures

            // Clear de la blacklist
            if (args[0] === "clear") {
                let tt = await db.all().filter(data => data.ID.startsWith(`blmd_${client.user.id}`));
                message.channel.send(`${tt.length === undefined || null ? 0 : tt.length} personne(s) ont été supprimées de la blacklist`);

                for (let i = 0; i < tt.length; i++) {
                    db.delete(tt[i].ID);
                }
            }

            // Affichage de la liste des utilisateurs blacklistés
            else if (args[0] === "list") {
                let blacklisted = db.all().filter(data => data.ID.startsWith(`blmd_${client.user.id}`));
                let description = blacklisted.map((entry, index) => `${index + 1}) <@${entry.ID.split('_')[2]}>`).join("\n");

                const embed = new Discord.MessageEmbed()
                    .setTitle('Blacklist')
                    .setDescription(description)
                    .setColor(color);

                message.channel.send(embed);
            }
        }
    }
};
