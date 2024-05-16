const fs = require('fs');

const defaultConfig = {
    githubOwner: 'your-github-username',
    githubRepo: 'your-repository-name',
    githubToken: 'your-github-access-token',
    pollingInterval: 30000 
};

function getConfig() {
    try {
        const data = fs.readFileSync('config.json', 'utf8');
        const config = JSON.parse(data);
        return config;
    } catch (err) {
        console.error('Error reading configuration file:', err.message);
        return defaultConfig;
    }
}

function saveConfig(config) {
    try {
        fs.writeFileSync('config.json', JSON.stringify(config, null, 4));
        console.log('Configuration saved successfully.');
    } catch (err) {
        console.error('Error saving configuration file:', err.message);
    }
}

module.exports = { getConfig, saveConfig };
