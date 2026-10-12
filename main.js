import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import settings from './settings.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const commands = new Map()
const cmdDir = path.join(__dirname, 'commands')

if(fs.existsSync(cmdDir)){
  for(const file of fs.readdirSync(cmdDir)){
    if(!file.endsWith('.js')) continue
    try{
      const mod = await import(`./commands/${file}?t=${Date.now()}`)
      commands.set(file.replace('.js','').toLowerCase(), mod.default || mod)
    }catch(e){ console.log(`Failed load ${file}: ${e.message}`) }
  }
}
console.log(`Loaded ${commands.size} commands for ${settings.botName} | ${settings.ownerName}`)

export default async function(sock, { messages }){
  const m = messages[0]
  if(!m.message || m.key.fromMe) return
  const body = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || m.message.videoMessage?.caption || ""
  if(!body.startsWith(settings.prefix)) return

  const args = body.slice(settings.prefix.length).trim().split(/ +/)
  const cmdName = args[0].toLowerCase()
  const text = args.slice(1).join(' ')
  const from = m.key.remoteJid

  if(commands.has(cmdName)){
    try{ return await commands.get(cmdName)(sock, m, args, text, settings) }catch(e){ console.log(e) }
  }
}
