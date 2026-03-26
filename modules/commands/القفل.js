const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "القفل",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "الوكيل",
  description: "قفل الأوامر بحيث يستخدمها الأدمن والمطور فقط",
  commandCategory: "المطور",
  usages: "[تشغيل/إيقاف]",
  cooldowns: 3
};

function getLockPath() {
  return path.join(__dirname, "cache", "lock_status.json");
}

function loadLock() {
  const p = getLockPath();
  if (!fs.existsSync(p)) fs.writeJsonSync(p, {});
  return fs.readJsonSync(p);
}

function isAdmin(senderID) {
  try {
    const config = JSON.parse(fs.readFileSync(path.join(global.client.mainPath, "config.json"), "utf-8"));
    return (config.SUPERADMIN || []).includes(senderID) || (config.ADMINBOT || []).includes(senderID);
  } catch(e) { return false; }
}

module.exports.onLoad = function () {
  const p = getLockPath();
  if (!fs.existsSync(p)) fs.writeJsonSync(p, {});
};

module.exports.handleEvent = async function({ event, api }) {
  const { senderID, threadID, messageID, body, adminIDs } = event;

  if (!body || !senderID || !threadID) return;
  if (isAdmin(senderID)) return;

  const config = JSON.parse(fs.readFileSync(path.join(global.client.mainPath, "config.json"), "utf-8"));
  const PREFIX = config.PREFIX || ".";

  if (!body.startsWith(PREFIX)) return;

  const lock = loadLock();
  if (lock[threadID] !== "on") return;

  let isGroupAdmin = false;
  try {
    const info = await api.getThreadInfo(threadID);
    isGroupAdmin = (info.adminIDs || []).some(a => a.id == senderID);
  } catch(e) {}

  if (!isGroupAdmin) {
    try { await api.unsendMessage(messageID); } catch(e) {}
    return api.sendMessage(`🔒 المجموعة مقفلة! الأوامر متاحة للأدمن والمطورين فقط.`, threadID, messageID);
  }
};

module.exports.run = async function({ event, api, args }) {
  const { threadID, messageID, senderID } = event;

  if (!isAdmin(senderID)) return api.sendMessage("عذراً، هذا الأمر مخصص للمطورين فقط ❌", threadID, messageID);

  const lock = loadLock();

  if (args[0] == "تشغيل" || args[0] == "on") {
    lock[threadID] = "on";
    fs.writeJsonSync(getLockPath(), lock);
    return api.sendMessage("🔒 تم تفعيل قفل المجموعة!\nالأوامر متاحة الآن للأدمن والمطورين فقط.", threadID, messageID);

  } else if (args[0] == "إيقاف" || args[0] == "ايقاف" || args[0] == "off") {
    lock[threadID] = "off";
    fs.writeJsonSync(getLockPath(), lock);
    return api.sendMessage("🔓 تم إلغاء قفل المجموعة!\nالأوامر متاحة للجميع الآن.", threadID, messageID);

  } else {
    const status = lock[threadID] === "on" ? "🔒 مفعل" : "🔓 موقف";
    return api.sendMessage(`حالة القفل: ${status}\n\nيرجى استخدام:\n• القفل تشغيل\n• القفل إيقاف`, threadID, messageID);
  }
};
