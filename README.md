# Al-Slebi-AI-Contracts
---
# Virtual Environment: 
```
venv\Scripts\activate
```
# Backend:
```
daphne ASACBackEnd.asgi:application --bind 0.0.0.0 --port 8000
```
# Frontend:
```
npx expo start
```
# Notifications Server:
```
sudo systemctl status redis-server
sudo systemctl start redis-server
```
Configure Redis to Start on Boot (Optional): If you want Redis to automatically start when you boot your WSL instance, you can enable it with:
```
sudo systemctl enable redis-server
```
# Ngrok:
```
Ngrok http 'port'
```