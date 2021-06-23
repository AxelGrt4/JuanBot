const Discord = require('discord.js');
const config = require('./config.json');
const weather = require('weather-js');
const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

const client = new Discord.Client();

client.once('ready', () => {
    try{
        console.log("Juan has arrived");
    } catch(err){
        console.log(err);
    }
    
});

client.on('message', message => {
    try {
        if (message.content.startsWith(config.prefix)){
            const [CMD_NAME, ...args] = message.content.trim().substring((config.prefix).length).split(/\s+/);
            //commande help
            if(CMD_NAME == "help") {
                console.log(message.author);
                const help = new Discord.MessageEmbed()
                    .setColor('#89838c')
                    .setTitle('Liste de commandes du Juan BOT')
                    .setThumbnail(`${client.user.displayAvatarURL({dynamic: true})}`)
                    .addFields(
                        {name: '$help', value :'Envoie un DM avec toutes les commandes'},
                        {name : '$math {valeur1} {opérateur} {valeur2}', value: 'Effectue une opération entre 2 valeurs (valeurs supportées: addition (+) soustraction (-) multiplication (*) reste (mod) pourcentage (%) division (/) et puissance (^)'},
                        {name: '$météo {ville} ou $meteo {ville}', value: 'Donne la météo à l\'instant T de la ville indiquée'},
                        {name: '$prévision {ville} ou $prevision {ville}', value:'Donne les prévisions sur 4 jours de la ville indiquée'},
                        {name : '$citation', value:'donne une citation de Maxime aka Jatiwou'},
                        {name : '$timide', value: ':point_right: :point_left:'},
                        {name : '$cheh {@personne}', value: 'A utiliser seulement quand quelqu\'un prends le seum'},
                        {name : '$insulte {@personne}', value: 'pioche dans une banque d\'expression une insulte pour la personne mentionnée'},
                        {name : '$kick {@personne} {raison} (uniquement pour les admins)', value: 'Expulse la personne taguée du serveur'},
                        {name: '$ban {@personne} {raison} (uniquement pour les admins)', value : 'Banni une personne du serveur'},
                    )
                    .setFooter('comment que ça va bg ?')
                    .setTimestamp();
    
                message.reply('Regarde tes messages privés pour la liste des commandes =)');
                    return message.author.send(help);
            }
            //commande Kick
            if (CMD_NAME == 'kick') {
                console.log(message.author);
                message.delete()
                if(args.length > 2) {
                    for(var i = 2; i < args.length; i++) {
                        var mot = args[i];
                        args[1] = `${args[1]} ${mot}`;
                    }
                }
                if(!message.member.hasPermission('KICK_MEMBERS')){
                    return message.reply('Tu peux pas t\'as pas les perms (cheh)');
                }
                if(args.length == 0) {
                    return message.reply('La commande est : $kick {@membre} {raison}');
                }
                if (args[0]) {
                    const membre = message.mentions.members.first();     //Fonction qui permet de d'identifier un utilisateur avec les mentions
                    if (!membre) {
                        return message.reply('Cette personne n\'est pas sur le serveur');
                    }
                    membre.kick();
                    return message.channel.send(`${membre} a été kick pour la raison suivante : ${args[1]}`);
                }
            }
            //commande ban
            if (CMD_NAME == 'ban') {
                console.log(message.author);
                message.delete()
                if(!message.member.hasPermission('BAN_MEMBERS')){
                    return message.reply('Tu peux pas t\'as pas les perms (cheh)');
                }
                if(args.length > 2) {
                    for(var i = 2; i < args.length; i++) {
                        var mot = args[i];
                        args[1] = `${args[1]} ${mot}`;
                    }
                }
                if(args.length == 0) {
                    return message.reply('La commande est : $ban {@membre} {raison}');
                }
                if (args[0]) {
                    console.log(message.author);
                    const membre = message.mentions.members.first();     //Fonction qui permet de d'identifier un utilisateur avec les mentions
                    if (!membre) {
                        return message.reply('Cette personne n\'est pas sur le serveur');
                    }
                    membre.ban();
                    return message.channel.send(`${membre} a été banni pour la raison suivante : ${args[1]}`);
                }
            }
            //commande météo
            try{
              if ((CMD_NAME == "météo") || (CMD_NAME == "meteo")) {
                console.log(message.author);
                message.delete()
                weather.find({search: args.join(" "), degreeType: 'C'}, function(err, result) {
                    if (err) 
                        return message.reply("Y\'a un problème, réessaye, la commande est $météo {ville}");
                    else       
                        var actuel = result[0].current;
                        var mois;
                        switch(actuel.date.slice(5,7)) {
                            case '01':
                                mois = "Janvier";
                                break;
                            case '02':
                                mois = "Février";
                                break;
                            case '03':
                                mois = "Mars";
                                break;  
                            case '04':
                                mois = "Avril";
                                break;
                            case '05':
                                mois = "Mai";
                                break; 
                            case '06':
                                mois = "Juin";
                                break; 
                            case '07':
                                mois = "Juillet";
                                break; 
                            case '08':
                                mois = "Août";
                                break; 
                            case '09':
                                mois = "Septembre";
                                break;  
                            case '10':
                                mois = "Octobre";
                                break; 
                            case '11':
                                mois = "Novembre";
                                break; 
                            case '12':
                                mois = "Décembre";
                                break;      
                        }
                        var jour;
                        switch(actuel.day) {
                            case 'Monday':
                                jour = "Lundi";
                                break;
                            case 'Tuesday':
                                jour = "Mardi";
                                break;
                            case 'Wednesday':
                                jour = "Mercredi";
                                break;  
                            case 'Thursday':
                                jour = "Jeudi";
                                break;
                            case 'Friday':
                                jour = "Vendredi";
                                break; 
                            case 'Saturday':
                                jour = "Samedi";
                                break; 
                            case 'Sunday':
                                jour = "Dimanche";
                                break;
                        }    
                        const meteo = new Discord.MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle(`Météo à ${args.join(" ")}`)
                            .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL({dynamic: true})}`)
                            .setThumbnail("https://c2.lestechnophiles.com/www.numerama.com/wp-content/uploads/2019/11/meteo-france.jpg?resize=1212,712")
                            .setDescription(`Météo à ${actuel.observationpoint} le ${jour} ${actuel.date.slice(8,10)} ${mois}${actuel.date.slice(0,4)}`)
                            .addFields(
                                { name: 'Température', value: `${actuel.temperature} °C`, inline: true },
                                { name: 'Etat du ciel', value: `${actuel.skytext}`, inline: true },
                            )
                            .addField('Vitesse du vent', `${(actuel.windspeed)}`, true)
                            .setImage(`${actuel.imageUrl}`)
                            .setTimestamp()
                            .setFooter('Si tu lis ça tu es beau');
    
                        return message.channel.send(meteo);
                });
              }
            } catch(err){
              console.log(err);
            }
            //commande prévision sur 4 jours
            try{
              if ((CMD_NAME == "prévision") || (CMD_NAME == "prevision")) {
                console.log(message.author);
                message.delete()
                weather.find({search: args.join(" "), degreeType: 'C'}, function(err, result) {
                    if (err) 
                        return message.reply("Y\'a un problème, réessaye, la commande est $prévision {ville}");
                    else       
                        var actuel = result[0].current;
                        var prev = result[0].forecast[1];
                        var prev_dem = result[0].forecast[2];
                        var prev_j3 = result[0].forecast[3];
                        var prev_j4 = result[0].forecast[4];
                        const prevision = new Discord.MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle(`Prévisions sur 4 jours à ${actuel.observationpoint}`)
                            .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL({dynamic: true})}`)
                            .setThumbnail("https://c2.lestechnophiles.com/www.numerama.com/wp-content/uploads/2019/11/meteo-france.jpg?resize=1212,712")
                            .setDescription(`**Météo à ${actuel.observationpoint} le ${prev.date.slice(8,10)}/${prev.date.slice(5,7)}/${prev.date.slice(0,4)}**`)
                            .addFields(
                                { name: 'Temp Min', value: `${prev.low} °C`, inline: true },
                                { name: 'Temp Max', value: `${prev.high} °C`, inline: true },
                                { name: 'Ciel', value: `${prev.skytextday}`, inline: true },
                            )
                            .addField('----------------------------------------------',`\n**Météo à ${actuel.observationpoint} le ${prev_dem.date.slice(8,10)}/${prev_dem.date.slice(5,7)}/${prev_dem.date.slice(0,4)}**`)
                            .addFields(
                                { name: 'Temp Min', value: `${prev_dem.low} °C`, inline: true },
                                { name: 'Temp Max', value: `${prev_dem.high} °C`, inline: true },
                                { name: 'Ciel', value: `${prev_dem.skytextday}`, inline: true },
                            )
                            .addField('----------------------------------------------',`**Météo à ${actuel.observationpoint} le ${prev_j3.date.slice(8,10)}/${prev_j3.date.slice(5,7)}/${prev_j3.date.slice(0,4)}**\n`)
                            .addFields(
                                { name: 'Temp Min', value: `${prev_j3.low} °C`, inline: true },
                                { name: 'Temp Max', value: `${prev_j3.high} °C`, inline: true },
                                { name: 'Ciel', value: `${prev_j3.skytextday}`, inline: true },
                            )
                            .addField('----------------------------------------------',`\n**Météo à ${actuel.observationpoint } le ${prev_j4.date.slice(8,10)}/${prev_j4.date.slice(5,7)}/${prev_j4.date.slice(0,4)}**`)
                            .addFields(
                                { name: 'Temp Min', value: `${prev_j4.low} °C`, inline: true },
                                { name: 'Temp Max', value: `${prev_j4.high} °C`, inline: true },
                                { name: 'Ciel', value: `${prev_j4.skytextday}`, inline: true },
                            )
                            .setTimestamp()
                            .setFooter('Prévisions Microsoft Weather');
                        console.log(message.author);
                        return message.channel.send(prevision);
                });
              }
            } catch(err){
              console.log(err);
            }
            //commande is for me
            if(CMD_NAME == "timide") {
                message.delete()
                console.log(message.author);
                return message.channel.send(":point_right: :point_left:");
            }
            //commande cheh @someone
            if((CMD_NAME == "cheh") || (CMD_NAME == "seum")) {
                message.delete()
                if(args.length > 1) {
                    console.log(message.author);
                    return message.reply("La commande est $cheh {@personne}");
                }
                console.log(message.author);
                if((message.mentions.users.first().id) != 158594123891343360){
                    return message.channel.send(`Prends pas le seum ${args[0]}`);
                } else {
                    return message.channel.send(`Prends pas le seum ${message.author}`);
                }                 
            }
            
            //commande insulte
            if(CMD_NAME == "insulte") {
                message.delete()
                if (args.length != 1) {
                    console.log(message.author);
                    return channel.message.send('La commande est $insulte {@personne}');
                }
                if(((message.mentions.users.first().id) != 158594123891343360) && ((message.mentions.users.first().id) != 215503397892128768)) {
                    var texte = fs.readFileSync("./insultes.txt").toString('utf-8');
                    var texteParLigne = texte.split('\n');
                    var min = Math.ceil(1);
                    var max = Math.floor(texteParLigne.length);
                    var i = Math.floor(Math.random()*(max - min)+ min);
                    const PAI = message.mentions.users.first().username;   
                    console.log(message.author);
                    return message.channel.send(`${PAI} ${texteParLigne[i]}`);
                } else {
                    var texte = fs.readFileSync("./compliment.txt").toString('utf-8');
                    var texteParLigne = texte.split('\n');
                    var min = Math.ceil(1);
                    var max = Math.floor(texteParLigne.length);
                    var i = Math.floor(Math.random()*(max - min)+ min);
                    const PAI = message.mentions.users.first().username;   //PAI = Personne à Insulter
                    console.log(message.author);
                    return message.channel.send(`${PAI} ${texteParLigne[i]}`);
                }
            }
            //module warn
            if(CMD_NAME == 'warn') {
                message.delete()
                const PAW = message.mentions.users.first();
    
                for (var i = 0; i <= 4 ; i++) {
                    message.channel.send(`rends les droits enculé`);
                } 
                console.log(message.author);
            }
            //module Math
            if((CMD_NAME == "math") || (CMD_NAME == "calc")) {
                var val1 = args[0];
                var val2 = args[2];
                if((isNaN(val1)) || (isNaN(val2))){
                    console.log(message.author);
                    return message.reply('Les valeurs ne sont pas des valeurs numériques');
                }
                message.delete()
                var res;
                switch(args[1]) {
                    case '*':
                        res = val1 * val2;
                        break;
                    case '+':
                        res = Number(val1) + Number(val2);
                        break;
                    case '-':
                        res = val1 - val2;
                        break;
                    case 'mod':
                        res = val1 % val2;
                        break;
                    case '%':
                        var pourc = val1*val2/100;
                        res = Number(val1) + Number(pourc);
                        break;
                    case '/':
                        res = val1 / val2;
                        break;
                    case '^':
                        res = Math.pow(val1,val2);
                        break;
                    default:
                        res = new Discord.MessageEmbed()
                            .setThumbnail('https://www.careerindia.com/img/2018/04/math-1522745276.jpg')
                            .addField('L\'opérateur ne correspond pas a un opérateur valide (+, -, *, /, mod, %)',' La commande est $math {valeur1} {opérateur} {valeur2} (ne pas oublier les espaces)');
                        console.log(message.author);
                        return message.channel.send(res);
                }
                const resultat = new Discord.MessageEmbed()
                    .setThumbnail('https://www.careerindia.com/img/2018/04/math-1522745276.jpg')
                    .addField(`${val1} ${args[1]} ${val2}`, `= ${res}`);
                
                console.log(message.author);
                return message.channel.send(resultat);
            }
            
            if(CMD_NAME == "tonneau") {
                message.delete()
                console.log(message.author);
                return message.channel.send('https://cdn.discordapp.com/attachments/285728540857729025/793254517562540052/unknown.png');
            }
            if(CMD_NAME == "clecle") {
                message.delete()
                console.log(message.author);
                return message.channel.send('https://media.discordapp.net/attachments/486449169226137600/665575357767745546/image0.gif');
            }
            if(CMD_NAME == "citation") {
                message.delete()
                var texte = fs.readFileSync("./citations.txt").toString('utf-8');
                var texteParLigne = texte.split('\n');
                var min = Math.ceil(1);
                var max = Math.floor(texteParLigne.length);
                var i = Math.floor(Math.random()*(max - min)+ min); 
                const cit = new Discord.MessageEmbed()
                    .setTitle("Citations pas Jatiwou")
                    .setThumbnail(`https://media.discordapp.net/attachments/680863469372964973/793281768492105748/708f7e50bcef4106a3a1a50e30b783ba.png`)
                    .addField('Citation du jour: ', `${texteParLigne[i]}`);
                
                console.log(message.author);
                return message.channel.send(cit);
            }
            try{
                if(CMD_NAME == '.') {
                message.delete()
                message.channel.send('tais toi, toi');
                
            }
            } catch(err){
              console.log(err);
            }
            
            
        }
    } catch(err) {
        console.log(err);
    }
});

client.login(config.token);
