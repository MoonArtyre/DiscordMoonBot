import { Client, Events, GatewayIntentBits } from "discord.js"
import { config } from "./config"
import "./webhookListen"
import child_process from "child_process"
import { ReadMessage } from "./TextChannelManager"
import { OnClientReady } from "./DiscordBotClient"

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

//Trigger event once, when client is ready
client.once(Events.ClientReady, (readyClient: Client<true>) => OnClientReady(readyClient))

//Trigger event when message is created from another user
client.on(Events.MessageCreate, ReadMessage)

//Login and start the bot
client.login(config.DISCORD_TOKEN);
