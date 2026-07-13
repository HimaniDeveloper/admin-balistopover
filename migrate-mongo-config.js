const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

const migrateConfig = {
  mongodb: {
    url: process.env.MONGO_URI,

    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },

  migrationsDir: "migrations",

  changelogCollectionName: "changelog",

  migrationFileExtension: ".js",

  useFileHash: false,
  moduleSystem: 'commonjs',
};

module.exports = migrateConfig;
