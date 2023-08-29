const { Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const fs = require('fs');
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
	allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
	partials: ["CHANNEL", "MESSAGE"]
});
const { token } = require('./config.json');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('js'));
client.commands = new Collection();
var data = [];
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
	data.push({ name: command.name, description: command.description, options: command.options });
}

client.once('ready', async () => {
	console.log(`${client.user.tag} 이 정상적으로 작동중입니다 ...`);
	client.guilds.cache.forEach(gd => gd.commands.set(data));
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	if (!client.commands.has(interaction.commandName)) return;
	const command = client.commands.get(interaction.commandName);
	try {
		command.execute(interaction, client);
	} catch (error) {
		console.log(error);
	}
});

setInterval(() => {

    const eventList = [
        [["애쉬전자, 새로운 메타버스를 개발", "+"], ["애쉬전자, 챗GPT를 출시", "+"], ["애쉬전자, 내부 기술유출 의혹 제기", "-"], ["애쉬전자, 애쉬회장 횡령 혐의 발견", "-"]],
        [["레오뱅크, 예금 상품 가입자 천만 돌파", "+"], ["레오뱅크, 애쉬전자에 1조원 투자", "+"], ["레오뱅크, 부실채권 대다수 ", "-"], ["레오뱅크, 메타버스 투자 실패", "-"]],
        [["레오뱅크에서 장애아동을 위해 1억을 기부했다.", "+"], ["레오뱅크에서 새 신용카드를 출시했다.", "+"], ["레오뱅크에서 뱅크런 의혹이 발견됐다.", "-"], ["레오뱅크에서 고객정보 유출사고가 발생했다.", "-"]],
        [["나무낸스, 글로벌 거래소 순위 10위 안착", "+"], ["나무낸스, 역대 최대 영업 이익 달성", "+"], ["나무낸스, 코인 시세 조작 의혹", "-"], ["나무낸스, 보안사고 발생", "-"]],
        [["애쉬물산, 1500억 규모 자사주 소각", "+"], ["애쉬물산, 글로벌 건설시장 진출", "+"], ["애쉬물산, 영업손실로 브랜드 구조조정 선언", "-"], ["애쉬물산, 불법 비자금 혐의 발견", "-"]],
        [["얼룩프로, 대규모 수주 계약", "+"], ["얼룩프로, 액면분할 공표", "+"], ["얼룩프로, 내부정보를 통한 부당이익 의혹", "-"], ["얼룩프로, 유상증자", "-"]]
    ]; 

    function fileEdit(number, args) {

        const stockData = JSON.parse(fs.readFileSync('./stock.json', "utf-8"));

        const minute = new Date().getMinutes();
        saveFile = [];

        for (var k = 0; k < stockData.length; k++) {
            saveFile.push(k == number ? args : k == stockData.length - 1 ? minute : stockData[k]);
        }

        fs.writeFileSync(`./stock.json`, JSON.stringify(saveFile));
    }

    for (var i = 0; i < eventList.length; i++) {

        const Stock = JSON.parse(fs.readFileSync('./stock.json', "utf-8"));

        var Plma = ["+", "-"][Math.floor(Math.random() * 2)]; // 50% 확률로 주가가 증가/감소
        var fluctuations;

        const data = Stock[i];
        const { name, value, event, history } = data;

        history.splice(0, 1);

        if (event[0] != false) { // 현재 이벤트 기간이라면
            if (event[1] == event[2]) { // 이벤트 마지막 일째라면

                history.push(value);
                fileEdit(i, { name, value, event: [false, 0, 0], variance: 0, history }); // 이벤트 제거

            } else { // 이벤트 마지막 일째가 아니라면
                Plma = event[0][1]; // 위에서 "+", "-" 정한거에 따라 증가할지 감소할지 지정
                fluctuations = Math.floor(Math.random() * 500 + 500);
                /**
                 *  증가량을 지정
                 * 
                 *  n + m 이면 m 에서 (n + m) 중에서 랜덤한 값
                 */

                if (Plma === "-") fluctuations = -fluctuations; // 감소하는 이벤트이면 증가량이 음수
                if (value + fluctuations > 100) { // 변동을 했는데 그 값이 100 초과면 그냥 그대로 하고

                    history.push(value + fluctuations);
                    fileEdit(i, { name, value: value + fluctuations, event: [event[0], event[1] + 1, event[2]], variance: fluctuations, history });

                } else { // 100보다 작으면 그냥 취소하는 코드

                    history.push(value);
                    fileEdit(i, { name, value, event: [event[0], event[1] + 1, event[2]], variance: 0, history });

                }
            }
        } else { // 여기는 이제 이벤트중이 아닐때
            Plma = (value - 100 < 0) ? "+" : (["+", "-"][Math.floor(Math.random() * 2)]); // 현재 주가가 100보다 작으면 주가를 증가시키고, 그게 아니면 50%확률로 증가 또는 감소
            fluctuations = Math.floor(Math.random() * 90 + 10);
            /**
             * 이것도 아까랑 마찬가지로 10에서 100 중 랜덤 
             * 그 뽑은 수가 변동량이 됨
             */
            if (Plma === "-") fluctuations = -fluctuations; // 감소하는 이벤트이면 증가량이 음수
            if (value + fluctuations > 100) { // 100 보다 크면 그냥 그대로 변동시키고 100보다 작으면 그냥 취소

                history.push(value);
                fileEdit(i, { name, value: value + fluctuations, event, variance: fluctuations, history });

            }
        }

    }

    const Stock = JSON.parse(fs.readFileSync('./stock.json', "utf-8"));

    // 여기가 이제 이벤트를 랜덤으로 생성하는 곳
    if (Math.floor(Math.random() * 3 + 1) == 1) { // 이거는 3분의 1 확률로 실행

        const dataNumber = Math.floor(Math.random() * eventList.length); // 회사들 중에서 랜덤회사 하나를 뽑는코드
        const data = Stock[dataNumber]; // 뽑은 회사의 데이터를 불러옴
        const { name, value, variance, history } = data;

        const eventNumber = Math.floor(Math.random() * (value - 2000 > 100 ? eventList[dataNumber].length : 2)); // 뽑은 회사의 (현재 주가 - 2000)이 100보다 크면 이벤트 목록중에서 증가하는 이벤트를 선택하고 그게 아니라면 그냥 증가하거나 감소하거나 아무거나 뽑음
        const eventDays = Math.floor(Math.random() * 5 + 1); // 이벤트 일수: 1 ~ 6일

        if (data.event[0] != false) return;
        const eventContent = [eventList[dataNumber][eventNumber][0], eventList[dataNumber][eventNumber][1]];

        fileEdit(dataNumber, { name, value, event: [eventContent, 0, eventDays], variance, history }); // 생성된 이벤트 정보를 파일에 저장함

    }

}, 2 * 60 * 1000);

client.login(token)