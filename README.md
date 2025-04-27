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