import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('roblox')
        .setDescription('Prüft den aktuellen Status der Roblox-Server.'),

    async execute(interaction) {
        await interaction.deferReply(); // Da APIs manchmal Zeit brauchen

        try {
            const response = await fetch('https://status.roblox.com/api/v2/summary.json');
            const data = await response.json();

            const status = data.status.description === 'All Systems Operational' 
                ? '✅ Alles läuft super' 
                : '⚠️ Es gibt Probleme';

            const embed = new EmbedBuilder()
                .setTitle('🟥 Roblox Status')
                .setColor(data.status.indicator === 'none' ? 0x00ff00 : 0xffa500)
                .addFields(
                    { name: 'Gesamtstatus', value: status },
                    { name: 'Letztes Update', value: `<t:${Math.floor(Date.now() / 1000)}:R>` }
                )
                .setFooter({ text: 'Daten von status.roblox.com' });

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            await interaction.editReply('Fehler beim Abrufen der Roblox-Daten. ❌');
        }
    }
};