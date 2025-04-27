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

            const json = await matchResponse.json();
            //console.log(json);
            const matchData = json.items;

            let totalKills = 0;
            let totalDeaths = 0;
            let totalAssists = 0;
            let totalHeadshots = 0;
            let totalADR = 0;
            let totalRounds = 0;
            let totalWins = 0;
            let totalLosses = 0;

            matchData.forEach((match) => {
                //console.log(match.stats);
                totalKills += Number(match.stats.Kills);
                totalDeaths += Number(match.stats.Deaths);
                totalAssists += Number(match.stats.Assists);
                totalHeadshots += Number(match.stats.Headshots);
                totalADR += Number(match.stats.ADR);
                totalRounds += Number(match.stats.Rounds);
                if(match.stats.Result === "1"){
                    totalWins += 1;
                }
                else if(match.stats.Result === "0"){
                    totalLosses += 1;
                }
            });

            // Calculate averages
            const kd = (totalKills / totalDeaths).toFixed(2);
            totalADR = (totalADR / matchData.length).toFixed(2);
            const hsPrecentage = ((totalHeadshots / totalKills) * 100).toFixed(2);
            
            // Create an embed with match information
            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`${matchData.length} game summary for ${playerName}`)
                .setThumbnail(playerData.avatar ? playerData.avatar : null)
                .setDescription(`Average stats from **${playerName}**'s recent games`)
                .addFields(
                    { name: 'Kills', value: `${totalKills / matchData.length}`, inline: true },
                    { name: 'Deaths', value: `${totalDeaths / matchData.length}`, inline: true },
                    { name: 'Assists', value: `${totalAssists / matchData.length}`, inline: true },
                    { name: 'K/D Ratio', value: `${kd}`, inline: true },
                    { name: 'Headshots', value: `${totalHeadshots / matchData.length}`, inline: true },
                    { name: 'HS%', value: `${hsPrecentage}`, inline: true },
                    { name: 'ADR', value: `${totalADR}`, inline: true },
                    { name: 'Winrate', value: `${((totalWins / matchData.length) * 100).toFixed(1)}%`, inline: true },
                    { name: 'W/L', value: `${totalWins}/${totalLosses}`, inline: true },
                    //{ name: 'Final Score', value: `${lastMatch.Score}`, inline: true },
                    //{ name: 'Result', value: lastMatch.Result === "1" ? "Win" : "Loss", inline: true }
                )
                //.setFooter({ text: `Match ID: ${lastMatch["Match Id"]}` });
            
            await interaction.reply({ embeds: [embed] });
           
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Failed to fetch match history. Please try again later.', ephemeral: true });
        }
    },
};