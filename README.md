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
## .env file in the forntend:
prompt in cmd: 
```
ipconfig
```
then create a .env file in ASACFrontEnd folder and input inside:
```
BACKEND_URL=the IPv4 address of your machine:8000
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
