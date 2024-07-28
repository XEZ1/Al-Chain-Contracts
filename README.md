# Al-Slebi-AI-Contracts
---


# Personal:
```
cd D:\Users\XEZ1\Main\10.Projects-Code\Al-Slebi-AI-Contracts-Git\Al-Slebi-AI-Contracts\
```


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


# Database:
```
psql -U postgres -d postgres
```
```
psql -U xez1 -d asacbackenddb
```


# Testing:

## Backend:
```
cd ASACBackEnd
pytest
```

## Frontend:
```
npm run test
```

# Check ports in use:
```
netstat -anob
```


----

# For the VM Instance:

## Update and Upgrade the System
```
sudo apt-get update
sudo apt-get upgrade
```

## Install Docker
```
sudo apt-get install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install docker-ce
```

## Install Docker Compose
```
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## Check and Enable Docker
```
sudo systemctl status docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

## Download Docker Again
```
sudo apt-get remove docker docker-engine docker.io containerd runc
sudo apt-get update
sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
sudo docker run hello-world
sudo usermod -aG docker ${USER}
sudo systemctl enable docker
sudo systemctl start docker
sudo systemctl status docker
sudo usermod -aG docker $USER
newgrp docker

```

## Install Git
```
sudo apt-get update
sudo apt-get install git
```

## Create SSH
```
ssh-keygen -t ed25519 -C "ezzat.alslaibi@kcl.ac.uk"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
cat ~/.ssh/id_ed25519.pub
```
Then set the ssh with GitHub

## Clone the Repository
```
git@github.com:XEZ1/Al-Slebi-AI-Contracts.git
```

## Build the porject
```
docker-compose build
docker-compose up
docker-compose up -d
docker-compose up --build 
docker-compose down
```

## Configure the VM Firewall

You must ensure the port your backend is using is open through the Google Cloud firewall:

In the Google Cloud Console, go to VPC network > Firewall.
Click Create Firewall Rule.
Set the targets to All instances in the network or specify specific targets using tags.
Set the source IP ranges. If you want to allow access from any IP (be cautious with this setting), use 0.0.0.0/0.
Specify the protocols and ports. For example, for port 8000, you would enter tcp:8000.
Give the rule a name and description, then click Create.

