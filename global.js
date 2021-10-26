const Discord = require("discord.js");
const globalChannels = [
    "900785840643530812",
    "896518442096668732",
    "885783368904609843" //UNAVIALEABLKE CHANNEL
]; //define an array of all channels which are a global channel
//could be a db too...

//THAT SHOULD BE IT!
// LETS TEST?!

module.exports = client => {
    //first some supportive buttons!
    let buttonrow = new Discord.MessageActionRow().addComponents([
        new Discord.MessageButton().setStyle("LINK").setURL("https://discord.gg/milrato").setLabel("Support Server"),
        new Discord.MessageButton().setStyle("LINK").setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`).setLabel("Invite me")
    ]);
    //now lets start!
    //by installing the npm modules!

    client.on("messageCreate", async message => {
        //return if a message is received from dms, or an invalid guild, or from a BOT!
        if(!message.guild || message.guild.available === false || message.author.bot) return;
        //if the current channel is a global channel:
        if( globalChannels.includes(message.channel.id) ){
            //the message sending data!
            const messageData = {
                embeds: [],
                components: [buttonrow],
                files: []
            };
            //define the embed for sending into the channels
            const embed = new Discord.MessageEmbed()
                .setColor("BLURPLE")
                .setAuthor(`${message.author.tag}`, message.member.displayAvatarURL({dynamic: true, size: 256}), "https://discord.gg/milrato")
                .setThumbnail(message.member.displayAvatarURL({dynamic: true, size: 256})) //message member could be the USER SERVER SPECIFIC AVATAR too!
                .setFooter(`${message.guild.name}・${message.guild.memberCount} Members`, message.guild.iconURL({dynamic: true, size: 256}))
                .setTimestamp()

            //if the user sends text, add the content to the EMBED - DESCRIPTION!
            if(message.content){
                embed.setDescription(`**Message:**\n>>> ${String(message.content).substr(0, 2000)}`)
            }
            //Now lets do the attachments!
            let url = "";
            let imagename = "UNKNOWN";
            if (message.attachments.size > 0) {
                if(message.attachments.every(attachIsImage)){
                    //Valid Image!!!
                    const attachment = new Discord.MessageAttachment(url, imagename);
                    messageData.files = [attachment]; // add the image file to the message of the BOT
                    embed.setImage(`attachment://${imagename}`); //add the image to the embed, so it's inside of it!
                }
            }
            //function to validate the messageattachment image!
            function attachIsImage(msgAttach){
                url = msgAttach.url;
                imagename = msgAttach.name || `UNKNOWN`;
                return url.indexOf("png", url.length - 3) !== -1 || url.indexOf("PNG", url.length - 3) !== -1 ||
                    url.indexOf("jpeg", url.length - 4) !== -1 || url.indexOf("JPEG", url.length - 4) !== -1 ||
                    url.indexOf("gif", url.length - 3) !== -1 || url.indexOf("GIF", url.length - 3) !== -1 ||
                    url.indexOf("webp", url.length - 3) !== -1 || url.indexOf("WEBP", url.length - 3) !== -1 ||
                    url.indexOf("webm", url.length - 3) !== -1 || url.indexOf("WEBM", url.length - 3) !== -1 ||
                    url.indexOf("jpg", url.length - 3) !== -1 || url.indexOf("JPG", url.length - 3) !== -1;
            }

            //we forgot to add the embed, soorrry

            messageData.embeds = [embed];

            //now its time for sending the message(s)
            //We need to pass in the message and the messageData (SORRY)
            sendallGlobal(message, messageData);
        
        }
    })
    //yes we made a mistake!
    //this function is for sending the messages in the global channels
    async function sendallGlobal(message, messageData) {
        message.react("🌐").catch(()=>{}); //react with a validate emoji;
        // message.delete().catch(()=>{}) // OR delete the message...
        //define a notincachechannels array;
        let notincachechannels = [];
        //send the message back in the same guild
        message.channel.send(messageData).then(msg => {
         //Here you could set database information for that message mapped for the message.author
        //so you can register message edits etc.
        }).catch((O) => {})

        //loop through all Channels:
        for (const chid of globalChannels){
            //get the channel in the cache
            let channel = client.channels.cache.get(chid);
            if(!channel){
                //if no channel found, continue... but wait! it could mean it is just not in the cache... so fetch it maybe?
                //yes later, first do all cached channels!
                notincachechannels.push(chid);
                continue;
            }
            if(channel.guild.id != message.guild.id){
                channel.send(messageData).then(msg => {
                    //Here you could set database information for that message mapped for the message.author
                    //so you can register message edits etc.
                }).catch((O) => {})
            }
        }
        
        //loop through all NOT CACHED Channels:
        for (const chid of notincachechannels){
            //get the channel in the cache
            let channel = await client.channels.fetch(chid).catch(()=>{
                //channel = false; // the channel will not exist, so maybe remove it from your db...
                console.log(`${chid} is not available!`)
            });
            if(!channel){
                continue;
            }
            if(channel.guild.id != message.guild.id){
                channel.send(messageData).then(msg => {
                    //Here you could set database information for that message mapped for the message.author
                    //so you can register message edits etc.
                }).catch((O) => {})
            }
        }
    }
}



/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
