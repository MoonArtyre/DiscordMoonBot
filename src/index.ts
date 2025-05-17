import { Client, Events, GatewayIntentBits, Message, TextChannel } from "discord.js"
import { config } from "./config"
import "./webhookListen"
import child_process from "child_process"

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages
    ]
})

//#region discord Ids
const AllowedServers = [
    "813104517142937681",
    "1146795649162018857"
]

const AllowedChannels = [
    "946446204617773166",
    "1217399265190608966",
    "1373352030655217735"
]

const StatusChannel = "1373352030655217735"
//#endregion

//#region Ngrok child process hosting
const ngrok = child_process.spawn("ngrok", ["http", "--domain=tough-eminently-ibex.ngrok-free.app", "8080"])

ngrok.on('error', (err) => {
    console.error('Failed to start ngrok:', err);
});

ngrok.on('close', (code) => {
    console.log(`ngrok closed with code ${code}`);
});
//#endregion

client.once(Events.ClientReady, async (readyClient: Client<true>) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`)
    const statusTextChannel = await readyClient.channels.fetch(StatusChannel) as TextChannel

    if (statusTextChannel == null) {
        console.error(`Could not fetch status channel ${StatusChannel}`)
        return
    }

    await statusTextChannel.send(`Bot started and logged in as ${readyClient.user.tag}`)
})

client.on(Events.MessageCreate, ReadMessage)
async function ReadMessage(message: Message) {
    const textChannel = message.channel as TextChannel
    const messageContent = message.content.toLowerCase()

    if (!AllowedServers.includes(textChannel.guild.id))
        return

    if (!AllowedChannels.includes(textChannel.id))
        return

    if (messageContent === "hi denji") {
        message.reply("Hello " + message.author.displayName)
    }
}

client.login(config.DISCORD_TOKEN);
