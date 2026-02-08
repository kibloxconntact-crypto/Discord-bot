import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = [];
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

    if (command.default?.data) {
        commands.push(command.default.data.toJSON());
        console.log(`✅ Command geladen: ${command.default.data.name}`);
    } else {
        console.warn(`⚠️ Command ${file} enthält keine "data" Eigenschaft!`);
    }
}

if (!process.env.TOKEN || !process.env.CLIENT_ID || !process.env.GUILD_ID) {
    console.error('❌ .env Variablen fehlen! TOKEN, CLIENT_ID oder GUILD_ID.');
    process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

try {
    console.log(`⏳ Registriere ${commands.length} Commands...`);
    await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands }
    );
    console.log('✅ Commands erfolgreich registriert!');
} catch (error) {
    console.error('❌ Fehler beim Deployen:', error);
}