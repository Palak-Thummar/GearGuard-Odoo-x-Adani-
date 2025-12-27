# Quick Start Guide: Docker Setup

## Prerequisites
- **Docker Desktop** installed (download from [docker.com](https://www.docker.com/products/docker-desktop))

## Start Odoo + PostgreSQL

```bash
cd GearGuard-Odoo-x-Adani-
docker-compose up -d
```

**Wait 30–60 seconds** for Odoo to initialize (first run is slower).

## Access Odoo Web UI

Open in your browser:
```
http://localhost:8069
```

## Setup Database & Install Module

1. **Create a new database** (if prompted):
   - Database Name: `odoo`
   - Email: `admin@example.com`
   - Password: `admin`
   - Click **Create Database**

2. **Update App List**:
   - Go to **Settings** (⚙️ icon, top-right)
   - Search for **"Update Apps List"** and click it
   - Wait for the scan to complete

3. **Install GearGuard Maintenance**:
   - Still in Settings, search for **"GearGuard"**
   - Click the **GearGuard Maintenance** module card
   - Click **Install**

4. **Access the Module**:
   - Go to **GearGuard** (top menu) → **Equipment**, **Teams**, or **Requests**
   - Start creating records!

## Stop Everything

```bash
docker-compose down
```

## View Logs (Troubleshoot)

```bash
docker-compose logs -f odoo
```

## Notes
- Default admin login: `admin` / `admin`
- Module is auto-mounted at `/mnt/extra-addons/gear_guard_maintenance`
- Data persists in Docker volumes until you run `docker-compose down -v`
- On Windows, Docker Desktop uses Hyper-V or WSL 2

---

**Stuck?** Try:
```bash
docker-compose down -v
docker-compose up -d
```
Then revisit http://localhost:8069 in 60 seconds.
