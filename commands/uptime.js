const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Displays how long the bot has been running'),
    async execute(interaction) {
        const totalSeconds = Math.floor(process.uptime());  // Get the uptime in seconds
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const uptime = `${hours}h ${minutes}m ${seconds}s`;
        await interaction.reply(`The bot has been running for: ${uptime}`);
    },
};