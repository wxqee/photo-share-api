const fetch = require('node-fetch')

// https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#2-users-are-redirected-back-to-your-site-by-github
const requestGithubToken = credentials =>
    fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(credentials)
    })
        .then(res => res.json())
        .then(data => {
            // PS: this code block is useless and sensitive
            console.debug('access_token response => %o', data);
            return data
        })
        .catch(error => {
            throw new Error(JSON.stringify(error))
        })

// https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#3-use-the-access-token-to-access-the-api
const requestGithubUserAccount = token =>
    fetch(`https://api.github.com/user?access_token=${token}`)
        .then(res => res.json())
        .catch(error => {
            throw new Error(JSON.stringify(error))
        })

const authorizeWithGithub = async (credentials) => {
    const { access_token } = await requestGithubToken(credentials)
    const githubUser = await requestGithubUserAccount(access_token)
    return {
        ...githubUser,
        access_token,
    }
}

const requestRandomUsers = async count =>
    fetch(`https://randomuser.me/api/?results=${count}`)
        .then(res => res.json())
        .catch(error => {
            throw new Error(JSON.stringify(error))
        })

module.exports = {
    authorizeWithGithub,
    requestRandomUsers,
}
