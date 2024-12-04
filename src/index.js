const { Octokit } = require("@octokit/core");
const { getConfig, saveConfig } = require("./config");

async function watchRepository() {
    const config = getConfig();

    const octokit = new Octokit({ auth: config.githubToken });

    const { data: repo } = await octokit.request('GET /repos/{owner}/{repo}', {
        owner: config.githubOwner,
        repo: config.githubRepo
    });

    console.log(`Watching repository: ${repo.full_name}`);

    const interval = setInterval(async () => {
        const { data: commits } = await octokit.request('GET /repos/{owner}/{repo}/commits', {
            owner: config.githubOwner,
            repo: config.githubRepo
        });

        if (commits.length > 0) {
            console.log(`New commits detected in ${repo.full_name}`);
            await pullChanges();
        }
    }, config.pollingInterval);

    async function pullChanges() {
        console.log(`Pulling changes for ${repo.full_name}`);

        console.log(`Changes pulled successfully for ${repo.full_name}`);
    }

    function stopWatching() {
        clearInterval(interval);
        console.log(`Stopped watching repository: ${repo.full_name}`);
    }

    return stopWatching;
}

const stopWatching = watchRepository();

module.exports = { stopWatching };
