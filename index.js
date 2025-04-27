// Require necessary packages
require('dotenv').config();

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

async function setupMinuteTimer() {
  try {
    console.log("Attempting to execute automated command...");
    
    // 1. Get the target channel
    const targetChannel = await client.channels.fetch("1365774869735805038");
    if (!targetChannel) throw new Error("Channel not found");
    console.log(`Target channel: ${targetChannel.name}`);

    // 2. Create enhanced mock interaction
    const mockInteraction = {
      options: {
        getString: (name) => {
          console.log(`Getting option: ${name}`);
          return name === 'player' ? 'Frooz1e' : null;
        }
      },
      channel: targetChannel,
      guild: targetChannel.guild,
      user: client.user,
      client: client,
      createdTimestamp: Date.now(),
      replied: false,
      deferred: false,
      reply: async (response) => {
        console.log("Attempting to reply...");
        this.replied = true;
        if (response.embeds) {
          return targetChannel.send({ embeds: response.embeds });
        }
        return targetChannel.send(response.content || 'Command executed');
      },
      deferReply: async () => {
        this.deferred = true;
        console.log("Deferring reply...");
      },
      isChatInputCommand: () => true,
    };

    // 3. Verify command exists
    console.log("Checking for command...");
    const command = client.commands.get('matchhistory');
    if (!command) {
      throw new Error('Command not found in collection');
    }

    // 4. Execute with error handling
    console.log("Executing command...");
    await command.execute(mockInteraction);
    console.log(`Successfully executed at ${new Date().toISOString()}`);

  } catch (error) {
    console.error('Automated command failed:', error.stack); // Full error stack
  }
}

// Enhanced ready handler
client.once(Events.ClientReady, async c => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
  
  
  /*
  // Initial test run
  await setupMinuteTimer();
  
  // Set up interval
  setInterval(async () => {
    await setupMinuteTimer(); 
  }, 60000); // 60 seconds
  */
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN); 