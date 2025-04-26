const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Lists all available commands'),
    async execute(interaction) {
        const commandsPath = path.join(__dirname);
        const commandFiles = fs.readdirSync(commandsPath);

        let helpMessage = 'Here are all the available commands:\n\n';
        for (const file of commandFiles) {
            const command = require(path.join(commandsPath, file));
            if(command.data && command.data.name) {
                helpMessage += `/${command.data.name}: ${command.data.description}\n`;
            }
        }

        await interaction.reply(helpMessage);
    },
}; 