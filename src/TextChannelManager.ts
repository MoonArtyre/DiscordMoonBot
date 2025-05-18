import { Message, TextChannel } from "discord.js"
import * as channelConst from "./Constants/ChannelConstants"

export async function ReadMessage(message: Message) {
    const textChannel = message.channel as TextChannel
    const messageContent = message.content.toLowerCase()

    //Filter messages from non allowed servers
    if (!channelConst.AllowedServers.includes(textChannel.guild.id))
        return

    //Filter messages from non allowed channels
    if (!channelConst.AllowedChannels.includes(textChannel.id))
        return

    if (messageContent === "hi denji") {
        message.reply("Hello " + message.author.displayName)
    }
}