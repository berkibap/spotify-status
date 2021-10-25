const Discord = require('discord.js');
const client = new Discord.Client({intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_PRESENCES, Discord.Intents.FLAGS.GUILD_MEMBERS]});
const {getLyrics} = require('genius-lyrics-api');
const config = require('./config.json')
const _ = require('underscore');

const options = {
	apiKey: config.genius_api_key,
	title: '',
	artist: '',
	optimizeQuery: true
};

let lyrics = (song, artist, user) => {
    options.title = song;
    options.artist = artist;
    let lyr = [];
    getLyrics(options).then(lyrics => {
        
        let lines = lyrics.split(/\r?\n/)
        lines.forEach(line => {
            if(!(line.startsWith("[") && line.endsWith("]"))) {
                lyr.push(line);
            }
        })
        let random = _.sample(lyr); 
        console.log(`Now setting status to: "${random}"`)
        user.setActivity({name: random.toLowerCase()})
    }).catch(e => {
        console.log("error", e);
    })

}

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
    let user = client.guilds.cache.get(config.server_id).members.cache.get(config.user_id)
    setInterval(() => {
        user.presence.activities.forEach(activity => {
            if(activity.name.toLowerCase() == "spotify") {
                lyrics(activity.details, activity.state, client.user);
            }
        });
    }, 10 * 1000);
 
});

client.login(config.bot_token);