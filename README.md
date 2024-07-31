# AIChain Contracts
---






To simply use the application scan this QR code:


Use this link:
```
https://expo.dev/preview/update?message=Unify%20the%20view%20across%20platforms&updateRuntimeVersion=1.0.0&createdAt=2024-07-31T02%3A45%3A02.169Z&slug=exp&projectId=032f6af8-bb36-47b5-80a0-f6f070705b75&group=c7a72e9e-3651-4f15-b8f0-4b4a83e6957c
```

# Personal Setup
Navigate to your project directory
```
cd D:\Users\XEZ1\Main\10.Projects-Code\Al-Slebi-AI-Contracts-Git\Al-Slebi-AI-Contracts\
```

## Local Configuration Steps

### Set Up the Virtual Environment
```
python -m venv venv
venv\Scripts\activate
```

### Install Backend Dependencies
```
pip install -r "requirements.txt"
```

### Configure Notifications Server
```
sudo systemctl status redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

### Deploy the Backend:
```
daphne ASACBackEnd.asgi:application --bind 0.0.0.0 --port 8000
```

### Connect Backend and Frontend
Run `ipconfig` or `ifconfig` in bash, then create a `.env` file in the root directory of the frontend, with the IPv4 address inside.
```
BACKEND_URL=your IPv4 address:8000
```

### Install Frontend Dependencies
```
npm install
```
### Ngrok
Use Ngrok to expose your locally deployed backend over an isolated WiFi connection:
```
Ngrok http <port>
```

### Deploy the Frontend
```
npx expo start
```

### Database Setup
Connect to the database using:
```
psql -U postgres -d postgres
psql -U xez1 -d asacbackenddb
```

## Testing the Application:

### Backend Tests
Navigate to the backend directory and run tests:
```
cd ASACBackEnd
pytest
```

### Frontend Tests
Navigate to the frontend directory and run tests:
```
cd ASACFrontEnd
npm run test
```

----

## VM Instance Configuration Steps

### Update and Upgrade the System
```
sudo apt-get update
sudo apt-get upgrade
```

### Install Docker and Docker Compose
```
sudo apt-get install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install docker-ce

sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Start and Enable Docker
```
sudo systemctl status docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ${USER}
newgrp docker
```

### Setup Git, SSH Keys, and Clone Repository
```
sudo apt-get update
sudo apt-get install git

ssh-keygen -t ed25519 -C "ezzat.alslaibi@kcl.ac.uk"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
cat ~/.ssh/id_ed25519.pub

git clone git@github.com:XEZ1/Al-Slebi-AI-Contracts.git
```

### Build and Run the Project with Docker
```
docker-compose build
docker-compose up
```

### Optional Commands

Use this command to run the build in the background:
```
docker-compose up -d
```
To rebuild run the following command:
```
docker-compose up --build 
```
To turn the docker-composed image off, run this command: 
```
docker-compose down
```
to delete the docker image:
```
docker-compose down -v
```

### Configure VM Firewall

You must ensure the port the backend is using is open through the firewall:

go to VPC network > Firewall.
Click Create Firewall Rule.
Set the targets to All instances in the network or specify specific targets using tags.
Set the source IP ranges. If you want to allow access from any IP, use 0.0.0.0/0.
Specify the protocols and ports (http and https).
Give the rule a name, description, and link it to the VM instance in use, then click Create.

### Setup Nginx and Domain
```
sudo certbot certonly --nginx --dry-run -d alsalibiaicontracts.co.uk -d www.alsalibiaicontracts.co.uk
sudo certbot certonly --nginx -d alsalibiaicontracts.co.uk -d www.alsalibiaicontracts.co.uk
```

### CAUTION
Even though docker is configured to run migrations, the build sometimes skips this step for some reason. In order to be safe, execute the following command:
```
docker-compose exec web python manage.py migrate
```

#### Useful commands
```
docker-compose exec web python manage.py migrate
docker-compose exec web python manage.py collectstatic
docker-compose exec web ls /ASACBackEnd/staticfiles
docker-compose exec web chmod -R 777 /ASACBackEnd/staticfiles
```