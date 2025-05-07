
# 🧾 Docker Directory Change, EBS Setup & Custom Networking

## ✅ Part 1: Attach and Mount a New EBS Volume to EC2

### 📌 Goal:
Avoid root volume exceeding 50% usage by moving Docker data to a new EBS volume.

### 🔧 Steps:

#### 1. Create and Attach EBS Volume
- Create the volume in the **same region and Availability Zone (AZ)** as your EC2 instance.
- Attach it to the instance, e.g., `/dev/xvdf`.

#### 2. Check for Filesystem
```bash
sudo file -s /dev/xvdf
```
If it shows `data`, it has **no filesystem**.

#### 3. Format the Volume
```bash
sudo mkfs.ext4 /dev/xvdf
```

#### 4. Get UUID and Mount
```bash
sudo lsblk -o +UUID
```

Example UUID:
```
5a8bd636-5809-47fa-927c-027de4350f0c
```

```bash
sudo mkdir /dockerData
```

#### 5. Update `/etc/fstab`
```bash
sudo nano /etc/fstab
```

Add this line:
```
UUID=5a8bd636-5809-47fa-927c-027de4350f0c  /dockerData  ext4  defaults,nofail  0  2
```

#### 6. Mount Immediately
```bash
sudo mount -a
```

---

## ✅ Part 2: Change Docker's Default Data Directory

### 📌 Goal:
Move Docker's storage to the new volume at `/dockerData`.

### 🔧 Steps:

#### 1. Check Current Docker Directory
```bash
docker info | grep 'Docker Root Dir'
```

#### 2. Modify Docker Service File
```bash
sudo nano /lib/systemd/system/docker.service
```

Comment out default line:
```
#ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
```

Add custom root path:
```
ExecStart=/usr/bin/dockerd --data-root /dockerData -H fd:// --containerd=/run/containerd/containerd.sock
```

#### 3. Reload and Restart Docker
```bash
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl restart docker
```

#### 4. Verify the Change
```bash
docker info | grep 'Docker Root Dir'
```

Should show:
```
Docker Root Dir: /dockerData
```

---

## ✅ Part 3: Create and Use a Custom Docker Network

### 📌 Why?
Containers in the default bridge network can't resolve names—only IPs.

### 🔧 Demonstration:

#### Default Bridge Network:
```bash
docker run --rm -d --name app1 -p 8000:80 nginx:latest
docker run --rm -d --name app2 -p 8001:80 nginx:latest
```

Inspect:
```bash
docker inspect app1
docker inspect app2
```

Exec into `app1` and try pinging:
```bash
docker exec -it app1 bash
apt update && apt install iputils-ping
ping <app2 IP>     # ✅ Works
ping app2          # ❌ Fails
```

#### Create Custom Network:
```bash
docker network create custom --driver bridge
```

Verify:
```bash
docker network ls
```

#### Run Containers in Custom Network:
```bash
docker run --rm -d --name app3 -p 8003:80 --network custom nginx:latest
docker run --rm -d --name app4 -p 8004:80 --network custom nginx:latest
```

Inside `app3`:
```bash
ping app4  # ✅ Works
```

#### Connect Existing Container to Custom Network:
```bash
docker network connect custom app1
docker inspect custom
```

---

## ✅ Summary

| Task                             | Command/File                                                    |
|----------------------------------|-----------------------------------------------------------------|
| Format EBS volume                | `sudo mkfs.ext4 /dev/xvdf`                                      |
| Mount EBS via UUID               | Edit `/etc/fstab`                                               |
| Change Docker storage path       | Edit `docker.service` → `--data-root=/dockerData`              |
| Restart Docker safely            | `systemctl daemon-reexec && systemctl restart docker`          |
| Create custom Docker network     | `docker network create custom --driver bridge`                 |
| Enable container name ping       | Use `--network custom` or `docker network connect`             |

