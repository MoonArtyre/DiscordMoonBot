import { Message, TextChannel } from "discord.js"
import * as channelConst from "./Constants/ChannelConstants"
import "./LanguageIntepreter"
import LanguageIntepreter from "./LanguageIntepreter"

export async function ReadMessage(message: Message) {
    const textChannel = message.channel as TextChannel
    const messageContent = message.content.toLowerCase()
    const messageWordArray = messageContent.split(" ")

    const authorName = message.author.displayName

    //Filter messages from non allowed servers
    if (!channelConst.AllowedServers.includes(textChannel.guild.id))
        return

    //Filter messages from non allowed channels
    if (!channelConst.AllowedChannels.includes(textChannel.id))
        return

    if (messageWordArray.length >= 2) {
        if (LanguageIntepreter.CheckGreeting(messageWordArray[0]) && LanguageIntepreter.CheckBotname(messageWordArray[1])) {
            const greeting = LanguageIntepreter.GetRandomGreeting()
            message.reply(`${greeting} ${authorName}`)
        }
    }
}