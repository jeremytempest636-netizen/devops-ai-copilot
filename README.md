# 🧠 DevOps AI Copilot

AI-powered infrastructure monitoring and troubleshooting assistant. Monitors server metrics and Docker containers in real time, and uses an LLM to diagnose incidents and recommend fixes — the way a senior DevOps engineer would.

![Dashboard Screenshot](docs/screenshots/dashboard.png)

## Why I built this

Most "AI + API" portfolio projects are just a chat wrapper around an LLM. This one is different: it reads **real system state** (CPU/RAM/disk via `systeminformation`, live container status via the Docker Engine API), and only then hands that structured context to an LLM to produce a root-cause diagnosis — closer to how an actual monitoring/observability tool would use AI.

## Features

- 📊 **Real-time system metrics** — CPU, RAM, disk usage pulled directly from the host
- 🐳 **Docker container monitoring** — live status, CPU, and memory per container
- 🤖 **AI log analyzer** — paste raw logs, get a structured diagnosis (severity, root cause, fix steps, commands)
- 🚨 **Automatic incident detection** — dashboard flags unhealthy containers and offers one-click AI diagnosis
- 📁 **Incident history** — every diagnosis is saved and can be marked resolved
- 🐋 **Fully containerized** — the app itself ships with a multi-stage Dockerfile and Docker Compose setup

## Architecture