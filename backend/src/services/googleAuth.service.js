const { OAuth2Client } = require('google-auth-library');
const config = require('../config/config');

const oauth2Client = new OAuth2Client(
    config.GOOGLE_CLIENT_ID,
    config.GOOGLE_CLIENT_SECRET,
    config.GOOGLE_CALLBACK_URL
);

/**
 * Generates the Google consent screen authorization URL
 * @returns {string}
 */
const generateGoogleAuthUrl = () => {
    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ],
        prompt: 'consent'
    });
};

/**
 * Exchanges callback authorization code for Google user profile payload
 * @param {string} code 
 * @returns {Promise<object>} Google User Profile
 */
const getGoogleUserFromCode = async (code) => {
    // Exchange temporary code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Decode and verify the ID token
    const ticket = await oauth2Client.verifyIdToken({
        idToken: tokens.id_token,
        audience: config.GOOGLE_CLIENT_ID
    });
    
    return ticket.getPayload(); // Returns email, name, email_verified, picture, etc.
};

module.exports = {
    generateGoogleAuthUrl,
    getGoogleUserFromCode
};
