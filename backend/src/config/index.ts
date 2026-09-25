export default () => ({
    // process.env.DEPLOYMENT_SETUP?
    database: {
        type: 'mysql',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME,
        synchronize: true,
    },

    localDatabase: {
        type: 'postgres',
        host: process.env.LOCAL_DB_HOST,
        port: Number(process.env.LOCAL_DB_PORT),
        username: process.env.LOCAL_DB_USERNAME,
        password: process.env.LOCAL_DB_PASSWORD,
        name: process.env.LOCAL_DB_NAME,
        synchronize: false,
    }
})