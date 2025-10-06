# Plant Tracker Backend

Simple Node.js backend for syncing plant care data across your home network.

## Quick Setup

1. Upload these files to your Ubuntu server
2. Run the setup script:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. Start the server:
   ```bash
   npm start
   ```

## Installation as System Service

To have the server start automatically on boot:

```bash
sudo cp plant-tracker.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable plant-tracker
sudo systemctl start plant-tracker
```

Check status:
```bash
sudo systemctl status plant-tracker
```

View logs:
```bash
sudo journalctl -u plant-tracker -f
```

## API Endpoints

- `GET /api/data` - Get all data
- `POST /api/data` - Save all data
- `GET /api/plants` - Get all plants
- `POST /api/plants` - Create new plant
- `POST /api/plants/:id/activities` - Add activity to plant
- `DELETE /api/plants/:id` - Delete plant

## Configuration

The server runs on port 3000 by default. To change:
- Edit `PORT` in `server.js`
- Update the systemd service file if using

## Data Storage

Data is stored in `data.json` in the same directory as the server.
This file is automatically created on first run.

## Security Note

This is designed for home network use only. For internet exposure, add:
- Authentication
- HTTPS
- Rate limiting
- Input validation

## Frontend Setup

Place the HTML file in the `public` folder to serve it directly,
or update the HTML to point to your server's IP address.

Update the API_URL in the HTML file:
```javascript
const API_URL = 'http://YOUR_SERVER_IP:3000/api';
```