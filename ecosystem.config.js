require('dotenv').config();

module.exports = {
  apps: [
    {
      name: 'prepup', // Replace with your app's name
      script: 'dist/src/index.js', // Path to your compiled JavaScript file
      instances: 'max', // Or a specific number of instances
      exec_mode: 'cluster', // Enable cluster mode
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        TOKEN_KEY: 'your-development-token-key',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3000,
        TOKEN_KEY: process.env.TOKEN_KEY || 'your-production-token-key',
        DB_CONN_STRING: process.env.DB_CONN_STRING || 'your-production-db-connection-string',
        DB_NAME: process.env.DB_NAME || 'your-production-db-name',
        USERS_COLLECTION_NAME: process.env.USERS_COLLECTION_NAME || 'your-users-collection',
        MAIL_HOST: process.env.MAIL_HOST || 'your-mail-host',
        MAIL_USERNAME: process.env.MAIL_USERNAME || 'your-mail-username',
        MAIL_PASSWORD: process.env.MAIL_PASSWORD || 'your-mail-password',
      },
      post_start: function() {
        console.log(`App ${this.name} is now running on port ${process.env.PORT}`);
        console.log(`Environment: ${process.env.PORT}`);
        console.log(`Token Key: ${process.env.TOKEN_KEY}`);
      }
    },
  ],
};
