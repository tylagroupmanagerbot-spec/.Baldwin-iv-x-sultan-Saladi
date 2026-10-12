import makeWASocket, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys'
import express from 'express'
import pino from 'pino'
import readline from 'readline'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import QRCode from 'qrcode'
import qrcodeTerminal from 'qrcode-terminal'
import settings from './settings.js'
import { PORT, SESSION_PATH, BROWSER } from './config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.json())
app.use(express.static(__dirname))

let globalSock = null
let lastCode = null
let lastQR = null
let mode = process.env.MODE || "pairing"

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, 'lib', 'server.html'))
})
app.get('/info', (req,res) => {
  res.json({ code: lastCode, qr: lastQR, connected: !!globalSock?.user, mode, owner: settings.ownerName, number: settings.ownerNumber })
})
app.post('/pair', async (req,res) => {
  try{
    mode = "pairing"
    const { number } = req.body
    const code = await globalSock.requestPairingCode(number.trim())
    lastCode = code
    lastQR = null
    res.json({ code })
  }catch(e){ res.json({ error: e.message }) }
})
app.post('/setmode', (req,res) => {
  mode = req.body.mode
  if(mode === "qr") startBot("qr")
  res.json({ mode })
})

app.listen(PORT, () => console.log(`Dashboard http://localhost:${PORT} Mode:${mode} Owner:${settings.ownerName}`))

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const ask = (q) => new Promise(r => rl.question(q, r))

async function startBot(forcedMode){
  if(forcedMode) mode = forcedMode
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_PATH)
  const { version } = await fetchLatestBaileysVersion()
  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: mode === "qr",
    browser: BROWSER
  })
  globalSock = sock

  if(!sock.authState.creds.registered){
    console.log(`=== ${settings.botName} ===`)
    console.log(`Owner: ${settings.ownerName} - ${settings.originalNumber}`)
    if(process.env.PHONE_NUMBER && mode === "pairing"){
      await new Promise(r=>setTimeout(r,3000))
      lastCode = await sock.requestPairingCode(process.env.PHONE_NUMBER.trim())
      console.log(`CODE FOR ${process.env.PHONE_NUMBER}: ${lastCode}`)
    }else if(mode === "pairing"){
      const choice = await ask(`Choose: 1=Pairing Code 2=QR Code [1]: `)
      if(choice.trim() === "2"){ mode="qr"; return startBot("qr") }
      const num = await ask(`Enter number [${settings.ownerNumber}]: `)
      const final = num.trim() || settings.ownerNumber
      lastCode = await sock.requestPairingCode(final)
      console.log(`\n>>> 8-DIGIT CODE: ${lastCode} <<<\nOpen / dashboard`)
    }
  }

  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('connection.update', async ({connection, lastDisconnect, qr})=>{
    if(qr && mode === "qr"){
      lastQR = await QRCode.toDataURL(qr)
      qrcodeTerminal.generate(qr, { small: true })
      console.log("QR ready - check dashboard /")
    }
    if(connection === "open"){ console.log(`✅ ${settings.botName} Connected - ${settings.ownerName}`); lastQR=null; lastCode=null; rl.close() }
    if(connection === "close"){
      const c = lastDisconnect?.error?.output?.statusCode
      if(c !== DisconnectReason.loggedOut) startBot()
      else { fs.rmSync(SESSION_PATH,{recursive:true,force:true}); startBot() }
    }
  })

  const { default: mainHandler } = await import('./main.js')
  sock.ev.on('messages.upsert', async (up)=> mainHandler(sock, up))
}
startBot()
