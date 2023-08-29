const { Message, MessageEmbed } = require("discord.js");
const fs = require("fs");

module.exports = {
  name: "가입",
  description: "콩즈 커뮤니티 가입",

  async execute(interaction) {
    if (interaction.channelId !== "1087779685666144266") return;
    const id = interaction.user.id;
    const name = interaction.user.username;
    const filePath = `./data/${id}.json`;
    if (!fs.existsSync(filePath)) {
      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("가입 성공")
            .setDescription(
              "경제 시스템에 가입되었습니다.\n\n가입지원금 10000원을 지급해드렸습니다."
            )
            .setColor("GREEN")
            .setThumbnail(interaction.user.displayAvatarURL())
            .setFooter({
              text: "made by 애쉬",
            }),
        ],
      });
      return fs.writeFileSync(
        filePath,
        JSON.stringify({
          id,
          name,
          money: 10000,
          date: "",
          stock: [],
          xp: 0,
          level: 1,
        })
      ); //money : 지급, stock:[0,0,0,0] 회사 수 만큼
    } else {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("오류")
            .setDescription("이미 등록된 회원입니다.")
            .setColor("RED")
            .setThumbnail(interaction.user.displayAvatarURL())
            .setFooter({
              text: "made by 애쉬",
            }),
        ],
      });
    }
  },
};
