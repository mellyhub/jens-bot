const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Lists all available commands'),
    async execute(interaction) {
        const commandsPath = path.join(__dirname);
        // Get all js files from the commands directory
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        let helpMessage = '**Available Commands:**\n';
        for (const file of commandFiles) {
            const command = require(path.join(commandsPath, file));
            if (command.data && command.data.name && command.data.description) {
                helpMessage += `/${command.data.name} -  ${command.data.description}\n`;
            }
        }

        await interaction.reply(helpMessage);
    },
}; 