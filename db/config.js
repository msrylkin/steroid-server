module.exports = {
    logging: false,
    dialect: 'postgres',
    username: process.env.PG_USER || 'user',
    password: process.env.PG_PASSWORD || 'password',
    // database: process.env.PG_DATABASE || `pablo-${process.env.STAGE || 'development'}`,
    database: 'steroid',
    host: process.env.PG_HOST || 'localhost',
    // port: ['development', 'test'].includes(process.env.STAGE) && !process.env.CI ? 5489 : undefined,
    port: 6543
  };