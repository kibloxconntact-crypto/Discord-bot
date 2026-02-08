import 'dotenv/config';
import { Client, GatewayIntentBits, Collection, Events } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.TOKEN) {
    console.error('❌ TOKEN aus .env nicht gefunden!');
    process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Commands laden
const commandsPath = path.join(__dirname, 'commands');
if (!fs.existsSync(commandsPath)) {
    console.error('❌ Ordner "commands" existiert nicht!');
    process.exit(1);
}

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const fileUrl = pathToFileURL(filePath).href;
    const command = await import(fileUrl);

    if (command.default?.data && command.default?.execute) {
        client.commands.set(command.default.data.name, command.default);
        console.log(`✅ Command geladen: ${command.default.data.name}`);
    } else {
        console.warn(`⚠️ Command ${file} ist ungültig!`);
    }
}

// Bot bereit
client.once(Events.ClientReady, c => {
    console.log(`🚀 Bot ist online! Eingeloggt als ${c.user.tag}`);
});

// Command-Handler
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error('❌ Fehler beim Ausführen des Commands:', error);
        const reply = { content: 'Fehler beim Ausführen!', ephemeral: true };
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(reply);
        } else {
            await interaction.reply(reply);
        }
    }
});

// Login
client.login(process.env.TOKEN);