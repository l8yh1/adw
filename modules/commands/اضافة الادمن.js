const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "اضافة الادمن",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "الوكيل",
  description: "إضافة مستخدم كأدمن بوت عبر معرفه",
  commandCategory: "المطور",
  usages: "[معرف المستخدم]",
  cooldowns: 3
};

function isSuperDev(senderID) {
  try {
    const configPath = path.join(global.client.mainPath, "config.json");
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    return (config.SUPERADMIN || []).includes(senderID);
  } catch(e) { return false; }
}

module.exports.run = async function({ event, api, args }) {
  const { threadID, messageID, senderID } = event;

  if (!isSuperDev(senderID)) return api.sendMessage("عذراً، هذا الأمر مخصص للمطورين الرئيسيين فقط ❌", threadID, messageID);

  let targetID = args[0];

  if (!targetID && event.type === "message_reply") {
    targetID = event.messageReply.senderID;
  }

  if (!targetID) return api.sendMessage("يرجى ذكر معرف المستخدم أو الرد على رسالته\nمثال: .اضافة الادمن 12345678", threadID, messageID);

  const configPath = path.join(global.client.mainPath, "config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

  if (!config.ADMINBOT) config.ADMINBOT = [];
  if (config.ADMINBOT.includes(targetID)) return api.sendMessage(`المستخدم ${targetID} موجود بالفعل في قائمة الأدمن ✅`, threadID, messageID);

  config.ADMINBOT.push(targetID);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 4), "utf-8");

  return api.sendMessage(`✅ تمت إضافة المستخدم ${targetID} كأدمن بوت بنجاح!\nصلاحياته مفعلة الآن.`, threadID, messageID);
};
