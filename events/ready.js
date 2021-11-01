const db = require('../database/database.js');
const users = require('../models/users');
const schedule = require('node-schedule');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
        client.user.setActivity('LunariaAyaren', { type: 'WATCHING', url: 'https://www.twitch.tv/Lunaria' });
		console.log(`¡Bot listo! Loggeado como ${client.user.tag}`);
		db.authenticate()
        .then(() => {
			console.log('¡MySQL listo!');
			users.init(db); // initiates the table config
            users.sync(); //creates the table, if it doesn't already exist
			client.dbusers = users;
        })
		const scheduledCheck = schedule.scheduleJob('*/10 * * * *', function(){
			console.log('Sorting Ranking');
			
            async function save(){

				let sortedusers = await users.findAll({ order: [['score', 'DESC']] });

				sortedusers.sort((a, b) => b.balance - a.balance)
					.map( (user, position) => users.update( { rank:position }, { where: {discordid: user.discordid} } ) ) ;

			}

			save();

			});
	},
};