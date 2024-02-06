# Supabase Invite Script

This script allows you to invite users to Supabase using their email addresses.

## Prerequisites

Before running the script, make sure you have the following:

- Node.js installed on your machine
- Supabase account and project set up

## Installation

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Run `npm install` to install the required dependencies.

## Usage

1. Create the `.env` file in the root directory.
2. Update the `SUPABASE_URL` and `SUPABSE_SERVICE_ROLE_KEY` variables with your Supabase project details.
3. In the users.csv file, add the email addresses of the users you want to invite in the `emails` array. Please check the exising file.
4. Run the script using `npm start`.
5. The script will send invitation emails to the specified email addresses.

## Contributing

Contributions are welcome! If you have any suggestions or improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
