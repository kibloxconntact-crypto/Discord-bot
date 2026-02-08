import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('rbxgame')
        .setDescription('Zeigt Live-Stats eines Roblox-Spiels')
        .addStringOption(option => option.setName('universeid').setDescription('Die Universe ID deines Spiels').setRequired(true)),

    async execute(interaction) {
        const universeId = interaction.options.getString('universeid');
        
        try {
            const response = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`);
            const data = await response.json();
            const game = data.data[0];

            if (!game) return interaction.reply('Spiel nicht gefunden!');

            const embed = new EmbedBuilder()
                .setTitle(game.name)
                .setURL(`https://www.roblox.com/games/${game.rootPlaceId}`)
                .addFields(
                    { name: 'Aktive Spieler', value: `${game.playing}`, inline: true },
                    { name: 'Besuche', value: `${game.visits}`, inline: true },
                    { name: 'Favoriten', value: `${game.favoritedCount}`, inline: true }
                )
                .setColor(0xff0000);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            await interaction.reply('Fehler beim Abrufen der Roblox-API.');
        }
    }
};