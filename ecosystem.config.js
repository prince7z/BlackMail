module.exports = {
  apps: [
    {
      name: 'blackmail',
      script: 'node',
      args: '.next/standalone/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
        NOTION_TOKEN: process.env.NOTION_TOKEN,
        NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
        MONGODB_URI: process.env.MONGODB_URI,
      },
    },
  ],
};

