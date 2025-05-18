import { Client } from "discord.js"
import { UpdateBotStartedStatus } from "./StatusUpdateManager"
import { setTimeout } from "timers/promises"

export let botClient: Client<true>

export async function OnClientReady(readyClient: Client<true>) {
    await setTimeout(3000)

    //Assign bot client from newly loged in discord session
    botClient = readyClient

    console.log(`Ready! Logged in as ${botClient.user.tag}`)

    await UpdateBotStartedStatus()
}