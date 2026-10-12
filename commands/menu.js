export default async (sock, m, args, text, settings) => {
  const menu = `
╭━━━ *${settings.botName}* ━━━
┃ Owner: *${settings.ownerName}*
┃ Number: ${settings.originalNumber}
┃ Prefix: ${settings.prefix}
╰━━━━━━━━━━━━━━━━━━

╭━━━ COMMANDS ━━━
┃ .ping - speed check
┃ .menu - this list
┃ .owner - owner contact
┃ .alive - bot status
┃ .pair - guide
╰━━━━━━━━━━━━━━━━━━

*Simon tech inc - 09166265317*
`
  await sock.sendMessage(m.key.remoteJid, { text: menu }, { quoted: m })
}
