import { Client, EmbedBuilder, Events, GatewayIntentBits, Message, TextChannel } from "discord.js"
import { config } from "./config"
import "./webhookListen"
import child_process from "child_process"

// Create a new client instance
export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages
    ]
})

// Create Ngrok Host
child_process.spawn("ngrok", ["http", "--domain=tough-eminently-ibex.ngrok-free.app", "3000"])

// Discord Ids for allowed channels
const AllowedServers = [
    "813104517142937681",
    "1146795649162018857"
]

const AllowedChannels = [
    "946446204617773166",
    "1217399265190608966",
    "1373352030655217735",
    "1148905118918512650"
]

export const StatusChannel = "1373352030655217735"

client.once(Events.ClientReady, async (readyClient: Client<true>) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`)
    const statusTextChannel = await readyClient.channels.fetch(StatusChannel) as TextChannel

    const embed = new EmbedBuilder()
        .setColor(0x00FF55)
        .setTitle('Bot Started')
        .setFields(
            { name: "Start Time", value: new Date(Date.now()).toUTCString() }
        )

    await statusTextChannel.send({ embeds: [embed] })
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
