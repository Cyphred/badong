module.exports = {
	name: 'minecraft-server-status',
	description: "Queries the Minecraft server's status.",
	execute (message, config, ip) {
		const util = require('minecraft-server-util');
		const Discord = require('discord.js');

		const ADDRESS = config.minecraft_server_address;
		const PORT = parseInt(config.minecraft_server_port);

		var embed = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setDescription('Fetching server data...')
			.setTimestamp();

		function main() {
			//message.channel.send('<:yagoosad:741183209605300264> Server status checking is currently being worked on.');
			//return;
			util.status(ADDRESS)
				.then((result) => {
					promptServerOnline(result);
				})
				.catch((error) => {
					promptServerOffline();
					console.error(error);
				});

			message.channel.send(embed).then (async (msg) =>{
				msg.delete();
			});
		}

		/**
		 * Called if the server is online.
		 * This modifies the embed object to bear the server's info.
		 *
		 * @param server_info is the object containing the server's information.
		 */
		function promptServerOnline(server_info) {
			// Decode base64 into buffer.
			const sfbuff = new Buffer.from(server_info.favicon.split(",")[1], "base64");

			// Attach decoded image to message.
			const sfattach = new Discord.MessageAttachment(sfbuff, "server-icon.png");

			// Determine the number of players
			var online_players = `${server_info.onlinePlayers}/${server_info.maxPlayers}`;

			// Re-create the embed.
			embed = new Discord.MessageEmbed()
				.setColor('#00E658') // Bright green color
				.setTitle('Minecraft Server Status')
				.addFields(
					{ name: 'Server Name', value: server_info.description.descriptionText },
					{ name: 'ngrok IP', value: ip },
					{ name: 'Active Status', value: '🟢 Online' },
					{ name: 'Version', value: server_info.version, inline: true },
					{ name: 'Players Online', value: server_info.onlinePlayers, inline: true },
				)
				.attachFiles(sfattach)
				.setImage('attachment://server-icon.png')
				.setTimestamp();
			message.channel.send(embed);
		}

		/**
		 * Called if the server is offline.
		 * This modifies the embed object to inform the user that the
		 * server is offline.
		 */
		function promptServerOffline() {
			embed = new Discord.MessageEmbed()
				.setTitle('Minecraft Server Status')
				.setColor('#E60C00')
				.addField('Active Status', '🔴 Offline', true)
				.setTimestamp();
			message.channel.send(embed);
		}

		main(); // Call main function
	}
}
