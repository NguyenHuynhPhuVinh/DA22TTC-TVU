import { google } from "googleapis";

// OAuth2 client dùng refresh token của bạn
// Cần thêm vào .env:
// GOOGLE_CLIENT_ID=your_client_id
// GOOGLE_CLIENT_SECRET=your_client_secret
// GOOGLE_REFRESH_TOKEN=your_refresh_token

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

export const drive = google.drive({ version: "v3", auth: oauth2Client });
export const oauth2 = oauth2Client;
