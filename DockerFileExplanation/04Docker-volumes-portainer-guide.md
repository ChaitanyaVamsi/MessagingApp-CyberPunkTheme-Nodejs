# 🐋 Docker Volumes, Persistence, and Portainer: A Practical Guide

When working with Docker, one important concept to understand is that containers are **stateless by default**. This means any data created inside a container is lost when the container stops or is deleted. But with the help of **volumes** and **bind mounts**, we can persist data across container lifecycles. In this post, I’ll walk you through how that works—step by step—with examples using MongoDB and Portainer.

---

## ❌ The Problem: Stateless Containers

Docker containers are **ephemeral**—they’re meant to be lightweight and disposable. If you store data inside a container, it disappears when the container is stopped or removed.

Let’s take a simple example:

```bash
docker run --rm -d --name mongodb -p 27017:27017 mongo:latest
```

This command runs a MongoDB container.

* The `--rm` flag means the container is deleted when stopped.
* If you insert data into the database and stop the container, the data is gone.

### Trying It Out:

```bash
docker exec -it mongodb mongosh
> show dbs
> db.hello.insertOne({ message: "hi" })
> exit
docker stop mongodb
```

Stop the container and start it again—you’ll see the data is lost.

---

## 💾 Docker Volumes: Persist Your Data

To retain your data across container restarts, use a **Docker volume**.

```bash
docker volume create mongodbData

docker run --rm -d --name mongodb \
  -v mongodbData:/data/db \
  -p 27017:27017 \
  mongo
```

Here:

* `-v mongodbData:/data/db` maps a Docker-managed volume to MongoDB’s internal data directory.
* Now, even if the container is stopped or deleted, the volume still exists and your data is safe.

You can even inspect the volume directly:

```bash
ls /var/lib/docker/volumes/mongodbData/_data
```

---

## 🔗 Bind Mounts: A Quick Overview

While volumes are managed by Docker, **bind mounts** let you attach any folder on your host to the container.

Example:

```bash
docker run -v /home/user/app:/app myimage
```

* This lets the container access the `/app` directory.
* Changes reflect both ways:

  * Edit a file on your host → It changes in the container.
  * Write a file in the container → It shows up on your host.

> ⚠️ **Note**: Bind mounts are great for development but not always ideal for production due to permission and path issues.

---

## 👛 Running Docker Commands Inside a Container

Normally, you can't run Docker commands from inside a container—because containers don’t have access to the Docker CLI or daemon.

However, there’s a clever trick: **mount the Docker socket**.

```bash
docker run --rm -d --name app1 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --network none \
  myImage
```

* This gives the container access to the Docker daemon running on the host.
* You can now use Docker commands if the CLI is available **inside** the container.

> 🧠 Tip: Not all containers come with Docker CLI. For example, an `nginx` container won’t recognize `docker ps`.

---

## 📊 Portainer: Docker Management Made Easy

**Portainer** is a lightweight web UI that helps you manage your Docker environment visually. You can monitor containers, images, volumes, and more.

### Running Portainer:

```bash
docker run -d -p 8000:8000 -p 9443:9443 --name portainer \
  --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:2.11.1
```

#### Explanation:

* `--restart=always`: Ensures Portainer restarts if it crashes or the system reboots.
* Docker socket gives it full visibility into your Docker environment.
* `portainer_data` volume stores internal config and logs.

Now access it via:

```
https://localhost:9443
```

> Make sure to use **https**—Portainer runs securely by default.

---

## ✅ Conclusion

* Containers are **stateless by design**—data disappears unless you persist it.
* Use **Docker volumes** to keep your data safe between container restarts.
* Use **bind mounts** to share specific host folders with containers (great for development).
* Tools like **Portainer** make managing Docker easier through a web UI.
* You can even run **Docker inside a container** (with access to the socket) for advanced setups.

Happy Dockering! 🚀
