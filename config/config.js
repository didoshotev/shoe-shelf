module.exports = {
    development: {
        databaseUrl: process.env.DATABASE_URL,
        port: process.env.PORT,
        privateKey: process.env.PRIVATE_KEY
    },
    production: {}
}