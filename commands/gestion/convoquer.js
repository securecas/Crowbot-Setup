const Discord = require("discord.js");
const db = require("quick.db");
const owner = new db.table("Owner");
const cl = new db.table("Color");
const config = require("../config.js");
const footer = config.app.footer;

module.exports = {
    name: 'convocation',
    usage: 'convocation <@user> <raison> <date> <lieu>',
    description: "Permet d'envoyer une convocation dans un salon spécifique",
    async execute(client, message, args) {
        if (owner.get(`owners.${message.author.id}`) || config.app.owners.includes(message.author.id)) {

            let color = cl.fetch(`color_${message.guild.id}`);
            if (color == null) color = config.app.color;

            // ID du salon où la convocation sera envoyée (remplacez par l'ID correct)
            const salonId = '1283837047500705913'; // Remplacez par l'ID du salon
            const salon = client.channels.cache.get(salonId);
            if (!salon || salon.type !== 'GUILD_TEXT') return message.channel.send("Salon non trouvé ou ce n'est pas un salon textuel.");

            if (args.length >= 4) {
                try {
                    const mentionUser = args[0].replace(/[<@!>]/g, ''); // Identifiant de l'utilisateur mentionné
                    const raison = args[1];  // Raison de la convocation
                    const date = args[2];    // Date de la convocation
                    const lieuId = args[3].replace(/[<@!#>]/g, '');  // ID du salon pour la convocation

                    const user = await client.users.fetch(mentionUser);
                    const lieu = client.channels.cache.get(lieuId); // Obtient le salon mentionné
                    if (!user) return message.channel.send("Utilisateur introuvable.");
                    if (!lieu) return message.channel.send("Le lieu (salon) est introuvable.");

                    const embed = new Discord.MessageEmbed()
                        .setColor(color)
                        .setTitle("🔔 ·  Nouvelle Convocation")
                        .setDescription(`Vous êtes **convoqué** par <@${message.author.id}>. Voici **quelques informations supplémentaires sur votre convocation** :\n \n> **Raison :** ${raison}\n> **Date :** ${date}\n> **Lieu :** <#${lieuId}>\n\nEn cas **d’indisponibilité**, veuillez contacter le staff du serveur via ticket support **uniquement**.`)

                    let messageContent = `<@${mentionUser}>`;
                    salon.send({ content: messageContent, embeds: [embed] }).then(() => {
                        message.channel.send({ content: `La convocation a été envoyée à <@${mentionUser}> dans le salon <#${salonId}>.`, ephemeral: true });
                    }).catch(err => {
                        console.error(err);
                        message.channel.send({ content: "Impossible d'envoyer la convocation dans le salon spécifié.", ephemeral: true });
                    });

                } catch (error) {
                    console.error(error);
                    message.channel.send({ content: "Une erreur s'est produite lors de l'envoi de la convocation.", ephemeral: true });
                }

            } else {
                message.channel.send({ content: "Utilisation incorrecte. Format : `convocation <@user> <raison> <date> <lieu>`", ephemeral: true });
            }
        }
    }
};
