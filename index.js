import fs from 'fs';
import cron from "node-cron";

const API_KEY = "8f72096a-b39b-4913-8812-39b89240d2fd";  // Thay API Key của bạn

const TELEGRAM_BOT_TOKEN = "8044801886:AAEyfSG2Fmnf3M_clN64hEIHhS9P0-D094c";  // Thay bằng token từ BotFather
const CHAT_ID = "5710130520";  // Thay bằng ID user hoặc nhóm


// File lưu trữ dữ liệu đã gửi
const SENT_DATA_FILE = 'sentData.json';














// Biến lưu trữ dữ liệu từ tất cả API
let fetchedData = [];

// Danh sách các API cần gọi
const API_URLS = [
    'https://api.coinalyze.net/v1/predicted-funding-rate?symbols=BTCUSDT_PERP.A,ETHUSDT_PERP.A,XRPUSDT_PERP.A,BNBUSDT_PERP.A,SOLUSDT_PERP.A,USDCUSDT_PERP.A,DOGEUSDT_PERP.A,ADAUSDT_PERP.A,TRXUSDT_PERP.A,LINKUSDT_PERP.A,AVAXUSDT_PERP.A,XLMUSDT_PERP.A,TONUSDT_PERP.A,HBARUSDT_PERP.A,1000SHIBUSDT_PERP.A,SUIUSDT_PERP.A,DOTUSDT_PERP.A,LTCUSDT_PERP.A,BCHUSDT_PERP.A,OMUSDT_PERP.A',
    'https://api.coinalyze.net/v1/predicted-funding-rate?symbols=UNIUSDT_PERP.A,XMRUSDT_PERP.A,NEARUSDT_PERP.A,APTUSDT_PERP.A,1000PEPEUSDT_PERP.A,FETUSDT_PERP.A,ICPUSDT_PERP.A,ONDOUSDT_PERP.A,AAVEUSDT_PERP.A,ETCUSDT_PERP.A,POLUSDT_PERP.A,TRUMPUSDT_PERP.A,VETUSDT_PERP.A,TAOUSDT_PERP.A,ENAUSDT_PERP.A,RENDERUSDT_PERP.A,TIAUSDT_PERP.A,FILUSDT_PERP.A,KASUSDT_PERP.A,ATOMUSDT_PERP.A',
    'https://api.coinalyze.net/v1/predicted-funding-rate?symbols=ARBUSDT_PERP.A,ALGOUSDT_PERP.A,SUSDT_PERP.A,IPUSDT_PERP.A,JUPUSDT_PERP.A,DEXEUSDT_PERP.A,OPUSDT_PERP.A,MOVEUSDT_PERP.A,IMXUSDT_PERP.A,WLDUSDT_PERP.A,1000BONKUSDT_PERP.A,MKRUSDT_PERP.A,INJUSDT_PERP.A,STXUSDT_PERP.A,GRTUSDT_PERP.A,SEIUSDT_PERP.A,THETAUSDT_PERP.A,QNTUSDT_PERP.A,LDOUSDT_PERP.A,FORMUSDT_PERP.A',
    'https://api.coinalyze.net/v1/predicted-funding-rate?symbols=EOSUSDT_PERP.A,BERAUSDT_PERP.A,GALAUSDT_PERP.A,CAKEUSDT_PERP.A,SANDUSDT_PERP.A,XTZUSDT_PERP.A,JTOUSDT_PERP.A,IOTAUSDT_PERP.A,BSVUSDT_PERP.A,FLOWUSDT_PERP.A,CRVUSDT_PERP.A,1000FLOKIUSDT_PERP.A,KAIAUSDT_PERP.A,SUPERUSDT_PERP.A,ENSUSDT_PERP.A,PYTHUSDT_PERP.A,JASMYUSDT_PERP.A,1000SATSUSDT_PERP.A,SPXUSDT_PERP.A,ZECUSDT_PERP.A',
    'https://api.coinalyze.net/v1/predicted-funding-rate?symbols=AXSUSDT_PERP.A,NEOUSDT_PERP.A,FARTCOINUSDT_PERP.A,EGLDUSDT_PERP.A,MANAUSDT_PERP.A,WIFUSDT_PERP.A,KAVAUSDT_PERP.A,VIRTUALUSDT_PERP.A,ARUSDT_PERP.A,RONINUSDT_PERP.A,STRKUSDT_PERP.A,PENDLEUSDT_PERP.A,CFXUSDT_PERP.A,CHZUSDT_PERP.A,1000XECUSDT_PERP.A,BEAMXUSDT_PERP.A,RUNEUSDT_PERP.A,PENGUUSDT_PERP.A,DYDXUSDT_PERP.A,RSRUSDT_PERP.A',
    'https://api.coinalyze.net/v1/predicted-funding-rate?symbols=AEROUSDT_PERP.A,APEUSDT_PERP.A,AXLUSDT_PERP.A,COMPUSDT_PERP.A,TWTUSDT_PERP.A,PLUMEUSDT_PERP.A,1MBABYDOGEUSDT_PERP.A,GRASSUSDT_PERP.A,BRETTUSDT_PERP.A,MELANIAUSDT_PERP.A,1000LUNCUSDT_PERP.A,AKTUSDT_PERP.A,MINAUSDT_PERP.A,MORPHOUSDT_PERP.A,KAITOUSDT_PERP.A,ZROUSDT_PERP.A,SNXUSDT_PERP.A,1INCHUSDT_PERP.A,KSMUSDT_PERP.A,WUSDT_PERP.A',
    'https://api.coinalyze.net/v1/predicted-funding-rate?symbols=ZKUSDT_PERP.A,DASHUSDT_PERP.A,GLMUSDT_PERP.A,LAYERUSDT_PERP.A,EIGENUSDT_PERP.A,NOTUSDT_PERP.A,BLURUSDT_PERP.A,SFPUSDT_PERP.A,ASTRUSDT_PERP.A,ZILUSDT_PERP.A,CKBUSDT_PERP.A,IDUSDT_PERP.A,ROSEUSDT_PERP.A,POPCATUSDT_PERP.A,SAFEUSDT_PERP.A,ZRXUSDT_PERP.A,ACHUSDT_PERP.A,BATUSDT_PERP.A,QTUMUSDT_PERP.A,LPTUSDT_PERP.A',
    'https://api.coinalyze.net/v1/predicted-funding-rate?symbols=AI16ZUSDT_PERP.A,VTHOUSDT_PERP.A,ZETAUSDT_PERP.A,CELOUSDT_PERP.A,MASKUSDT_PERP.A,1000000MOGUSDT_PERP.A,VANAUSDT_PERP.A,ORDIUSDT_PERP.A,PNUTUSDT_PERP.A,MOCAUSDT_PERP.A,HOTUSDT_PERP.A,MEWUSDT_PERP.A,ANKRUSDT_PERP.A,GASUSDT_PERP.A,RVNUSDT_PERP.A,FXSUSDT_PERP.A,SUSHIUSDT_PERP.A,WOOUSDT_PERP.A,ACTUSDT_PERP.A,ONEUSDT_PERP.A',
    'https://api.coinalyze.net/v1/predicted-funding-rate?symbols=DRIFTUSDT_PERP.A,YFIUSDT_PERP.A,ENJUSDT_PERP.A,REDUSDT_PERP.A,IOTXUSDT_PERP.A,TUSDT_PERP.A,TURBOUSDT_PERP.A,MEUSDT_PERP.A,ETHWUSDT_PERP.A,SKLUSDT_PERP.A,UXLINKUSDT_PERP.A,SUNUSDT_PERP.A,KDAUSDT_PERP.A,ETHFIUSDT_PERP.A,ZENUSDT_PERP.A,LRCUSDT_PERP.A,LUNA2USDT_PERP.A,GUSDT_PERP.A,GMTUSDT_PERP.A,COTIUSDT_PERP.A',
    'https://api.coinalyze.net/v1/predicted-funding-rate?symbols=ONTUSDT_PERP.A,MUBARAKUSDT_PERP.A,GMXUSDT_PERP.A,ARKMUSDT_PERP.A,POLYXUSDT_PERP.A,SXPUSDT_PERP.A,BANDUSDT_PERP.A,HMSTRUSDT_PERP.A,IOUSDT_PERP.A,BIOUSDT_PERP.A,ORCAUSDT_PERP.A,COWUSDT_PERP.A,B3USDT_PERP.A,HIVEUSDT_PERP.A,AUCTIONUSDT_PERP.A,BICOUSDT_PERP.A,STORJUSDT_PERP.A,NEIROUSDT_PERP.A,UMAUSDT_PERP.A,ACXUSDT_PERP.A',
    'https://api.coinalyze.net/v1/predicted-funding-rate?symbols=NILUSDT_PERP.A,AEVOUSDT_PERP.A,METISUSDT_PERP.A,MANTAUSDT_PERP.A,RPLUSDT_PERP.A,ANIMEUSDT_PERP.A,ICXUSDT_PERP.A,FLUXUSDT_PERP.A,BOMEUSDT_PERP.A,PIXELUSDT_PERP.A,PROMUSDT_PERP.A,USUALUSDT_PERP.A,MEMEUSDT_PERP.A,WAXPUSDT_PERP.A,AIXBTUSDT_PERP.A,SPELLUSDT_PERP.A,LSKUSDT_PERP.A,XVSUSDT_PERP.A,BIGTIMEUSDT_PERP.A',
    'https://api.coinalyze.net/v1/predicted-funding-rate?symbols=API3USDT_PERP.A,RLCUSDT_PERP.A,SONICUSDT_PERP.A,SSVUSDT_PERP.A,IOSTUSDT_PERP.A,POWRUSDT_PERP.A,PHAUSDT_PERP.A,PEOPLEUSDT_PERP.A,DYMUSDT_PERP.A,BALUSDT_PERP.A,CHRUSDT_PERP.A,YGGUSDT_PERP.A,ONGUSDT_PERP.A,CETUSUSDT_PERP.A,XVGUSDT_PERP.A,DOGSUSDT_PERP.A,ILVUSDT_PERP.A,BANANAUSDT_PERP.A,PARTIUSDT_PERP.A,VVVUSDT_PERP.A',
    'https://api.coinalyze.net/v1/predicted-funding-rate?symbols=CELRUSDT_PERP.A,TRBUSDT_PERP.A,CGPTUSDT_PERP.A,DENTUSDT_PERP.A,JOEUSDT_PERP.A,KMNOUSDT_PERP.A,AGLDUSDT_PERP.A,DFUSDT_PERP.A,ALCHUSDT_PERP.A,BBUSDT_PERP.A,XAIUSDT_PERP.A,LQTYUSDT_PERP.A,TNSRUSDT_PERP.A,SHELLUSDT_PERP.A,USTCUSDT_PERP.A,KNCUSDT_PERP.A,OXTUSDT_PERP.A,NMRUSDT_PERP.A,SCRUSDT_PERP.A,STEEMUSDT_PERP.A',
    'https://api.coinalyze.net/v1/predicted-funding-rate?symbols=C98USDT_PERP.A,SCRTUSDT_PERP.A,BANANAS31USDT_PERP.A,VANRYUSDT_PERP.A,MTLUSDT_PERP.A,ARKUSDT_PERP.A,HIFIUSDT_PERP.A,CTSIUSDT_PERP.A,GOATUSDT_PERP.A,PONKEUSDT_PERP.A,EDUUSDT_PERP.A,MOVRUSDT_PERP.A,COOKIEUSDT_PERP.A,BELUSDT_PERP.A,TSTUSDT_PERP.A,CYBERUSDT_PERP.A,BANUSDT_PERP.A,RAREUSDT_PERP.A,LUMIAUSDT_PERP.A,GPSUSDT_PERP.A',
    'https://api.coinalyze.net/v1/predicted-funding-rate?symbols=DODOXUSDT_PERP.A,AIUSDT_PERP.A,DUSKUSDT_PERP.A,OMNIUSDT_PERP.A,BNTUSDT_PERP.A,ALICEUSDT_PERP.A,ARCUSDT_PERP.A,SOLVUSDT_PERP.A,TRUUSDT_PERP.A,NTRNUSDT_PERP.A,PORTALUSDT_PERP.A,DIAUSDT_PERP.A,DEGENUSDT_PERP.A,HIGHUSDT_PERP.A,OGNUSDT_PERP.A,RIFUSDT_PERP.A,CATIUSDT_PERP.A,STGUSDT_PERP.A,GRIFFAINUSDT_PERP.A,SAGAUSDT_PERP.A',
    'https://api.coinalyze.net/v1/predicted-funding-rate?symbols=ARPAUSDT_PERP.A,BAKEUSDT_PERP.A,MOODENGUSDT_PERP.A,HIPPOUSDT_PERP.A,HFTUSDT_PERP.A,MAGICUSDT_PERP.A,MAVUSDT_PERP.A,ACEUSDT_PERP.A,SIRENUSDT_PERP.A,SYSUSDT_PERP.A,ATAUSDT_PERP.A,DEGOUSDT_PERP.A,DUSDT_PERP.A,BMTUSDT_PERP.A,NKNUSDT_PERP.A,AVAAIUSDT_PERP.A,SWARMSUSDT_PERP.A,NFPUSDT_PERP.A,ALPHAUSDT_PERP.A,THEUSDT_PERP.A',
    'https://api.coinalyze.net/v1/predicted-funding-rate?symbols=MBOXUSDT_PERP.A,LISTAUSDT_PERP.A,REZUSDT_PERP.A,ZEREBROUSDT_PERP.A,TLMUSDT_PERP.A,SYNUSDT_PERP.A,GTCUSDT_PERP.A,LEVERUSDT_PERP.A,FIDAUSDT_PERP.A,HOOKUSDT_PERP.A,BADGERUSDT_PERP.A,PHBUSDT_PERP.A,SLERFUSDT_PERP.A,SWELLUSDT_PERP.A,HEIUSDT_PERP.A,RDNTUSDT_PERP.A,CHILLGUYUSDT_PERP.A,BRUSDT_PERP.A,1000RATSUSDT_PERP.A,VICUSDT_PERP.A',
    'https://api.coinalyze.net/v1/predicted-funding-rate?symbols=EPICUSDT_PERP.A,GHSTUSDT_PERP.A,REIUSDT_PERP.A,SANTOSUSDT_PERP.A,VINEUSDT_PERP.A,NEIROETHUSDT_PERP.A,MAVIAUSDT_PERP.A,PERPUSDT_PERP.A,LOKAUSDT_PERP.A,FLMUSDT_PERP.A,AVAUSDT_PERP.A,KOMAUSDT_PERP.A,QUICKUSDT_PERP.A,COSUSDT_PERP.A,BSWUSDT_PERP.A,JELLYJELLYUSDT_PERP.A,CHESSUSDT_PERP.A,VOXELUSDT_PERP.A,MYROUSDT_PERP.A,PIPPINUSDT_PERP.A',
    'https://api.coinalyze.net/v1/predicted-funding-rate?symbols=TOKENUSDT_PERP.A,TUTUSDT_PERP.A,NULSUSDT_PERP.A,FIOUSDT_PERP.A,BIDUSDT_PERP.A,TROYUSDT_PERP.A,VIDTUSDT_PERP.A,ALPACAUSDT_PERP.A,RAYSOLUSDT_PERP.A,1000CHEEMSUSDT_PERP.A,BROCCOLIF3BUSDT_PERP.A,DEFIUSDT_PERP.A,VELODROMEUSDT_PERP.A,1000XUSDT_PERP.A,1000WHYUSDT_PERP.A,1000CATUSDT_PERP.A,BROCCOLI714USDT_PERP.A,BTCDOMUSDT_PERP.A',
    'https://api.coinalyze.net/v1/predicted-funding-rate?symbols=FUNUSDT_PERP.A,MLNUSDT_PERP.A,GUNUSDT_PERP.A,ATHUSDT_PERP.A',
    ];

