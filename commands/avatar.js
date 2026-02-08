import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Zeigt das Profilbild eines Nutzers.')
        .addUserOption(option => option.setName('nutzer').setDescription('Wessen Avatar?')),

    async execute(interaction) {
        const user = interaction.options.getUser('nutzer') || interaction.user;
        
        const embed = new EmbedBuilder()
            .setTitle(`Avatar von ${user.username}`)
            .setImage(user.displayAvatarURL({ size: 1024, dynamic: true }))
            .setColor(0x5865F2);

        await interaction.reply({ embeds: [embed] });
    }
};