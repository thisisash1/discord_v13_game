const { Message, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: '도박',
    description: '콩지노에 오신걸 시작합니다.',
    options: [
        {
            name: '도박',
            type: 'STRING',
            description: '시작할 도박을 선택해주세요.',
            required: true,
            choices: [
                {
                    name: '주사위',
                    value: 'dice'
                },
                {
                    name: '콩즈찾기',
                    value: 'cup'
                },
                {
                    name: '가위바위보',
                    value: 'rps'
                },
                {
                    name: '콩즈마진',
                    value: 'gostop'
                }
            ]
        },
        {
            name: '배팅금',
            type: 'INTEGER',
            description: '배팅할 금액을 입력해주세요. (0 입력시 올인 배팅)',
            required: true,
        }
    ],

    async execute(interaction) {
        if (interaction.channelId !== "1087779685666144266") return
        try {

            const { id, name } = { id: interaction.user.id, name: interaction.user.username }
            const filePath = `./data/${id}.json`;

            if (!fs.existsSync(filePath)) return interaction.reply({ embeds: [new MessageEmbed().setTitle('오류').setDescription('경제 시스템에 가입하지 않으셨습니다.').setColor("RED")] });

            const user = JSON.parse(fs.readFileSync(filePath, "utf-8"));
            const { tag, money, date, stock, xp, level } = user;

            const gamble = interaction.options.getString('도박');
            var betted = interaction.options.getInteger('배팅금');

            if (betted == 0) betted = money;

            function commas(num) {
                var parts = num.toString().split(".");
                return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
            }


               if (betted > 0) {
                if (money >= betted) {
                    switch (gamble) {

                        case "dice":

                            const Player_1 = Math.floor(Math.random() * 6 + 1);
                            const Player_2 = Math.floor(Math.random() * 6 + 1);
                            const Match_1 = Math.floor(Math.random() * 6 + 1);
                            const Match_2 = Math.floor(Math.random() * 6 + 1);

                            var result;
                            if (Player_1 + Player_2 > Match_1 + Match_2) {
                                result = [`🎲 <@${id}>, 승리! 배팅금의 두 배를 드렸어요.\n현재 잔액: **${commas(money + betted)}원**`, `🎲 <@${id}>, 대단해요, 두 배의 돈을 받아가세요.\n현재 잔액: **${commas(money + betted)}원**`];
                                result = result[Math.floor(Math.random() * 2)];
                                Game_End(true);
                            } else if (Player_1 + Player_2 < Match_1 + Match_2) {
                                result = [`🎲 <@${id}>, 패배! 배팅금은 콩즈봇이 가져갑니다.\n현재 잔액: **${commas(money - betted)}원**`, `🎲 <@${id}>, 아쉽네요, 배팅금은 가져갈게요.\n현재 잔액: **${commas(money - betted)}원**`];
                                result = result[Math.floor(Math.random() * 2)];
                                Game_End(false);
                            } else {
                                result = [`🎲 <@${id}>, 비겼습니다! 배팅금은 돌려드릴게요.\n현재 잔액: **${commas(money)}원**`, `🎲 <@${id}>, 비겼네요, 배팅금은 가져가세요.\n현재 잔액: **${commas(money)}원**`];
                                result = result[Math.floor(Math.random() * 2)];
                            };

                            await interaction.reply({ embeds: [new MessageEmbed().setDescription(`🎲 <@${id}> 님이 ${commas(betted)}원을 걸고 주사위를 던졌습니다.`).setColor("2F3136")] });
                            setTimeout(async() => {
                                await interaction.channel.send({ embeds: [new MessageEmbed().setDescription(`🎲 <@${id}> 님은 ${Player_1}, 그리고 ${Player_2} 이(가) 나왔습니다.`).setColor("2F3136")] });
                                setTimeout(async() => {
                                    await interaction.channel.send({ embeds: [new MessageEmbed().setDescription(`🎲 <@${id}> 님의 상대 콩즈봇은 ${Match_1}, 그리고 ${Match_2} 이(가) 나왔습니다.`).setColor("2F3136")] });
                                    setTimeout(async() => {
                                        await interaction.channel.send({ embeds: [new MessageEmbed().setDescription(result).setColor("2F3136")] });
                                    }, 3000);
                                }, 3000);
                            }, 3000);

                            function Game_End(WIN) {
                                switch (WIN) {
                                    case true:
                                        fs.writeFileSync(filePath, JSON.stringify({ id, name, tag: interaction.user.tag, money: money + betted, date, stock, xp, level }));
                                        break;

                                    case false:
                                        fs.writeFileSync(filePath, JSON.stringify({ id, name, tag: interaction.user.tag, money: money - betted, date, stock, xp, level }));
                                        break;
                                }
                            }
                            break;

                        case "cup":

                            var Answer = Math.floor(Math.random() * 3 + 1);
                            var Picture = "";
                            const MainPic = "https://majestic-maamoul-7bf13f.netlify.app/KakaoTalk_Photo_2023-03-22-01-33-02%20001.jpeg";
                            if (Answer == 1) Picture = "https://majestic-maamoul-7bf13f.netlify.app/1.jpeg";
                            if (Answer == 2) Picture = "https://majestic-maamoul-7bf13f.netlify.app/2.jpeg";
                            if (Answer == 3) Picture = "https://majestic-maamoul-7bf13f.netlify.app/3.jpeg";


                            const row = new MessageActionRow()
                                .addComponents(
                                    new MessageButton()
                                        .setCustomId('first')
                                        .setLabel('첫번째')
                                        .setStyle('SUCCESS'),
                                ).addComponents(
                                    new MessageButton()
                                        .setCustomId('second')
                                        .setLabel('두번째')
                                        .setStyle('SUCCESS')
                                ).addComponents(
                                    new MessageButton()
                                        .setCustomId('third')
                                        .setLabel('세번째')
                                        .setStyle('SUCCESS')
                                ).addComponents(
                                    new MessageButton()
                                        .setCustomId('cancel')
                                        .setLabel('취소')
                                        .setStyle('DANGER')
                                )
                            const filter = i => i.user.id === interaction.user.id;

                            await interaction.reply({
                                embeds:
                                    [new MessageEmbed()
                                        .setTitle("좀비콩즈 찾기")
                                        .setDescription(`<@${interaction.user.id}> **${commas(betted)}**원을 걸고 좀비콩즈 찾기 시작!\n아래 콩즈 중 1개의 콩즈을 골라 번호 클릭해주세요.\n좀비를 고르면 배팅금의 1.5배를 받습니다.`)
                                        .setImage(MainPic)
                                        .setColor("#FFFFF0")
                                        .setFooter({
                                            text: "made by 애쉬"
                                            })],
                                components: [row]
                            });

                            const collector = interaction.channel.createMessageComponentCollector({ filter, max: 1 });

                            collector.on('collect', async i => {

                                if (i.user.id !== interaction.user.id) return;

                                switch (i.customId) {
                                    case "first":
                                        Picked(1);
                                        break;

                                    case "second":
                                        Picked(2);
                                        break;

                                    case "third":
                                        Picked(3);
                                        break;

                                    case "cancel":
                                        Picked(4);
                                        break;
                                }

                                async function Picked(Cup) {
                                    if (Cup == 4) {
                                        return await interaction.editReply({ embeds: [new MessageEmbed().setTitle("좀비콩즈 찾기").setDescription(`좀비콩즈 찾기가 취소되었습니다.\n좀비콩즈는 ${Answer}번이었습니다.`).setImage(Picture).setColor("#FFFFF0")
                                        .setFooter({
                                            text: "made by 애쉬"
                                            })], components: [] })
                                    }
                                    else if (Cup == Answer) {
                                        await interaction.editReply({ embeds: [new MessageEmbed().setTitle("좀비콩즈 찾기").setDescription(`<@${interaction.user.id}>, 정답! 배팅금의 50%를 획득하셨습니다.` + '```+ ' + commas(Math.floor(betted * 50 / 100)) + '원```').setColor('#FFFFF0').setImage(Picture)
                                        .setFooter({
                                            text: "made by 애쉬"
                                            })], components: [] });
                                        return fs.writeFileSync(filePath, JSON.stringify({ id, name, tag: interaction.user.tag, money: money + Math.floor(betted * 50 / 100), date, stock, xp, level }));
                                    } else {
                                        await interaction.editReply({ embeds: [new MessageEmbed().setTitle("좀비콩즈 찾기").setDescription(`<@${interaction.user.id}>, 틀렸습니다! 배팅금의 50%을 잃으셨습니다.` + '```- ' + commas(Math.floor(betted * 50 / 100)) + '원```').setColor('#FFFFF0').setImage(Picture)
                                        .setFooter({
                                            text: "made by 애쉬"
                                            })], components: [] });
                                        return fs.writeFileSync(filePath, JSON.stringify({ id, name, tag: interaction.user.tag, money: money - Math.floor(betted * 50 / 100), date, stock, xp, level }));
                                    }
                                }

                            });
                            break;

                            case "rps":

                            const embed1 = new MessageEmbed()
                                .setTitle("가위바위보")
                                .setDescription(`콩즈봇을 이겨라!\n승리시 ${commas(betted)}원을 드립니다!`)
                                .setColor("BLUE");

                            const embed2 = new MessageEmbed()
                                .setTitle("시간 초과")
                                .setDescription(`가위바위보 게임이 취소되었습니다.`)
                                .setColor("RED");

                            const embed3 = new MessageEmbed()
                                .setTitle("가위바위보")
                                .setColor("BLUE")
                                .setTimestamp();

                            const actionrow1 = new MessageActionRow()
                                .addComponents(
                                    new MessageButton()
                                        .setLabel("가위")
                                        .setCustomId("s")
                                        .setStyle("PRIMARY")
                                )
                                .addComponents(
                                    new MessageButton()
                                        .setLabel("바위")
                                        .setCustomId("r")
                                        .setStyle("PRIMARY")
                                )
                                .addComponents(
                                    new MessageButton()
                                        .setLabel("보")
                                        .setCustomId("p")
                                        .setStyle("PRIMARY")
                                )

                            const amessage = await interaction.reply({ embeds: [embed1], components: [actionrow1] });

                            const filter1 = i => i.user.id === interaction.user.id;
                            const collector1 = await interaction.channel.createMessageComponentCollector({ filter1, max: 1 });

                            collector1.on("collect", async i => {

                                try {await i.deferUpdate();} catch(e) {}

                                if (i.user.id !== interaction.user.id) return;

                                const bot = ["s", "r", "p"][Math.floor(Math.random() * 3)];
                                var winner;
                                var result;

                                if (bot === i.customId) {

                                    result = `무승부! 배팅금은 다시 돌려드릴게요!`;

                                } else {

                                    i.customId === "s" ? (winner = bot === "r" ? "bot" : "player") : null;
                                    i.customId === "r" ? (winner = bot === "p" ? "bot" : "player") : null;
                                    i.customId === "p" ? (winner = bot === "s" ? "bot" : "player") : null;

                                }



                                if (winner === "bot") {

                                    result = ["콩즈봇 승리!", "콩즈봇 승리!", "콩즈봇 승리!"][Math.floor(Math.random() * 3)] + `\n-${betted}원`;

                                    fs.writeFileSync(filePath, JSON.stringify({ id, name, tag, money: money - betted, date, stock, xp, level }));

                                } else if (winner === "player") {

                                    result = ["`축하드립니다!", "축하드립니다!", "축하드립니다!"][Math.floor(Math.random() * 3)] + `\n+${betted}원`;

                                    fs.writeFileSync(filePath, JSON.stringify({ id, name, tag, money: money + betted, date, stock, xp, level }));

                                }

                                var embedText = ``;

                                async function EditReply(text) {
                                    embedText = embedText + text;
                                    
                                    await interaction.editReply({ embeds: [embed3.setDescription("```" + embedText + "```")], components: [] });
                                }

                                EditReply(`${name}님은 ${korean(i.customId)}를 내셨습니다.`);

                                setTimeout(() => { EditReply(`\n콩즈봇은 ${korean(bot)}를 냈어요.`) }, 2000)

                                setTimeout(() => { EditReply(`\n${result}`) }, 4000)


                                function korean(text) {
                                    return text === "s" ? "가위" : text === "r" ? "바위" : text === "p" ? "보" : null;
                                }

                            });

                            break;

                        case "gostop":

                            /**확률에 따라 true / false 를 반환하는 함수*/
                            const random = (percent) => Math.floor(Math.random() * 100) < percent ? true : false;
                            const survivePer = [90, 75, 50, 30, 10, 1];
                            const surviveReward = [110, 125, 150, 175, 200, 300];

                            

                            const actionrow1_ = new MessageActionRow()
                                .addComponents(
                                    new MessageButton()
                                        .setCustomId("start")
                                        .setStyle("SECONDARY")
                                        .setLabel("매수")
                                )

                            const actionrow2 = new MessageActionRow()
                                .addComponents(
                                    new MessageButton()
                                        .setCustomId("go")
                                        .setStyle("SECONDARY")
                                        .setLabel("매수")
                                )
                                .addComponents(
                                    new MessageButton()
                                        .setCustomId("stop")
                                        .setStyle("SECONDARY")
                                        .setLabel("수익실현")
                                )

                            try {
                                await interaction.reply({
                                    embeds: [
                                        new MessageEmbed()
                                            .setTitle("콩즈마진")
                                            .setDescription(`<@${interaction.user.id}>님이 ${commas(betted)}원을 걸고 레버리지를 시작했습니다!\n준비가 되었다면 매수 버튼을 눌러주세요!`)
                                            .setColor("YELLOW")
                                            .setFooter({
                                                text: "made by 애쉬"
                                                })

                                    ], components: [actionrow1_]
                                });
                            } catch (error) { console.log(error) }

                            var embedDescription = "";
                            var round = 0;


                            const filter_ = (i) => i.user.id === interaction.user.id;

                            /**다음 라운드로 넘어가는 함수*/
                            const nextRound = async () => {

                                try {

                                    interaction.channel.createMessageComponentCollector({ filter_, max: 1 }).on("collect", async i => {

                                        if (!i.isButton()) return;

                                        if (i.user.id !== interaction.user.id) return;

                                        try {await i.deferUpdate();} catch (e) {}

                                        var survived;

                                        if (i.customId === "stop") {

                                            embedDescription += `게임이 종료되었습니다. 보상으로 총 ${commas(betted * surviveReward[round] / 100)}원을 획득했습니다!`;

                                            fs.writeFileSync(filePath, JSON.stringify({ id, name, tag, money: money + betted * surviveReward[round] / 100, date, stock, xp, level }));

                                            const embed = new MessageEmbed()
                                                .setTitle("콩즈마진")
                                                .setDescription(embedDescription)
                                                .setColor("YELLOW")
                                                .setFooter({
                                                    text: "made by 애쉬"
                                                    })

                                            interaction.editReply({ embeds: [embed], components: [] })

                                        } else {

                                            /**게임 임베드 문구를 수정하는 함수*/
                                            const Send = async (text, actionrow) => {

                                                embedDescription += `${text}\n`;

                                                const embed = new MessageEmbed()
                                                    .setTitle("콩즈마진")
                                                    .setDescription(embedDescription)
                                                    .setColor("YELLOW")
                                                    .setFooter({
                                                        text: "made by 애쉬"
                                                        })

                                                if (actionrow)
                                                    try{await interaction.editReply({ embeds: [embed], components: [actionrow2] })}catch(e){}

                                                else
                                                    try{await interaction.editReply({ embeds: [embed], components: [] });}catch(e){}

                                            }

                                            Send(`**콩즈마진 START**`);

                                            setTimeout(() => {

                                                survived = random(survivePer[round]);

                                                if (survived) {

                                                    Send(`**"수익 적중!"** 청산당할 확률은 **${100 - survivePer[round]}%**이었습니다.`, false);

                                                    setTimeout(() => Send(`현재 쌓인 금액은 **${commas(betted * surviveReward[round] / 100)}원** 입니다. 다음 금액: **${commas(betted * surviveReward[round + 1] / 100)}원**\n`, true), 2000);

                                                    round++;

                                                    nextRound();

                                                } else {

                                                    Send(`**"수익 실패!"** 지지선이 뚫렸습니다. 청산당할 확률은 **${100 - survivePer[round]}%**이었습니다.`, false);

                                                    setTimeout(() => Send(`**${commas(betted * surviveReward[round] / 100)}원**을 잃었습니다.`, false), 2000)

                                                    fs.writeFileSync(filePath, JSON.stringify({ id, name, tag, money: money - betted * surviveReward[round] / 100, date, stock, xp, level }));

                                                }

                                            }, 3000);

                                        }

                                    });
                                } catch (error) {
                                    interaction.channel.send({ embeds: [new MessageEmbed().setTitle('에러').setDescription(`오류가 발생했습니다.\n오류 내용을 캡쳐해서 Meta Kongz_애쉬에게 보내주세요!\n` + '```' + `오류 내용: ${error}\n` + '```').setColor('RED')] });
                                }

                            }

                            nextRound();


                            break;

                        default:
                            return interaction.reply({ embeds: [new MessageEmbed().setTitle("오류").setDescription("입력한 게임을 찾을 수 없습니다.").setColor("RED")] });
                    }
                } else {
                    return interaction.reply({ embeds: [new MessageEmbed().setTitle("오류").setDescription(`잔액이 부족합니다.\n현재 잔액: ${money}`).setColor("RED")] });
                }
            } else {
                return interaction.reply({ embeds: [new MessageEmbed().setTitle("오류").setDescription("배팅금은 양의 정수여야 합니다.").setColor("RED")] });
            }
        } catch (error) {
            console.log(error);
            interaction.channel.send({ embeds: [new MessageEmbed().setTitle('에러').setDescription(`오류가 발생했습니다.\n오류 내용을 캡쳐해서 Meta Kongz_애쉬에게 보내주세요!\n` + '```' + `오류 내용: ${error}\n` + '```').setColor('RED')] });
        }
    }
}