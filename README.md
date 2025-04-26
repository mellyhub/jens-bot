# Discord Bot

A Discord bot built with discord.js.

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   DISCORD_TOKEN=your_discord_bot_token
   CLIENT_ID=your_discord_application_client_id
   GUILD_ID=your_discord_server_id
   ```
   See `.env-example` for reference.

## Getting Your Discord Bot Token

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application or select an existing one
3. Go to the "Bot" tab and click "Add Bot"
4. Under the TOKEN section, click "Reset Token" and copy your bot token
5. Add this token to your `.env` file as `DISCORD_TOKEN`
6. Copy your application ID from the "General Information" tab and add it as `CLIENT_ID` in your `.env` file
7. Get your server ID by enabling Developer Mode in Discord settings, then right-clicking on your server and selecting "Copy ID". Add this as `GUILD_ID` in your `.env` file

## Bot Permissions

When adding your bot to a server, make sure it has the following permissions:

- Send Messages
- Use Slash Commands
- Read Message History

Use this URL to add your bot (replace CLIENT_ID with your actual client ID):
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=2147483648&scope=bot%20applications.commands
```

## Running the Bot

1. Register slash commands (only needed when commands change):
   ```
   npm run deploy
   ```

2. Start the bot:
   ```
   npm start
   ```

3. For development with auto-restart:
   ```
   npm run dev
   ```

## Adding New Commands

1. Create a new JavaScript file in the `commands` folder
2. Use the following template:
   ```js
   const { SlashCommandBuilder } = require('discord.js');

   module.exports = {
       data: new SlashCommandBuilder()
           .setName('command-name')
           .setDescription('Command description'),
       async execute(interaction) {
           await interaction.reply('Response message');
       },
   };
   ```
3. Run `npm run deploy` to register the new command with Discord 