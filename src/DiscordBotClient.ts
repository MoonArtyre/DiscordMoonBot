import { Client } from "discord.js"
import { UpdateBotStartedStatus } from "./StatusUpdateManager"

export let botClient: Client<true>

export async function OnClientReady(readyClient: Client<true>) {
    //Assign bot client from newly loged in discord session
    botClient = readyClient

    console.log(`Ready! Logged in as ${botClient.user.tag}`)

    await UpdateBotStartedStatus()
}