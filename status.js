import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Zeigt die aktuelle Performance und den Status des Bots an.'),

    async execute(interaction) {
        // Die Zeitdifferenz zwischen Absenden und Empfangen berechnen
        const ping = interaction.client.ws.ping;
        
        // Ein schöneres Design mit Embeds erstellen
        const statusEmbed = new EmbedBuilder()
            .setColor(0x00ff00) // Grün
            .setTitle('🤖 Bot Status')
            .addFields(
                { name: 'System-Status', value: 'Betriebsbereit ✅', inline: true },
                { name: 'Latenz (API)', value: `${ping}ms ⚡`, inline: true },
                { name: 'Serverzeit', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `Anfrage von ${interaction.user.tag}` });

        await interaction.reply({ embeds: [statusEmbed] });
    },
};