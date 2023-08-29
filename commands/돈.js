const { Message, MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: '월렛',
    description: '잔액 확인.',
    options:
        [{
            name: '대상',
            type: 'USER',
            description: '잔액을 확인할 유저를 지정해주세요. (지정하지 않으면 자신의 잔액을 확인합니다.)',
            required: false,
        }],

    async execute(interaction) {
        if (interaction.channelId !== "1087779685666144266") return
        var target;
        !interaction.options.getUser('대상') ? target = interaction.user : target = interaction.options.getUser('대상');

        const filePath = `./data/${target.id}.json`;
        if (fs.existsSync(filePath)) {
            const user = JSON.parse(fs.readFileSync(filePath, "utf-8"));
            function commas(num) {
                var parts = num.toString().split(".");
                return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
            }
            return interaction.reply({ embeds: [new MessageEmbed()
                .setTitle(`${user.name}의 잔액`)
                .setDescription(`${commas(user.money)}원`)
                .setColor("YELLOW")
                .setThumbnail(interaction.user.displayAvatarURL())
                .setFooter({
                    text: "made by 애쉬"
                    })] });
        } else {
            return interaction.reply({ embeds: [new MessageEmbed().setTitle('오류').setDescription('대상의 돈 정보를 불러올 수 없습니다.').setColor("RED")
            .setFooter({
                text: "made by 애쉬"
                })] });
        }
    }
}