// Hàm gửi tin nhắn đến Telegram
const sendToTelegram = async (message) => {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: message })
        });

        const data = await response.json();
        console.log("📩 Kết quả gửi tin:", data);
    } catch (error) {
        console.error("❌ Lỗi gửi tin nhắn:", error);
    }
};
//

const fetchAPI = async (url) => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error(`❌ Lỗi API (${response.status}): ${url}`);
            return [];
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
            console.error("❌ Dữ liệu trả về không phải mảng:", data);
            return [];
        }

        return data;
    } catch (error) {
        console.error("❌ Lỗi khi gọi API:", error);
        return [];
    }
};


const fetchAllFundingRates = async () => {
    fetchedData = [];  // 🛠 Xóa dữ liệu cũ trước khi fetch mới

    for (let i = 0; i < API_URLS.length; i += 2) {
        console.log(`📡 Đang gọi API từ ${i + 1} đến ${i + 2}...`);

        const batch = API_URLS.slice(i, i + 2);
        const responses = await Promise.all(batch.map(url => fetchAPI(url)));

        fetchedData.push(...responses.flat());  // Thêm dữ liệu mới

        console.log(`✅ Đã lấy dữ liệu từ ${i + 1} đến ${i + 2}`);

        if (i + 2 < API_URLS.length) {
            console.log("⏳ Chờ 60 giây trước khi tiếp tục...");
            await new Promise(resolve => setTimeout(resolve, 60000));
        }
    }

    console.log("🎉 Hoàn tất lấy dữ liệu từ tất cả API!");
};

