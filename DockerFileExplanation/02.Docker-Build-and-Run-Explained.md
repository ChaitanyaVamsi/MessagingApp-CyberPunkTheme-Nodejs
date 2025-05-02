## 🐳 Docker Commands Explained

### 🔹 `docker build -t chat-app .`

> **Purpose:** Build a Docker image from your project files.

| Part | Meaning |
|------|---------|
| `docker build` | Tells Docker to create an image from your `Dockerfile`. |
| `-t chat-app` | Tags (names) the image as `chat-app`. |
| `.` | Means "build from the current directory". Docker looks for your `Dockerfile` and app files here. |

🧠 **In plain English:**  
> “Create a Docker image called `chat-app` using the Dockerfile and files in this folder.”

---

### 🔹 `docker run -p 3000:3000 chat-app`

> **Purpose:** Start a container from the image you just built.

| Part | Meaning |
|------|---------|
| `docker run` | Starts a new container from an image. |
| `-p 3000:3000` | Maps your **host’s port 3000** to the container’s **port 3000**. |
| `chat-app` | The name of the image to run (from the build step). |

🧠 **In plain English:**  
> “Run the `chat-app` container and make it accessible on my machine’s port `3000`.”

---

## 🟢 Final Effect:

After running these commands, you can open your browser and visit:

```text
http://localhost:3000
