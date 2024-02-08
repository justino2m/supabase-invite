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

// Define an array to store user emails
const usersToInvite = [];

// Create a unique error log filename with timestamp
const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
const errorLogFileName = `error_${timestamp}.log`;

// Create error log file if not exists
fs.writeFileSync(errorLogFileName, '');

async function inviteUsers() {
  let successfulInvites = 0;
  let failedInvites = 0;
  try {
    for (const userEmail of usersToInvite) {
      if (!userEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        fs.appendFileSync(errorLogFileName, `${new Date().toISOString()}: Invalid email: ${userEmail}\n`);
        console.log(`Invalid email: ${userEmail}`);
        failedInvites++;
        continue;
      }

      const { data, error } = await supabase.auth.admin.inviteUserByEmail(userEmail)
      if (error) {
        fs.appendFileSync(errorLogFileName, `${new Date().toISOString()}: Error inviting ${userEmail}: ${error.message}\n`);
        console.error(`Error inviting ${userEmail}:`, error.message);
        failedInvites++;
      } else {
        successfulInvites++;
        console.log(`Invited ${userEmail} successfully!`);
      }
    }
  } catch (error) {
    fs.appendFileSync(errorLogFileName, `${new Date().toISOString()}: Bulk invite error: ${error.message}\n`);
    console.error('Bulk invite error:', error.message);
  }
  console.log('********************************************')
  console.log(`Invited ${successfulInvites} users successfully.`);
  console.log(`Encountered errors for ${failedInvites} users. Check ${errorLogFileName} for details.`);
}

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
