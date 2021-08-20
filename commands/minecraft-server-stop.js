module.exports = {
	name: 'minecraft-server-rcon',
	description: "Handles RCON commands for the Minecraft Server.",
	execute (message, args, config) {
		const util = require('minecraft-server-util');

		const ADDRESS = config.minecraft_server_address;
		const RCON_PORT = parseInt(config.minecraft_server_rcon_port);
		const RCON_PASSWORD = config.minecraft_server_rcon_password;
		const REQUIRED_ROLE_NAME = 'Minecraft Mod';
		var client;

		function main() {
			if (!message.guild) {
				message.channel.send('<:wrong:746014113746124860> This command only works in a server!');
				return;
			}

			let required_role = getRoleByName(REQUIRED_ROLE_NAME);

			if (!required_role) {
				message.channel.send(`<:wrong:746014113746124860> **${REQUIRED_ROLE_NAME}** role does not exist! Contact your Discord admin/mod to get this fixed.`);
				return;
			}

			if (!memberHasRole(message.member, required_role)) {
				message.channel.send(`<:wrong:746014113746124860> You do not have the permissions for that command.`);
				return;
			}

			// Creates a client to connect to the RCON server.
			client = new util.RCON(ADDRESS, { port: RCON_PORT, password: RCON_PASSWORD });
			client.on('output', (m) => {
				console.log(m);
			});

			switch (args[0]) {
				case 'stop':
					stopServer();
					break;
				case 'players':
					listPlayers();
					break;
			}

		}

		/**
		 * Sends a command that stops the server.
		 */
		function stopServer() {
			client.connect()
				.then(async () => {
					await client.run('stop');
					client.close();
					message.channel.send(':octagonal_sign: Stopping the server!');
				})
				.catch((error) => {
					console.error(error);
				});
		}

		function listPlayers() {
			client.connect()
				.then(async () => {
					await client.run('list');
					client.close();
					message.channel.send('Listing players...');
				})
				.catch((error) => {
					console.error(error);
				});
		}

		/**
		 * Verifies if a member has a role.
		 *
		 * @param member is the member that will be checked for a role.
		 * @param role is the role we're looking for from the user.
		 * @return if member is found to have the role. False if not.
		 */
		function memberHasRole(member, role) {
			if (member.roles.cache.has(role.id))
				return true;
			else
				return false;
		}

		/**
		 * Gets a role by name.
		 *
		 * @param role_name is the string of the role name being searched.
		 * @return is the role object if it is found.
		 */
		function getRoleByName(role_name) {
			return message.guild.roles.cache.find(role => role.name === role_name);
		}

		main();
	}
}
