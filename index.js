// Require necessary packages

//require('dotenv').config();
//const fs = require('fs').promises;

const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Create a new client instance
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ] 
});

// Create a collection for commands
client.commands = new Collection();

// Load commands from the commands directory
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

// Handle interactions (commands)
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, c => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN); 


//1-cbb9d272-b6c4-4cc7-b5c3-3b8a761c26e3 match id
// 41b48df9-e5d7-458f-b887-ed4ff1c362fa player id
// 76561198070114707 game player id

//"https://open.faceit.com/data/v4/players/{41b48df9-e5d7-458f-b887-ed4ff1c362fa}/games/{cs2}/stats"

/*
async function getMatchStatistics() {

  const url = "https://open.faceit.com/data/v4/players/41b48df9-e5d7-458f-b887-ed4ff1c362fa/games/cs2/stats";
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${process.env.FACEIT_API_KEY}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    //console.log(json);

    await fs.writeFile('match_stats.json', JSON.stringify(json, null, 2));
    console.log('Data successfully saved to match_stats.json');

  } catch (error) {
    console.error(error.message);
  }
}

getMatchStatistics();

async function getPlayerMatches(nickname, game = 'cs2', limit = 10) {
  const API_KEY = process.env.FACEIT_API_KEY; 
  
  try {
      const playerResponse = await fetch(`https://open.faceit.com/data/v4/players?nickname=${nickname}`, {
          headers: {
              'Authorization': `Bearer ${API_KEY}`
          }
      });

      if (!playerResponse.ok) {
          throw new Error(`Failed to get player: ${playerResponse.status}`);
      }

      const playerData = await playerResponse.json();
      const playerId = playerData.player_id;

      const matchesUrl = new URL(`https://open.faceit.com/data/v4/players/${playerId}/history`);
      matchesUrl.searchParams.append('game', game);
      matchesUrl.searchParams.append('limit', limit.toString());

      const matchesResponse = await fetch(matchesUrl, {
          headers: {
              'Authorization': `Bearer ${API_KEY}`
          }
      });

      if (!matchesResponse.ok) {
          throw new Error(`Failed to get matches: ${matchesResponse.status}`);
      }

      const matchesData = await matchesResponse.json();
      return matchesData;

  } catch (error) {
      console.error('Error:', error.message);
      throw error;
  }
}

//getPlayerMatches('Frooz1e', 'cs2', 10)
//  .then(data => console.log('Recent matches:', data))
//  .catch(error => console.error('Failed:', error));
*/