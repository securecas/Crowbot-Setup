    const Discord = require('discord.js');
    const db = require('quick.db');
    
    module.exports = {
        name: 'convocation',
        usage: 'convocation <@user> <raison> <date> <#lieu>',
        aliases: [],
    
        run: async (client, message, args, prefix, color) => {
            // Vérification des permissions de l'utilisateur
            let perm = "";
            message.member.roles.cache.forEach(role => {
                if (db.get(`admin_${message.guild.id}_${role.id}`)) perm = null;
                if (db.get(`ownerp_${message.guild.id}_${role.id}`)) perm = true;
            });
    
            if (client.config.owner.includes(message.author.id) || db.get(`ownermd_${client.user.id}_${message.author.id}`) === true || perm) {
                // Vérification de l'utilisateur à convoquer et des informations de convocation
                const userToConvocate = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
                if (!userToConvocate) return message.channel.send("Veuillez mentionner un utilisateur valide à convoquer.");
    
                // Extraction des informations de la convocation
                const raison = args[1];
                const date = args[2];
                const lieuId = args[3]?.replace(/[<#>]/g, ''); // Nettoie l'ID du salon
    
                if (!raison || !date || !lieuId) {
                    return message.channel.send("Format incorrect. <@user> <raison> <date> <#lieu>");
                }
    
                // Création de l'embed de convocation
                const embed = new Discord.MessageEmbed()
                    .setColor("#fffff")
                    .setTitle("🔔 · Nouvelle Convocation")
                    .setDescription(`Vous êtes **convoqué** par <@${message.author.id}>. Voici **quelques informations supplémentaires sur votre convocation** :\n\n> **Raison :** ${raison}\n> **Date :** ${date}\n> **Lieu :** <#${lieuId}>\n\nEn cas **d’indisponibilité**, veuillez contacter le staff du serveur via ticket support **uniquement**.`);
    
                // Envoi de l'embed de convocation
                message.channel.send({ 
                    content: `${userToConvocate}`, 
                    embeds: [embed] 
                }).then(() => {
                    // Message de confirmation envoyé à l'auteur de la commande
                    message.channel.send("La convocation a bien été envoyée.")
                });
            } else {
                message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.");
            }
        }
    };
    
