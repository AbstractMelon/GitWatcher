const { getConfig, saveConfig } = require('../src/config');
const { watchRepository } = require('../src/index');

const mockConfig = {
    githubOwner: 'Abstractmelon',
    githubRepo: 'Gitwatcher',
    githubToken: 'test-token',
    pollingInterval: 10000 
};

test('getConfig should return default config if config file does not exist', () => {
    jest.mock('fs', () => ({
        readFileSync: jest.fn(() => {
            throw new Error('Mock error: Config file not found');
        })
    }));

    const config = getConfig();
    expect(config).toEqual({
        githubOwner: 'your-github-username',
        githubRepo: 'your-repository-name',
        githubToken: 'your-github-access-token',
        pollingInterval: 30000
    });
});

test('getConfig should return config from file if it exists and is valid', () => {
    jest.mock('fs', () => ({
        readFileSync: jest.fn(() => JSON.stringify(mockConfig))
    }));

    const config = getConfig();
    expect(config).toEqual(mockConfig);
});

test('saveConfig should save config to file', () => {
    jest.mock('fs', () => ({
        writeFileSync: jest.fn()
    }));

    saveConfig(mockConfig);
    expect(fs.writeFileSync).toHaveBeenCalledWith('config.json', JSON.stringify(mockConfig, null, 4));
});

test('watchRepository should start watching the GitHub repository', () => {
    const { Octokit } = require('@octokit/core');
    const mockOctokit = jest.fn();
    jest.mock('@octokit/core', () => ({
        Octokit: jest.fn(() => ({
            request: mockOctokit
        }))
    }));

    jest.useFakeTimers();

    watchRepository();

    expect(mockOctokit).toHaveBeenCalledWith('GET /repos/{owner}/{repo}', {
        owner: mockConfig.githubOwner,
        repo: mockConfig.githubRepo
    });
});
