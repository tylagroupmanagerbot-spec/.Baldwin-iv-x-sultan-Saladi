export const reply = async (sock, msg, text) => {
  await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg })
}
export const isOwner = (sender) => {
  return sender.includes("2349166265317")
}
