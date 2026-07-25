function generateRandomEmail() {
    return `user${Date.now()}@gmail.com`;
}

function generateRandomPassword() {
    return `User@${Date.now()}`;
}

module.exports = {
    generateRandomEmail,
    generateRandomPassword
};