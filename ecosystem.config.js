module.exports = {
    apps: [
      {
        name: 'prepup', // Replace with your app's name
        script: 'dist/index.js', // Path to your compiled JavaScript file
        instances: 'max', // Or a specific number of instances
        exec_mode: 'cluster', // Enable cluster mode
        env: {
          NODE_ENV: 'production', // Set the environment
          PORT: process.env.PORT,
          TOKEN_KEY: process.env.TOKEN_KEY,
          DB_CONN_STRING: process.env.DB_CONN_STRING,
          DB_NAME: process.env.DB_NAME,
          USERS_COLLECTION_NAME: process.env.USERS_COLLECTION_NAME,
          MAIL_HOST: process.env.MAIL_HOST,
          MAIL_USERNAME: process.env.MAIL_USERNAME,
          MAIL_PASSWORD: process.env.MAIL_PASSWORD
        },
      },
    ],
  };
  