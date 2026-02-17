const express = require('express');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const CONFIG_PATH = path.join(__dirname, '../config/config.json');
const ENV_PATH = path.join(__dirname, '../config/.env');

// 設定の取得
app.get('/api/config', (req, res) => {
  try {
    const configData = fs.readFileSync(CONFIG_PATH, 'utf8');
    res.json(JSON.parse(configData));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read config' });
  }
});

// 環境変数の取得（キーのみ、またはマスクされた値）
app.get('/api/env', (req, res) => {
  try {
    const envContent = fs.readFileSync(ENV_PATH, 'utf8');
    const lines = envContent.split('\n');
    const envVars = {};
    lines.forEach(line => {
      if (line && !line.startsWith('#') && line.includes('=')) {
        const [key, value] = line.split('=');
        envVars[key.trim()] = '********'; // セキュリティのため値はマスク
      }
    });
    res.json(envVars);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read env' });
  }
});

// 設定の更新
app.post('/api/config', (req, res) => {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(req.body, null, 2));
    res.json({ message: 'Config updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update config' });
  }
});

// 環境変数の更新
app.post('/api/env', (req, res) => {
  try {
    const { key, value } = req.body;
    let envContent = fs.readFileSync(ENV_PATH, 'utf8');
    const regex = new RegExp(`^${key}=.*`, 'm');
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
      envContent += `\n${key}=${value}`;
    }
    fs.writeFileSync(ENV_PATH, envContent);
    res.json({ message: `${key} updated` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update env' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Admin Server running on http://0.0.0.0:${PORT}`);
});
