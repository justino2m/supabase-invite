require('dotenv').config(); // Load environment variables from .env file
const fs = require('fs');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');

// Replace these with your Supabase project credentials
const supabase_url = process.env.SUPABSE_URL;
const service_role_key = process.env.SUPABSE_SERVICE_ROLE_KEY;

// Initialize Supabase client
const supabase = createClient(supabase_url, service_role_key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

// Define the path to your CSV file
const csvFilePath = 'users.csv'; // Update with the correct path

// Read the CSV file and extract user emails
fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    if (row.email) {
      usersToInvite.push(row.email);
    }
  })
  .on('end', () => {
    inviteUsers();
  });

// Define an array to store user emails
const usersToInvite = [];

async function inviteUsers() {
  try {
    for (const userEmail of usersToInvite) {
      const { data, error } = await supabase.auth.admin.inviteUserByEmail(userEmail)
      if (error) {
        console.error(`Error inviting ${userEmail}:`, error.message);
      } else {
        console.log(`Invited ${userEmail} successfully!`);
      }
    }
  } catch (error) {
    console.error('Bulk invite error:', error.message);
  }
}

inviteUsers();
