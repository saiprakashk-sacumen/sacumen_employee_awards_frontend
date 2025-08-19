# Awards Nomination App

This project packages the Awards Nomination application into a Docker container for easy deployment.

## Prerequisites

- **Backend servers must be up and running** before starting the container.
- Ensure Docker is installed and running on your system. You can download Docker from [https://www.docker.com/get-started](https://www.docker.com/get-started)

## Steps to Build and Run the Docker Container

### 1. Build the Docker Image

To create a Docker image for the application, run the following command in the project directory (where your `Dockerfile` is located):

```bash
docker build -t awardsnominationapp .
```

### 2. Run the Docker Container

To run the container from the image, use the following command:

```bash
docker run -d --name awardsnominationapp -p 80:80 awardsnominationapp:latest
```

This command will:
- Run the container in **detached** mode (`-d`)
- Name the container `awardsnominationapp`
- Map port **80 on your host** to port **80 in the container**

## Notes

- Make sure port 80 is not already in use on your host machine.
- If you make changes to the application, rebuild the image using the `docker build` command above.
- To stop the container:

```bash
docker stop awardsnominationapp
```

- To remove the container:

```bash
docker rm awardsnominationapp
```

## License

This project is proprietary. All rights reserved.
