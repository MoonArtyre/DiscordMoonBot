import { Client, Events, GatewayIntentBits, Message, TextChannel } from "discord.js"
import { config } from "./config"
import "./webhookListen"

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages
    ]
})

client.once(Events.ClientReady, (readyClient: Client<true>) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`)
});

client.on(Events.MessageCreate, ReadMessage)

client.login(config.DISCORD_TOKEN);

const AllowedServers = [
    "813104517142937681",
    "1146795649162018857"
]

const AllowedChannels = [
    "946446204617773166",
    "1217399265190608966"
]


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
