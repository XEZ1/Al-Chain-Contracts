# Local Deployment

## Connect Backend and Frontend
Run `ipconfig` or `ifconfig` in bash, then create or modify the `.env` file in the root directory of the frontend, with the IPv4 address inside.
```bash
BACKEND_URL=your IPv4 address:8000
```

## Install Frontend Dependencies
```bash
npm install
```
 
## Ngrok
THIS STEP IS NOT COMPOLSURY
Use Ngrok to expose your locally deployed backend over an isolated WiFi connection if needed:
```bash
Ngrok http <port>
```
if you proceed with this step, copy and paste the http / https link created by ngrok into the .env file in the forntend root folder

## Deploy the Frontend
```bash
npx expo start
```

# Global Deployment

## Log in to the Vritual Machine
```bash
gcloud compute ssh --zone "europe-west1-d" "instance-asac-prj-kcl" --project "asac-pjr-at-kcl"
```

## Download the Latest Updates
Navigate to the git repository then exectue:
```bash
git pull
```

## Stop the Currently Running Container
```bash
docker-compose down
```

## Redeploy the New One
```bash
docker-compose up --build
```
This will rebuild the backend and send frontend updates to Expo SDK for deployemnt 
alternatively, run the following commands if you don't want to rebuild the entire project:
```
npx eas-cli update:configure
npx eas-cli build:configure
npx eas-cli update --message "<your commit message>" --branch main 
```

# New Global Deployment

In case the previously configured VM is lost, follow the steps below to reconfigure the new one and deploy the application into production

## Update and Upgrade the System
```bash
sudo apt-get update
sudo apt-get upgrade
```

## Install Docker and Docker Compose
```bash
sudo apt-get install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install docker-ce

sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## Start and Enable Docker
```bash
sudo systemctl status docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ${USER}
newgrp docker
```

## Setup Git, SSH Keys, and Clone Repository
```bash
sudo apt-get update
sudo apt-get install git

ssh-keygen -t ed25519 -C "ezzat.alslaibi@kcl.ac.uk"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
cat ~/.ssh/id_ed25519.pub

git clone git@github.com:XEZ1/Al-Slebi-AI-Contracts.git
```

## Build and Run the Project with Docker
```bash
docker-compose build
docker-compose up
```

## Configure VM Firewall

You must ensure the port the backend is using is open through the firewall:

go to VPC network > Firewall.
Click Create Firewall Rule.
Set the targets to All instances in the network or specify specific targets using tags.
Set the source IP ranges. If you want to allow access from any IP, use 0.0.0.0/0.
Specify the protocols and ports (http and https).
Give the rule a name, description, and link it to the VM instance in use, then click Create.

## CAUTION: Migrations
Even though docker is configured to run migrations, the build sometimes skips this step for some reason. In order to be safe, execute the following command:
```bash
docker-compose exec web python manage.py migrate
```

## Useful Commands

Use this command to run the build in the background:
```bash
docker-compose up -d
```
To rebuild run the following command:
```bash
docker-compose up --build 
```
To turn the docker-composed image off, run this command: 
```bash
docker-compose down
```
To delete the docker image:
```bash
docker-compose down -v
```
To reconfigure the SSL certificate:
```bash
sudo certbot certonly --nginx --dry-run -d alsalibiaicontracts.co.uk -d www.alsalibiaicontracts.co.uk
sudo certbot certonly --nginx -d alsalibiaicontracts.co.uk -d www.alsalibiaicontracts.co.uk
```
To clean up all docker configurations and images:
```bash
sudo systemctl enable docker
sudo systemctl start docker
docker image prune -a
docker container prune
docker volume prune
docker network prune
docker system prune -a
```

# Testing the Application:

If you run into problems after changing the codebase, make sure to run the tests. They cover the entire application and might be useful in resolving issues. Navigate to the frontend directory and run the tests:
```
cd ASACFrontEnd
npm run test
```