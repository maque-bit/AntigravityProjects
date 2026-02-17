const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '../config/.env' });

const CONFIG_PATH = path.join(__dirname, '../config/config.json');
const RAW_DATA_PATH = path.join(__dirname, '../data/raw_data.json');
const ANALYSIS_PATH = path.join(__dirname, '../data/analysis_result.json');

async function run() {
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

    if (!config.analyzer.enabled) {
        console.log('Analyzer is disabled. Skipping...');
        return;
    }

    if (!fs.existsSync(RAW_DATA_PATH)) {
        console.log('No raw data found. Run collector first.');
        return;
    }

    if (!process.env.GEMINI_API_KEY) {
        console.error('GEMINI_API_KEY is missing in .env');
        return;
    }

    console.log('Starting AI analysis...');

    const rawData = JSON.parse(fs.readFileSync(RAW_DATA_PATH, 'utf8'));
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: config.analyzer.model });

    const prompt = `以下のMCPリポジトリリストを分析し、トレンドスコア（0-100）と実装難易度（Easy/Medium/Hard）、および1行の日本語要約を作成してください。JSON形式で出力してください。
    
    データ: ${JSON.stringify(rawData.repositories)}`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // JSONの抽出・パース（簡易版）
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const analysis = JSON.parse(jsonMatch[0]);
            fs.writeFileSync(ANALYSIS_PATH, JSON.stringify({
                timestamp: new Date().toISOString(),
                analysis
            }, null, 2));
            console.log('Analysis completed. Result saved to analysis_result.json');
        } else {
            console.error('Failed to parse AI response as JSON');
        }
    } catch (err) {
        console.error('Analysis failed:', err.message);
    }
}

// 1時間おきに実行
setInterval(run, 3600000);
run();
