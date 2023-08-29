const { Message, MessageEmbed } = require('discord.js');
const fs = require('fs')

module.exports = {
    name: '순위',
    description: '자산 순위를 출력합니다.',

    async execute(interaction) {
        if (interaction.channelId !== "1087779685666144266") return
        var fields = [];
        var field = [];
        const filePath = fs.readdirSync('./data').filter(file => file.endsWith('.json'));
        for (const file of filePath) {
            const data = JSON.parse(fs.readFileSync(`./data/${file}`, "utf-8"));
            field.push({ id: data.id, money: data.money, xp: data.xp, level: data.level });
            i++;
        }
        function commas(num) {
            var parts = num.toString().split(".");
            return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
        }
        field.sort(function (a, b) {
            return b.money - a.money;
        });
        for (var i = 0; i < 10; i++) {
            fields.push({ name: `${i + 1}위`, value: `<${field[i].id}> 님: ${commas(field[i].money)}원` });
        }
        interaction.reply({ embeds: [new MessageEmbed().setTitle("자산 순위").addFields(fields).setColor("BLUE")
        .setFooter({
            text: "made by 애쉬"
            })] });
    }
}