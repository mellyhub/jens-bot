const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('king')
        .setDescription('Replies with Kong!'),
    async execute(interaction) {
        await interaction.reply('Kong');
    },
}; 