//
// // Hàm lọc dữ liệu có value <= -1
// const filterNegativeValues = () => {
//     if (fetchedData.length === 0) {
//         console.log("⚠️ Dữ liệu trống! Hãy gọi fetchAllFundingRates() trước.");
//         return;
//     }
//
//     const negativeValues = fetchedData.filter(item => item.value <= -1);
//
//     if (negativeValues.length === 0) {
//         console.log("✅ Không có symbol nào có value <= -1.");
//         return;
//     }
//
//     console.log("🚨 Các symbol có value <= -1:");
//     negativeValues.forEach(item => {
//         console.log(`- ${item.symbol}: ${item.value}`);
//     });
// };




// 📝 Đọc dữ liệu đã gửi từ sentData.json
const loadSentData = () => {
    try {
        if (!fs.existsSync('sentData.json')) {
            fs.writeFileSync('sentData.json', '{}', 'utf-8'); // Tạo file nếu chưa có
        }
        const rawData = fs.readFileSync('sentData.json', 'utf-8');
        return JSON.parse(rawData);
    } catch (error) {
        console.error('❌ Lỗi đọc file sentData.json:', error);
        return {};
    }
};
// 📝 Lưu dữ liệu đã gửi vào sentData.json
const saveSentData = (sentData) => {
    try {
        fs.writeFileSync('sentData.json', JSON.stringify(sentData, null, 2), 'utf-8');
    } catch (error) {
        console.error('❌ Lỗi ghi file sentData.json:', error);
    }
};


