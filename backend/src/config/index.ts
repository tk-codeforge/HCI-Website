export default () => ({
    database: {
        // type: 'mysql',
        // host: 'lp-hc-rds-db-instance-live.cjiym88ukfdp.ap-south-1.rds.amazonaws.com',
        // port: 3306,
        // username: 'admin',
        // password: '8bX1Y61vCHK1qPVMP6lJ',
        // name: 'lp_high_creation_live',
        // synchronize:false,
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        
        name: 'lp_high_creation_live',
        synchronize: true,
    },
    localDatabase: {
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        name: 'hci_db',
        synchronize: false,
    },
})


// export default () => ({
//     database: {
//         type: 'mysql',
//         host: process.env.DB_HOST,
//         port: Number(process.env.DB_PORT),
//         username: process.env.DB_USERNAME,
//         password: process.env.DB_PASSWORD,
//         name: process.env.DB_NAME,
//         synchronize: false,
//     },

//     localDatabase: {
//         type: 'postgres',
//         host: process.env.LOCAL_DB_HOST,
//         port: Number(process.env.LOCAL_DB_PORT),
//         username: process.env.LOCAL_DB_USERNAME,
//         password: process.env.LOCAL_DB_PASSWORD,
//         name: process.env.LOCAL_DB_NAME,
//         synchronize: false,
//     },
// })