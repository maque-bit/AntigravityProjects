const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config({ path: '../config/.env' });

const CONFIG_PATH = path.join(__dirname, '../config/config.json');
const DATA_DIR = path.join(__dirname, '../data');

async function run() {
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

    if (!config.collector.enabled) {
        console.log('Collector is disabled. Skipping...');
        return;
    }

    console.log(`Starting collection for user: ${config.collector.github_user_id}`);

    // GitHub APIでMCP関連リポジトリを検索 (ダミーまたは簡易実装)
    try {
        const query = 'topic:model-context-protocol';
        const url = `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc`;
        const headers = process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {};

        const response = await axios.get(url, { headers });
        const items = response.data.items.slice(0, 10); // 上位10件

        const result = {
            timestamp: new Date().toISOString(),
            repositories: items.map(repo => ({
                name: repo.full_name,
                stars: repo.stargazers_count,
                description: repo.description,
                url: repo.html_url
            }))
        };

        if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
        fs.writeFileSync(path.join(DATA_DIR, 'raw_data.json'), JSON.stringify(result, null, 2));
        console.log('Collection completed. Data saved to raw_data.json');
    } catch (err) {
        console.error('Collection failed:', err.message);
    }
}

// 簡易的なスケジュール実行（デモ用：1時間おき）
setInterval(run, 3600000);
run();
