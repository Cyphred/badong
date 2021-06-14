module.exports = {
	name: 'minecraft-server-status',
	description: "Commands for the Minecraft server.",
	execute (message, args, config, util) {
		const SERVER_ADDRESS = config.minecraft_server_address;
		const SERVER_PORT = parseInt(config.minecraft_server_port);
		const cacheTime = 15 * 1000; // 15 sec cache time
		let data, lastUpdated = 0;

		const STATUS_ERROR = '🔴 Server is **Offline**';
		const STATUS_ONLINE = '🟢 Server is **Online**  -  ';
		const STATUS_PLAYERS = '**{online}** players are playing right now.';
		const STATUS_EMPTY = 'Nobody is playing';

		function statusCommand(message) {
			getStatus().then(data => {
				let status = STATUS_ONLINE;
				status += data.onlinePlayers ? 
					STATUS_PLAYERS.replace('{online}', data.onlinePlayers) : STATUS_EMPTY;
				message.reply(status);
			}).catch(err => {
				console.error(err);
				message.reply(STATUS_ERROR);
			})
		}

		function getStatus() {
			// Return cached data if not old
			if (Date.now() < lastUpdated + cacheTime) return Promise.resolve(data);
			return util.status(SERVER_ADDRESS, { port: SERVER_PORT })
				.then(res => {
					data = res;
					lastUpdated = Date.now();
					return data;
				})
		}

		switch (args[0]) {
			case 'status':
				statusCommand(message);
				break;
		}
	}
}
