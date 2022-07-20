import TelegramBot from 'node-telegram-bot-api'
import { connect, StringCodec } from "nats"

const token = process.env.TG_API_KEY
let chatID = process.env.CHAT_ID
const NATS_URL = process.env.NATS_URL

const bot = new TelegramBot(token)
const nc = await connect({ servers: NATS_URL })
const sc = StringCodec()

const sub = nc.subscribe("message", { queue: "message" });
(async () => {
  for await (const m of sub) {
    console.log(`[${sub.getProcessed()}]: ${sc.decode(m.data)}`)
    bot.sendMessage(chatID, `${sc.decode(m.data)}`)
  }
  console.log("subscription closed")
})()