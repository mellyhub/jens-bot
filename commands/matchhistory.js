const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('matchhistory')
        .setDescription('Displays game information')
        .addStringOption(option =>
            option.setName('player')
                .setDescription('The nickname of the player')
                .setRequired(true)),
    async execute(interaction) {
        const playerName = interaction.options.getString('player');
        const apiKey = process.env.FACEIT_API_KEY;

        try {
            // Fetch player data to get the player ID
            const playerResponse = await fetch(`https://open.faceit.com/data/v4/players?nickname=${playerName}`, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });

            if (!playerResponse.ok) {
                throw new Error(`Failed to fetch player data: ${playerResponse.status}`);
            }

            const playerData = await playerResponse.json();
            const playerId = playerData.player_id;

            // Fetch match history for the player
            const matchResponse = await fetch(`https://open.faceit.com/data/v4/players/${playerId}/games/cs2/stats`, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });

            if (!matchResponse.ok) {
                throw new Error(`Failed to fetch match history: ${matchResponse.status}`);
            }

            const matchData = await matchResponse.json();
            console.log(matchData);
            const lastMatch = matchData.items[0].stats;
            console.log(lastMatch);
            
            // Create an embed with match information
            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`Last Match - ${lastMatch.Map}`)
                .setDescription(`Details about **${playerName}**'s last game`)
                .addFields(
                    { name: 'Kills', value: `${lastMatch.Kills}`, inline: true },
                    { name: 'Deaths', value: `${lastMatch.Deaths}`, inline: true },
                    { name: 'Assists', value: `${lastMatch.Assists}`, inline: true },
                    { name: 'K/D Ratio', value: `${lastMatch["K/D Ratio"]}`, inline: true },
                    { name: 'Headshots', value: `${lastMatch.Headshots} (${lastMatch["Headshots %"]}%)`, inline: true },
                    { name: 'ADR', value: `${lastMatch.ADR}`, inline: true },
                    { name: 'Rounds', value: `${lastMatch.Rounds}`, inline: true },
                    { name: 'Final Score', value: `${lastMatch.Score}`, inline: true },
                    { name: 'Result', value: lastMatch.Result === "1" ? "Win" : "Loss", inline: true }
                )
                .setFooter({ text: `Match ID: ${lastMatch["Match Id"]}` });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Failed to fetch match history. Please try again later.', ephemeral: true });
        }
    },
};