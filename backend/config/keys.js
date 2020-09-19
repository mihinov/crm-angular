const userName = 'mihail';
const password = '123';
const databaseName = 'crm-angular';

module.exports = {
    mongoURI: `mongodb+srv://${userName}:${password}@cluster0.uw0pi.mongodb.net/${databaseName}?retryWrites=true&w=majority`,
    jwt: 'dev-jwt'
}