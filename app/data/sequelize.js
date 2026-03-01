import 'dotenv/config';
import { Sequelize } from 'sequelize';

let sequelize = null;

const dbUrl = process.env.DATABASE_URL;

// Only initialize Sequelize if a real DB URL is provided
if (dbUrl && !dbUrl.includes('hostname')) {
  try {
    sequelize = new Sequelize(dbUrl, {
      define: {
        underscored: true,
        timestamps: false,
      },
      logging: false,
    });
    console.log('✅ DB connection initialized.');
  } catch (err) {
    console.warn('⚠️  DB initialization failed — running without database.', err.message);
  }
} else {
  console.warn('⚠️  DATABASE_URL not configured — running without database.');
}

export { sequelize };
