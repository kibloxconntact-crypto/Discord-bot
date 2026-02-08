import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('webcheck')
        .setDescription('Prüft die Erreichbarkeit deiner Website')
        .addStringOption(option => option.setName('url').setDescription('Deine Domain (z.B. google.de)').setRequired(true)),

    async execute(interaction) {
        let url = interaction.options.getString('url');
        if (!url.startsWith('http')) url = 'https://' + url;

        const start = Date.now();
        try {
            const res = await fetch(url);
            const duration = Date.now() - start;
            await interaction.reply(`🌐 **${url}** ist online! (Antwortzeit: ${duration}ms, Status: ${res.status})`);
        } catch (e) {
            await interaction.reply(`❌ **${url}** konnte nicht erreicht werden.`);
        }
    }
};