import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Löscht eine Anzahl an Nachrichten.')
        .addIntegerOption(option => 
            option.setName('anzahl')
                .setDescription('Wieviele Nachrichten (1-100)?')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages), // Nur für Mods!

    async execute(interaction) {
        const amount = interaction.options.getInteger('anzahl');

        if (amount < 1 || amount > 100) {
            return interaction.reply({ content: 'Bitte eine Zahl zwischen 1 und 100 angeben.', ephemeral: true });
        }

        await interaction.channel.bulkDelete(amount, true);
        await interaction.reply({ content: `✅ ${amount} Nachrichten wurden gelöscht.`, ephemeral: true });
    }
};