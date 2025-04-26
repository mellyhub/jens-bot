const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Displays information about a profile')
        .addStringOption(option =>
            option.setName('player')
                .setDescription('The nickname of the player')
                .setRequired(true)),
    async execute(interaction) {
        const playerName = interaction.options.getString('player');
        const apiKey = process.env.FACEIT_API_KEY;

        try {
            // Fetch player data from Faceit API
            const response = await fetch(`https://open.faceit.com/data/v4/players?nickname=${playerName}`, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch player data: ${response.status}`);
            }

            const playerData = await response.json();

            // Create an embed with player information
            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(playerData.nickname)
                .setURL(playerData.faceit_url.replace('{lang}', 'en'))
                .setThumbnail(playerData.avatar)
                .setDescription(`Information about **${playerData.nickname}**`)
                .addFields(
                    { name: 'Level', value: `${playerData.games.cs2.skill_level}`, inline: true },
                    { name: 'ELO', value: `${playerData.games.cs2.faceit_elo}`, inline: true },
                    { name: 'Region', value: `${playerData.games.cs2.region}`, inline: true },
                    { name: 'Country', value: `:flag_${playerData.country.toLowerCase()}:`, inline: true },
                    { name: 'Steam ID', value: `[${playerData.games.cs2.game_player_id}](https://steamcommunity.com/profiles/${playerData.steam_id_64})`, inline: true }
                )
                .setImage(playerData.cover_image)

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Failed to fetch player data. Please try again later.', ephemeral: true });
        }
    },
};
