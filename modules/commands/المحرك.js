const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "المحرك",
  version: "1.3.0",
  hasPermssion: 2,
  credits: "الوكيل",
  description: "إرسال رسالة مخصصة تلقائية كل 45 ثانية - للمطورين فقط",
  commandCategory: "المطور",
  usages: "[تشغيل / إيقاف / رسالة (الرسالة الجديدة)]",
  cooldowns: 5
};

function isSuperDev(senderID) {
  try {
    const configPath = path.join(global.client.mainPath, "config.json");
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    return (config.SUPERADMIN || []).includes(senderID) || (config.ADMINBOT || []).includes(senderID);
  } catch(e) { return false; }
}

const DEFAULT_MESSAGE = `𝗔𝗨𝗧𝗢 𝗥𝗘𝗣𝗟𝗬.⛔\n\n𒀷 ▸ 🎴𝐃⃢⃟𝐂🐦‍⬛ ◂ 𒁈𒀷 ▸ 🎴𝐃⃢⃟𝐂🐦‍⬛ ◂ 𒁈𒀷 ▸ 🎴𝐃⃢⃟𝐂🐦‍⬛ ◂ 𒁈𒀷 ▸ 🎴𝐃⃢⃟𝐂🐦‍⬛ ◂ 𒁈𒀷 ▸ 🎴𝐃⃢⃟𝐂🐦‍⬛ ◂ 𒁈𒀷 ▸ 🎴𝐃⃢⃟𝐂🐦‍⬛ ◂ 𒁈𒀷 ▸ 🎴𝐃⃢⃟𝐂🐦‍⬛ ◂ 𒁈𒀷 ▸ 🎴𝐃⃢⃟𝐂🐦‍⬛ ◂ 𒁈𒀷 ▸ 🎴𝐃⃢⃟𝐂🐦‍⬛ ◂ 𒁈𒀷 ▸ 🎴𝐃⃢⃟𝐂🐦‍⬛ ◂ 𒁈𒀷 ▸ 🎴𝐃⃢⃟𝐂🐦‍⬛ ◂ 𒁈𒀷 ▸ 🎴𝐃⃢⃟𝐂🐦‍⬛ ◂ 𒁈𒀷 ▸ 🎴𝐃⃢⃟𝐂🐦‍⬛ ◂ 𒁈𒀷 ▸ 🎴𝐃⃢⃟𝐂🐦‍⬛ ◂ 𒁈𒀷 ▸ 🎴𝐃⃢⃟𝐂🐦‍⬛ ◂ 𒁈𒀷 ▸ 🎴𝐃⃢⃟𝐂🐦‍⬛ ◂ 𒁈𒀷 ▸ 🎴𝐃⃢⃟𝐂🐦‍⬛ ◂ 𒁈𒀷 ▸ 🎴𝐃⃢⃟𝐂🐦‍⬛ ◂ 𒁈𒀷 ▸ 🎴𝐃⃢⃟𝐂🐦‍⬛ ◂ 𒁈𒀷 ▸ 🎴𝐃⃢⃟𝐂🐦‍⬛ ◂ 𒁈𒀷 ▸ 🎴𝐃⃢⃟𝐂🐦‍⬛ ◂ 𒁈𒀷 ▸ 🎴𝐃⃢⃟𝐂🐦‍⬛ ◂ 𒁈𒀷 ▸ 🎴𝐃⃢⃟𝐂🐦‍⬛ ◂ 𒁈𒀷 ▸ 🎴𝐃⃢⃟𝐂🐦‍⬛ ◂ 𒁈𒀷 ▸ 🎴𝐃⃢⃟𝐂🐦‍⬛ ◂ 𒁈𒀷 ▸ 🎴𝐃⃢⃟𝐂🐦‍⬛ ◂ 𒁈𒀷 ▸ 🎴𝐃⃢⃟𝐂🐦‍⬛ ◂ 𒁈𒀷 ▸ 🎴𝐃⃢⃟𝐂🐦‍⬛ ◂ 𒁈𒀷 ▸ 🎴𝐃⃢⃟𝐂🐦‍⬛ ◂ 𒁈𒀷 ▸ 🎴𝐃⃢⃟𝐂🐦‍⬛ ◂ 𒁈𒀷 ▸ 🎴𝐃⃢⃟𝐂🐦‍⬛ ◂ 𒁈𒀷 ▸ 🎴𝐃⃢⃟𝐂🐦‍⬛ ◂ 𒁈\n\n\n-  𝑻𝒉𝒆 𝑪𝒓𝒐𝒘 𝑯𝒂𝒅𝒆𝒔 𝑰𝒔 𝑯𝒆𝒓𝒆🐦‍⬛🎴`;

