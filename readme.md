# Badong
Yet another discord bot.

# Config
Badong should be configured using a `config.json` file in the project's root directory.
All settings and possible values are the following:

- `token:[AUTH_TOKEN]` - The authorization token for running your own instance of Badong.
- `mc_server:[ip|port]` - Network details of the Minecraft server.
  - `ip:[SERVER_IP]` - The IP address of the running Minecraft server.
  - `port:[SERVER_PORT]` - The port of the running Minecraft server.
- `rcon:[port|password]` - Details for the RCON server for issuing commands.
  - `port:[RCON_PORT]` - Port where RCON is listening for commands.
  - `password:[PASSWORD]` - RCON password for authentication.
