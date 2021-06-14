const Discord = require('discord.js');
const mc_server_util = require('minecraft-server-util');
const client = new Discord.Client();
const config = require('./config.json');

// For loading commands from .js files in the ./commands folder
const fs = require('fs');
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// Sets the prefix for commands
const prefix =';'

function mc_handler(message, args) {
	switch (args[0]) {
		case 'status':
			client.commands.get('minecraft-server-status').execute(message, args, config, mc_server_util);
			break;
	}
}


client.once('ready', () => {
	console.log('Badong is Online');
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	switch (command) {
		case 'ping':
			client.commands.get('ping').execute(message, args, client);
			break;
		case 'mc':
			mc_handler(message, args);
			break;
	}
});

client.login(config.token); // Keep this line at the end of the file
