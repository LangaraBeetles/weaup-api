# WeaUp API

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```


## Docker

```bash
-- Check the containers running
sudo docker ps 


-- Check the all containers 
sudo docker ps -a 


-- Build the docker image
sudo docker build -t weaup-api .


-- Start the Docker container
sudo docker run -d --name weaup-api-container -p 3000:3000 weaup-api

```