// // 🕒 Xóa dữ liệu cũ quá 24 giờ
// const cleanOldSentData = (sentData) => {
//     const now = Date.now();
//     Object.keys(sentData).forEach((symbol) => {
//         if (now - sentData[symbol] > 24 * 60 * 60 * 1000) {  // 24 giờ
//             delete sentData[symbol];
//         }
//     });
//     saveSentData(sentData);
// };
const cleanOldSentData = (sentData) => {
    const now = Date.now();

    // Lấy timestamp của 20:35 hôm nay
    const eveningToday = new Date();
    eveningToday.setHours(7, 0, 0, 0);
    const eveningTimestamp = eveningToday.getTime();

    // Nếu hiện tại đã qua 20:35, thì vẫn giữ 20:35 hôm nay
    // Nếu hiện tại chưa đến 20:35, lấy 20:35 ngày hôm trước
    if (now < eveningTimestamp) {
        eveningToday.setDate(eveningToday.getDate() - 1);
    }

    const cutoffTimestamp = eveningToday.getTime();

    console.log(`🕒 Kiểm tra và xóa dữ liệu trước ${new Date(cutoffTimestamp).toLocaleString("vi-VN")}`);

    // Duyệt qua danh sách và xóa dữ liệu cũ hơn 20:35 ngày trước
    Object.keys(sentData).forEach((symbol) => {
        if (sentData[symbol] < cutoffTimestamp) {
            console.log(`❌ Xóa dữ liệu của ${symbol} (Lưu lúc: ${new Date(sentData[symbol]).toLocaleString("vi-VN")})`);
            delete sentData[symbol];
        }
    });

    saveSentData(sentData);
};


