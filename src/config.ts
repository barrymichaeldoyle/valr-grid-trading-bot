import dotenv from 'dotenv';

dotenv.config();

if (!process.env.VALR_API_KEY) {
  throw new Error('Missing required VALR_API_KEY environment variable');
}
if (!process.env.VALR_API_SECRET) {
  throw new Error('Missing required VALR_API_SECRET environment variable');
}

export const config = {
  valrApiKey: process.env.VALR_API_KEY,
  valrApiSecret: process.env.VALR_API_SECRET,
};
