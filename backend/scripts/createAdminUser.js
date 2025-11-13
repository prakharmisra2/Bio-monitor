// scripts/createAdminUser.js

const bcrypt = require('bcryptjs');
const { Client } = require('pg');
require('dotenv').config();

async function createAdminUser() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'bio_monitor',
    user: process.env.DB_USER || 'bio_monitor_app',
    password: process.env.DB_PASSWORD,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Generate proper bcrypt hash for Admin@123
    const password = 'Admin@123';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    console.log('Generated password hash:', passwordHash);

    // Insert or update admin user
    const query = `
      INSERT INTO users (username, full_name, email, password_hash, role)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (username) 
      DO UPDATE SET password_hash = $4, updated_at = CURRENT_TIMESTAMP
      RETURNING user_id, username, email, role;
    `;

    const result = await client.query(query, [
      'admin',
      'System Administrator',
      'admin@biomonitor.com',
      passwordHash,
      'admin',
    ]);

    console.log('✅ Admin user created/updated successfully!');
    console.log('User details:', result.rows[0]);
    console.log('\n🔑 Login Credentials:');
    console.log('Username: admin');
    console.log('Password: Admin@123');
    console.log('\n⚠️  Please change this password after first login!\n');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    await client.end();
  }
}

createAdminUser();