const scheduleCleanup = () => {
    setInterval(() => {
        const now = new Date();
        if (now.getHours() === 20 && now.getMinutes() === 35) {
            console.log("🔄 Đang thực hiện xóa dữ liệu lúc 20:35...");
            let sentData = loadSentData();
            cleanOldSentData(sentData);
        }
    }, 60 * 1000); // Kiểm tra mỗi phút
};

// Chạy lịch trình ngay khi khởi động
scheduleCleanup();



// const cleanOldSentData = (sentData) => {
//     const now = Date.now();
//
//     // Tính timestamp của 20:00 hôm nay
//     const eveningToday = new Date();
//     eveningToday.setHours(20, 0, 0, 0);  // Đặt giờ thành 20:00 hôm nay
//     const eveningTimestamp = eveningToday.getTime();
//
//     // Duyệt qua các key trong sentData
//     Object.keys(sentData).forEach((symbol) => {
//         if (sentData[symbol] < eveningTimestamp) {
//             delete sentData[symbol];
//         }
//     });
//
//     saveSentData(sentData);
// };


// 📩 Gửi dữ liệu lên Telegram nhưng kiểm tra trùng trước
const sendNegativeValuesToTelegram = async (negativeValues) => {
    if (!Array.isArray(negativeValues) || negativeValues.length === 0) {
        console.log("⚠️ Không có dữ liệu để gửi!");
        return;
    }

    console.log("🚀 Sẽ gửi các symbol sau:", negativeValues);  // 🔍 Kiểm tra dữ liệu gửi

    let sentData = loadSentData();
    cleanOldSentData(sentData);

    for (const item of negativeValues) {
        if (sentData[item.symbol]) {
            console.log(`⏳ Đã gửi ${item.symbol} trước đó, bỏ qua.`);
            continue;
        }

        const message = `🚨🚨Cảnh báo Funding Rate🚨🚨\n\n 🔎: ${item.symbol.replace('USDT_PERP.A', '')}\n\n 🔥: ${item.value}`;
        await sendToTelegram(message);

        sentData[item.symbol] = Date.now();
        saveSentData(sentData);
    }
};

let isFetching = false;

cron.schedule("48 * * * *", async () => {
    console.log("🔄 Đang chạy vào", new Date().toLocaleTimeString());

    await fetchAllFundingRates();
    const negativeValues = fetchedData.filter(item => item.value <= -1);
    await sendNegativeValuesToTelegram(negativeValues);

    console.log("✅ Đã gửi dữ liệu!");
});

//
// cron.schedule("*/2 * * * *", async () => {
//     console.log("🔄 Đang chạy vào", new Date().toLocaleTimeString());
//
//     await fetchAllFundingRates();
//     const negativeValues = fetchedData.filter(item => item.value <= -1);
//     await sendNegativeValuesToTelegram(negativeValues);
//
//     console.log("✅ Đã gửi dữ liệu!");
// });



(async () => {
    await fetchAllFundingRates();
    const negativeValues = fetchedData.filter(item => item.value <= -1);  // Lọc dữ liệu
    sendNegativeValuesToTelegram(negativeValues);
})();