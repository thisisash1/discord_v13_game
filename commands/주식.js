
// 명령어 코드 (commands 폴더)
const { Message, MessageEmbed } = require('discord.js');
const fs = require('fs');
const QuickChart = require('quickchart-js');

module.exports = {
    name: '주식',
    description: '주식 관련 명령어',
    options: [
        {
            name: "현황",
            description: "현재 주식 현황을 확인합니다.",
            type: "SUB_COMMAND"
        },
        {
            name: "그래프",
            description: "주가 변동 그래프를 출력합니다.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: '주식',
                    type: 'STRING',
                    description: '그래프를 출력할 회사의 이름을 입력해주세요. (띄어쓰기X)',
                    required: true
                }
            ]
        },
        {
            name: '보유',
            description: '보유하고 있는 주식을 확인합니다.',
            type: "SUB_COMMAND"
        },
        {
            name: '매수',
            description: '주식을 구매합니다.',
            type: "SUB_COMMAND",
            options: [
                {
                    name: '주식',
                    type: 'STRING',
                    description: '구매할 주식을 입력해주세요. (띄어쓰기X)',
                    required: true
                },
                {
                    name: '개수',
                    type: 'INTEGER',
                    description: '구매할 주식의 개수를 입력해주세요. (0 입력 시 최대 매수)',
                    required: true
                }
            ]
        },
        {
            name: '매도',
            description: '주식을 판매합니다.',
            type: "SUB_COMMAND",
            options: [
                {
                    name: '주식',
                    type: 'STRING',
                    description: '판매할 주식을 입력해주세요. (띄어쓰기X)',
                    required: true
                },
                {
                    name: '개수',
                    type: 'INTEGER',
                    description: '판매할 주식의 개수를 입력해주세요. (0 입력 시 전체 매도)',
                    required: true
                }
            ]
        }
    ],

    async execute(interaction) {
        if (interaction.channelId !== "1087779685666144266") return

        function commas(num) {
            var parts = num.toString().split(".");
            return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
        }

        function Error(text) {
            const embed = new MessageEmbed()
                .setTitle("오류")
                .setDescription(text)
                .setColor("RED");

            interaction.reply({ embeds: [embed] });
        }

        const command = interaction.options.getSubcommand();
        const Stock = JSON.parse(fs.readFileSync('./stock.json', "utf-8"));

        const { id, name } = { id: interaction.user.id, name: interaction.user.username }
        const filePath = `./data/${id}.json`;

        if (!fs.existsSync(filePath)) return Error('경제 시스템에 가입하지 않으셨습니다! /가입');

        const user = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        const { tag, money, date, stock, xp, level } = user;

        if (command === "현황") {

            const minute = new Date().getMinutes();
            const time = Stock[Stock.length - 1];

            var takenTime;

            if (minute < time) takenTime = (60 - time + minute);
            else takenTime = (minute - time);

            var changeAt = (2 - takenTime) + "분";
            if (2 - takenTime == 0) changeAt = "몇 초";

            takenTime = takenTime + "분"
            if (minute - time == 0) takenTime = "몇 초";

            var news = "";
            const fields = [];

            for (var i = 0; i < Stock.length - 1; i++) {

                var data = Stock[i];

                var { value, event, variance } = data;

                news = !event[0][0] ? news : news + `ㆍ${event[0][0]}\n`;

                var plma = variance < 0 ? "-" : "+";
                var mark = variance < 0 ? "▼" : "▲";

                if (variance < 0) variance = -1 * variance;

                fields.push({ name: data.name, value: '```diff\n' + `${plma} ${commas(value)} (${mark}${commas(variance)})` + '```', inline: true });

            }

            if (news === "") news = "ㆍ없음"

            const labels = [];
            const datas = [];

            for (var i = 0; i < Stock.length - 1; i++) {

                const a = String(Stock[i].name).split('');

                labels.push(a[0] + a[1] + a[2] + a[3]);
                datas.push(Stock[i].variance);

            }

            const chart = new QuickChart();
            chart.setConfig({
                type: 'bar',
                data: {
                    labels,
                    datasets: [
                        {
                            label: "변동량",
                            data: datas,
                        }
                    ],
                },
                options: {
                    scales: {
                        yAxes: [
                            {
                                ticks: {
                                    callback: function (value) {
                                        function commas(num) {
                                            var parts = num.toString().split(".");
                                            return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
                                        }
                                        return commas(value) + "원";
                                    },
                                },
                            },
                        ],
                    },
                },
            });
            chart.setWidth(500).setHeight(300).setBackgroundColor('#FFFFFF');


            try {

                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("주식 현황")
                            .setAuthor(`${takenTime} 전 변동됨`)
                            .setFooter({
                                text: "made by 애쉬"
                                })                    
                            .setDescription('```css\n[ 뉴스 특보 ]\n' + news + '```')
                            .addFields(fields)
                            .setColor("WHITE")
                            .setImage(chart.getUrl())
                    ]
                });

            } catch (error) { }

        }

        else if (command === "보유") {

            const fields = [];

            for (var i = 0; i < Stock.length - 1; i++) {
                if (stock[i] == 0) {

                    fields.push({ name: Stock[i].name, value: "```css\n" + `${commas(stock[i])}주\n${commas(Stock[i].value)}원` + "```", inline: true });

                } else {

                    var wholeMoney = 0;
                    var wholeNumber = 0;

                    for (var k = 0; k < stock[i].length; k++) {
                        wholeMoney = wholeMoney + stock[i][k][0] * stock[i][k][1];
                        wholeNumber = wholeNumber + stock[i][k][0];
                    }

                    const wholeValue = Stock[i].value * wholeNumber;

                    const gain = wholeValue - wholeMoney;
                    const gainRate = Math.floor(wholeValue / wholeMoney * 100);

                    fields.push({ name: Stock[i].name, value: "```css\n" + `${commas(wholeNumber)}주\n${commas(Stock[i].value)}원\n${commas(gain)}원\n${gainRate}%` + "```", inline: true });


                }
            }

            try {

                interaction.reply({ embeds: [new MessageEmbed().setColor("BLUE").setTitle(`${name}의 주식\n`).addFields(fields).setFooter({
                    text: "made by 애쉬"
                    })] });

            } catch (error) { }

        }

        else if (command === "매수") {

            const buyStock = interaction.options.getString('주식');
            var number = interaction.options.getInteger('개수');

            for (var i = 0; i < Stock.length - 1; i++) {
                if (Stock[i].name === buyStock) {

                    var data = Stock[i];
                    const saveStock = [];

                    if (number == 0) number = Math.floor(money / data.value);

                    if (number < 1) return Error("올바른 주식 수를 입력해주세요.");

                    if (money < data.value * number) return Error(`잔액이 부족합니다. (${commas(money)} / ${commas(data.value * number)})\n주식 수에 0 을 입력하면 모든 잔액을 사용하여 매수가 가능해요!`);

                    for (var k = 0; k < Stock.length - 1; k++) {

                        if (i == k) {

                            if (!stock[k]) {

                                saveStock.push([[number, data.value]]);

                            } else {

                                if (isNaN(stock[k])) {

                                    var sameValue = false;

                                    for (var j = 0; j < stock[k].length; j++) {
                                        if (stock[k][j][1] == data.value) {
                                            sameValue = j;
                                        }

                                    }

                                    const stockK = stock[k];

                                    if (sameValue == false) {
                                        stockK.push([number, data.value])
                                    } else {
                                        stockK.splice(sameValue, 1, [stock[k][sameValue][0] + number, stock[k][sameValue][1]])
                                    }
                                    saveStock.push(stockK);

                                }

                            }

                        } else {

                            saveStock.push(stock[k] ? stock[k] : 0);

                        }
                    }

                    fs.writeFileSync(filePath, JSON.stringify({ id, name, tag, money: money - data.value * number, date, stock: saveStock, xp, level }));

                    return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle("매수 성공")
                                .setDescription(`${commas(data.value * number)}원을 지불하여 ${data.name} ${commas(number)} 주를 구매했습니다.\n
                                        현재 잔액: ${commas(money)} => ${commas(money - data.value * number)}`)
                                .setColor("GREEN")
                        ]
                    });

                } else if (i == Stock.length - 2) {

                    Error("입력한 회사를 찾을 수 없습니다.");

                }
            }

        }

        else if (command === "매도") {

            const buyStock = interaction.options.getString('주식');
            var number = interaction.options.getInteger('개수');

            for (var i = 0; i < Stock.length - 1; i++) {
                if (Stock[i].name === buyStock) {

                    var data = Stock[i];
                    const saveStock = [];

                    if (number < 1 && number != 0) return Error("올바른 주식 수를 입력해주세요.");


                    for (var k = 0; k < Stock.length - 1; k++) {

                        if (i == k) {

                            if (stock[k] == 0) return Error(`보유중인 주식이 부족합니다. (${commas(stock[k])} / ${commas(number)})\n주식 수에 0을 입력하면 보유중인 모든 주를 매도할 수 있어요!`);

                            var wholeStock = 0;

                            for (var j = 0; j < stock[k].length; j++) {
                                wholeStock = wholeStock + stock[k][j][0];
                            }

                            if (number == 0) number = wholeStock;

                            if (wholeStock < number) return Error(`보유중인 주식이 부족합니다. (${commas(wholeStock)} / ${commas(number)})\n주식 수에 0을 입력하면 보유중인 모든 주를 매도할 수 있어요!`);


                            var remainNumber = number;

                            var stockK = stock[k];

                            while (remainNumber > 0) {

                                for (var u = 0; u < stock[k].length; u++) {

                                    const a = stock[k][u];

                                    if (a[0] <= remainNumber) {

                                        remainNumber = remainNumber - a[0];

                                        if (stock[k].length == 1) {

                                            stockK = 0;

                                        } else {

                                            stockK.splice(u, 1);

                                            u--;
                                        }

                                    } else {

                                        stockK.splice(u, 1, [a[0] - remainNumber, a[1]]);

                                        remainNumber = 0;

                                    }

                                }
                            }

                            saveStock.push(stockK);


                        } else {

                            saveStock.push(stock[k] ? stock[k] : 0);

                        }

                    }

                    fs.writeFileSync(filePath, JSON.stringify({ id, name, tag, money: money + data.value * number, date, stock: saveStock, xp, level }));

                    return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle("매도 성공")
                                .setDescription(`${data.name} ${commas(number)} 주를 판매하여 ${commas(data.value * number)}원을 획득했습니다.\n
                                    현재 잔액: ${commas(money)} => ${commas(money + data.value * number)}`)
                                .setColor("GREEN")
                        ]
                    });

                } else if (i == Stock.length - 2) {

                    Error("입력한 회사를 찾을 수 없습니다.");

                }
            }

        }

        else if (command === "그래프") {

            const whatStock = interaction.options.getString('주식');

            for (var i = 0; i < Stock.length - 1; i++) {
                if (Stock[i].name === whatStock) {

                    const chart = new QuickChart();
                    chart.setConfig({
                        type: 'line',
                        data: {
                            labels: ['30분전', '28분전', '26분전', '24분전', '22분전', '20분전', '18분전', '16분전', '14분전', '12분전', '10분전', '8분전', '6분전', '4분전', '2분전', '현재'],
                            datasets: [
                                {
                                    label: Stock[i].name,
                                    data: Stock[i].history,
                                }
                            ],
                        },
                        options: {
                            scales: {
                                yAxes: [
                                    {
                                        ticks: {
                                            callback: function (value) {
                                                function commas(num) {
                                                    var parts = num.toString().split(".");
                                                    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
                                                }
                                                return commas(value) + "원";
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    });
                    chart.setWidth(500).setHeight(300).setBackgroundColor('#FFFFFF');

                    const chartEmbed = new MessageEmbed()
                        .setTitle('주식 그래프')
                        .setDescription(`${Stock[i].name}의 2분당 주식 그래프입니다.`)
                        .setImage(chart.getUrl())
                        .setColor("BLUE")

                    return interaction.reply({ embeds: [chartEmbed] });

                } else if (i == Stock.length - 2) {

                    return Error('입력한 회사를 찾을 수 없습니다.')

                }
            }

        }

    }
}