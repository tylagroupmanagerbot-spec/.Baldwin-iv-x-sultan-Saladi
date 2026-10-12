export default async (sock, m, args, text, settings) => {
  const start = Date.now()
  await sock.sendMessage(m.key.remoteJid, { text: `*${settings.botName}*\nOwner: ${settings.ownerName} - ${settings.originalNumber}\n\nPong! 🏓 ${Date.now()-start}ms` }, { quoted: m })
}
