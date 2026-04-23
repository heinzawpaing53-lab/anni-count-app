# Heart Count Deployment

This app is now prepared to be shared by link on Android devices.

## What was added

- Production API base URL support with `VITE_API_BASE_URL`
- Installable PWA files:
  - `public/manifest.webmanifest`
  - `public/sw.js`
  - app icons
- Production server support:
  - the Express server now serves `dist/` if it exists
  - this lets one Node server host both the frontend and API together

## Simple deployment flow

1. Set environment variables:

```env
VITE_API_BASE_URL=
PORT=3001
ALLOWED_ORIGIN=*
DATA_FILE=server/data.json
```

Notes:
- Leave `VITE_API_BASE_URL` empty if the frontend and backend are hosted on the same server/domain.
- Set `VITE_API_BASE_URL=https://your-api-domain.com` if the API is hosted separately.
- `DATA_FILE` is where the JSON data is stored on the server.

2. Build the frontend:

```powershell
npm install
npm run build
```

3. Start the app server:

```powershell
npm run start
```

4. Share the deployed URL with Android users.

## Android install

After deployment, Android users can:

1. Open the app URL in Chrome
2. Tap browser menu
3. Choose `Add to Home screen` or `Install app`

## Important note

The backend currently uses a JSON file for storage.
That is fine for small personal deployments, but for a more reliable public app you should eventually move to a real database.