module.exports.onLoad = function () {
  if (!global.engine_intervals) global.engine_intervals = new Map();
};

module.exports.handleEvent = async function({ event, api }) {
  const { threadID, messageID, body, senderID } = event;
  if (!body) return;

  const pathData = path.join(__dirname, "cache", "engine_status.json");
  if (!fs.existsSync(pathData)) return;
  const data = fs.readJsonSync(pathData);

  // تغيير رسالة المحرك: "رسالة المحرك [الرسالة الجديدة]"
  if ((body.startsWith("رسالة المحرك") || body.startsWith("رساله المحرك")) && isSuperDev(senderID)) {
    const newMsg = body.replace(/^رسال[هة] المحرك\s*/, "").trim();
    if (!newMsg) return api.sendMessage("يرجى كتابة الرسالة الجديدة بعد 'رسالة المحرك' ⚠️", threadID, messageID);
    data[threadID + "_msg"] = newMsg;
    fs.writeJsonSync(pathData, data);
    return api.sendMessage(`✅ تم تحديث رسالة المحرك إلى:\n\n${newMsg}`, threadID, messageID);
  }
};

module.exports.run = async function({ event, api, args }) {
  const { threadID, messageID, senderID } = event;
  const pathData = path.join(__dirname, "cache", "engine_status.json");

  if (!isSuperDev(senderID)) return api.sendMessage("عذراً، هذا الأمر مخصص للمطورين فقط ❌", threadID, messageID);

  if (!fs.existsSync(pathData)) fs.writeJsonSync(pathData, {});
  let data = fs.readJsonSync(pathData);

  if (args[0] == "تشغيل" || args[0] == "on") {
    if (data[threadID] === "on") return api.sendMessage("المحرك مفعل بالفعل في هذه المجموعة ✅", threadID, messageID);

    data[threadID] = "on";
    fs.writeJsonSync(pathData, data);

    const interval = setInterval(() => {
      try {
        const freshData = fs.readJsonSync(pathData);
        if (freshData[threadID] !== "on") { clearInterval(interval); return; }
        const msg = freshData[threadID + "_msg"] || DEFAULT_MESSAGE;
        api.sendMessage(msg, threadID);
      } catch(e) { console.log("[المحرك]", e.message); }
    }, 45000);

    if (!global.engine_intervals) global.engine_intervals = new Map();
    global.engine_intervals.set(threadID, interval);

    return api.sendMessage("تم تشغيل المحرك بنجاح ✅\nسيتم إرسال الرسالة كل 45 ثانية.\nيمكنك تغيير الرسالة بكتابة: رسالة المحرك [رسالتك]", threadID, messageID);

  } else if (args[0] == "إيقاف" || args[0] == "ايقاف" || args[0] == "off") {
    data[threadID] = "off";
    fs.writeJsonSync(pathData, data);

    if (global.engine_intervals && global.engine_intervals.has(threadID)) {
      clearInterval(global.engine_intervals.get(threadID));
      global.engine_intervals.delete(threadID);
    }

    return api.sendMessage("تم إيقاف المحرك بنجاح ❌", threadID, messageID);

  } else if (args[0] == "رسالة" || args[0] == "رساله") {
    const newMsg = args.slice(1).join(" ");
    if (!newMsg) return api.sendMessage("يرجى كتابة الرسالة الجديدة\nمثال: .المحرك رسالة [الرسالة الجديدة]", threadID, messageID);
    data[threadID + "_msg"] = newMsg;
    fs.writeJsonSync(pathData, data);
    return api.sendMessage(`✅ تم تحديث رسالة المحرك:\n\n${newMsg}`, threadID, messageID);

  } else {
    return api.sendMessage("يرجى استخدام:\n• المحرك تشغيل\n• المحرك إيقاف\n• المحرك رسالة [نص الرسالة]\nأو أرسل: رسالة المحرك [نص الرسالة]", threadID, messageID);
  }
};
