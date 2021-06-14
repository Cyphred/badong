module.exports = {
	name: 'ping',
	description: "Measures two-way latency.",
	execute (message, args, client) {
		var latency = Date.now() - message.createdTimestamp;
		var api_latency = Math.round(client.ws.ping);
		message.channel.send('Loading data').then (async (msg) =>{
			msg.delete();
			message.channel.send(`🏓 **Pong!** Latency: \`${latency}ms\` API Latency: \`${api_latency}ms\``);
		});
	}
}
