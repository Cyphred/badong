module.exports = {
	name: 'minecraft-server-status',
	description: "Commands for the Minecraft server.",
	execute (message, args, config, util) {
		const Discord = require('discord.js');
		const SERVER_ADDRESS = config.minecraft_server_address;
		const SERVER_PORT = parseInt(config.minecraft_server_port);

		var embed = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setDescription('Fetching server data...')
			.setTimestamp();

		function serverOnline(server_info) {
			const sfbuff = new Buffer.from(server_info.favicon.split(",")[1], "base64");
			const sfattach = new Discord.MessageAttachment(sfbuff, "output.png");
			embed = new Discord.MessageEmbed();
			embed.setTitle('Minecraft Server Status');
			embed.setColor('#00E658');
			embed.addField('Server Name', server_info.description.text);
			embed.addField('Active Status', '🟢 Online');
			embed.addField('Version', server_info.version.name, true);
			var online_players = `${server_info.players.online}/${server_info.players.max}`;
			embed.addField('Players Online', online_players, true);
			embed.attachFiles(sfattach);
			embed.setImage('attachment://output.png');
			embed.setTimestamp();
			message.channel.send(embed);
		}

		function serverOffline() {
			embed = new Discord.MessageEmbed();
			embed.setTitle('Minecraft Server Status');
			embed.setColor('#E60C00');
			embed.addField('Active Status', '🔴 Offline', true);
			embed.setTimestamp();
			message.channel.send(embed);
		}

		function query() {
			util.status(SERVER_ADDRESS)
				.then((result) => {
					serverOnline(result.rawResponse);
				})
				.catch((error) => {
					serverOffline();
					console.error(error);
				});
		}

		switch (args[0]) {
			case 'status':
				query();
				message.channel.send(embed).then (async (msg) =>{
					msg.delete();
				});

				break;
		}
	}
}
