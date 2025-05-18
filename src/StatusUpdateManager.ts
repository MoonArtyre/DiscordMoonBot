import { EmbedBuilder, Message, TextChannel } from "discord.js";
import { botClient } from "./DiscordBotClient";
import { StatusChannel } from "./Constants/ChannelConstants";

interface StatusMessageDictonary {
    [key: string]: Message<true>
}
const activeStatusMessages: StatusMessageDictonary = {}

export async function UpdateBotStartedStatus() {
    const botStartedEmbed = new EmbedBuilder()
        .setColor(0x00FF55)
        .setTitle('Bot Started')
        .setFields(
            { name: "Start TimeStamp", value: new Date(Date.now()).toUTCString() }
        )

    await SendStatus("BotStart", botStartedEmbed)
}

let updateStartTimestamp: number
let downloadTime: number
let installTime: number
let botUpdateEmbed: EmbedBuilder
export async function InitializeBotUpdateStatus() {
    updateStartTimestamp = Date.now()

    botUpdateEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Updating Bot')
        .setFields(
            { name: "Download Status", value: "Downloading..." },
            { name: "Install Status", value: "Waiting..." },
            { name: "Restart Status", value: "Waiting..." }
        ).setFooter(
            { text: `Update started on ${new Date(updateStartTimestamp).toUTCString()}` }
        )

    SendStatus("BotUpdate", botUpdateEmbed)
}

export async function StatusUpdate_DownloadFinished() {
    downloadTime = updateStartTimestamp - Date.now()

    botUpdateEmbed.setFields(
        { name: "Download Status", value: `Completed in ${downloadTime}ms` },
        { name: "Install Status", value: "Installing..." },
        { name: "Restart Status", value: "Waiting..." }
    )

    SendStatus("BotUpdate", botUpdateEmbed)
}

export async function StatusUpdate_InstallFinished() {
    installTime = updateStartTimestamp - Date.now()
    botUpdateEmbed.setFields(
        { name: "Download Status", value: `Completed in ${downloadTime}ms` },
        { name: "Install Status", value: `Completed in ${installTime}ms` },
        { name: "Restart Status", value: `Restarted on\n ${new Date(Date.now()).toUTCString()}` }
    )

    SendStatus("BotUpdate", botUpdateEmbed)
}

async function SendStatus(statusKey: string, statusEmbed: EmbedBuilder) {
    const statusChannel = await botClient.channels.fetch(StatusChannel) as TextChannel

    if (activeStatusMessages[statusKey] == null) {
        const newStatusMessage = await statusChannel.send({ embeds: [statusEmbed] })
        activeStatusMessages[statusKey] = newStatusMessage
        return
    }

    const statusMessageRef = activeStatusMessages[statusKey]
    await statusMessageRef.edit({ embeds: [statusEmbed] })
}