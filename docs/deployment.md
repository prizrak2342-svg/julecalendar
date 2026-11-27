# Putting Julekalender on a Linux server

This is how I set up the school VM so other people can use the calendar. I'm using **Ubuntu Server 24.04 LTS**. Anything in `<angle brackets>` gets filled in once the VM is ready.

**Status:** not deployed yet.

## How it all connects

```text
Browser ──80/443──▶ nginx ──▶ Node.js app (PM2, 127.0.0.1:3000) ──▶ MongoDB (127.0.0.1:27017)
```

Visitors only ever talk to nginx. nginx passes the request on to the Node.js app, and the app talks to MongoDB. The app and the database only listen on the server itself, so nobody can reach them from outside.

## 1. How big the VM needs to be

**CPU: 2 cores.** One for the Node.js app and one for MongoDB and nginx. A school calendar has a few hundred users at most. The busiest moment is the morning a new door opens. The heaviest job is hashing a password at login, which takes about 50 ms.

**RAM: 4 GB.** Ubuntu itself uses around 400 MB and the app 100–150 MB. MongoDB takes about half of the remaining memory for its cache, roughly 1.5 GB. Each login briefly needs 19 MB for argon2. 2 GB would just about work, but 4 GB leaves room to breathe.

**Disk: 25 GB.** Ubuntu takes about 5 GB and Node.js with the packages about 300 MB. The database is tiny, under 100 MB, because it's only text. A couple of GB go to logs and backups, and the rest is spare for updates. Videos are embedded from YouTube or Vimeo, not stored on the server.

**Network:** one network card with a fixed IP, so the address doesn't change on everyone.

## 2. IP plan

| What | Value |
| --- | --- |
| Hostname | `julekalender` |
| IP address | `<fill in, e.g. 10.0.0.50/24>` |
| Gateway | `<fill in>` |
| DNS | `<fill in>` |
| Address for users | `http://<IP>` or `https://<domain>` |

Open ports:

- **22** for SSH, from the school network
- **80** and **443** for the website, from everywhere
- **3000** (the app) and **27017** (MongoDB) are not open. They only listen on `127.0.0.1`.

## 3. Who has access

| Account | What it's for | Access |
| --- | --- | --- |
| `<my username>` | Me, the developer | SSH key, `sudo`, group `julekalender-dev` |
| `<teacher1>`, `<teacher2>`, … | Teachers, to check my work | SSH key, group `julekalender-dev`, `sudo` if the school wants it |
| `julekalender` | Runs the app | No password, no SSH login, owns the app and `.env` |
| `julekalender-dev` (group) | People allowed to work on the code | Read and write in `/var/www/julekalender` |
| `mongodb` | Runs the database | Created by MongoDB itself |

The rules I follow:

- Everyone gets their own account and their own SSH key. No shared accounts.
- Once everyone can log in with a key, I turn off password login and root login.
- Only the `julekalender` account can read `.env`, because it holds the database password.
- The app doesn't run as root. If something goes wrong in the app, the damage stays small.
- Linux accounts and accounts in the calendar are separate. A teacher becomes an admin in the calendar through the database, not through Linux.

### SSH keys

Everyone makes a key on their own computer and sends me only the **public** part (the `.pub` file):

```sh
ssh-keygen -t ed25519 -C "name@school"
cat ~/.ssh/id_ed25519.pub
```

| Account | Key fingerprint |
| --- | --- |
| `<my username>` | `<fill in>` |
| `<teacher1>` | `<fill in>` |

## 4. Setting it up

### Step 1: update and install the basics

```sh
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl ufw nginx
sudo hostnamectl set-hostname julekalender
```

### Step 2: users, group and SSH

```sh
sudo groupadd julekalender-dev

sudo adduser <my username>
sudo usermod -aG sudo,julekalender-dev <my username>

# do this for every teacher
sudo adduser <teacher1>
sudo usermod -aG julekalender-dev <teacher1>

# the account that runs the app, without login
sudo adduser --system --group --home /var/www/julekalender --shell /usr/sbin/nologin julekalender
```

Add each person's public key:

```sh
sudo mkdir -p /home/<user>/.ssh
sudo nano /home/<user>/.ssh/authorized_keys    # paste the .pub key here
sudo chown -R <user>:<user> /home/<user>/.ssh
sudo chmod 700 /home/<user>/.ssh
sudo chmod 600 /home/<user>/.ssh/authorized_keys
```

When **everyone** has logged in with their key, change these two lines in `/etc/ssh/sshd_config`:

```text
PasswordAuthentication no
PermitRootLogin no
```

Then run `sudo systemctl restart ssh`.

### Step 3: firewall

```sh
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Step 4: Node.js and PM2

```sh
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs
node -v                  # needs to be 20.19 or newer
sudo npm install -g pm2
```

### Step 5: MongoDB

Install MongoDB 8.0 with the official guide for Ubuntu 24.04: <https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/>. Then start it and create two users, one admin and one only for the app:

```sh
sudo systemctl enable --now mongod
mongosh
```

```js
use admin
db.createUser({ user: "admin", pwd: passwordPrompt(), roles: ["root"] })

use julekalender
db.createUser({ user: "julekalender", pwd: passwordPrompt(), roles: [{ role: "readWrite", db: "julekalender" }] })
```

Turn on passwords and keep MongoDB local in `/etc/mongod.conf`:

```yaml
net:
  bindIp: 127.0.0.1
security:
  authorization: enabled
```

Then run `sudo systemctl restart mongod`.

### Step 6: get the code into /var/www

```sh
sudo git clone https://github.com/prizrak2342-svg/julecalendar.git /var/www/julekalender
sudo chown -R julekalender:julekalender-dev /var/www/julekalender
sudo chmod -R g+rwX,o-rwx /var/www/julekalender
sudo find /var/www/julekalender -type d -exec chmod g+s {} +
sudo git config --system --add safe.directory /var/www/julekalender
cd /var/www/julekalender
sudo -u julekalender npm ci --omit=dev
```

What the permissions do:

- `julekalender-dev` can read and write the files.
- Other users can't see them at all.
- New files automatically get the right group (`g+s`).

### Step 7: the .env file

```sh
sudo -u julekalender cp .env.example .env
sudo -u julekalender nano .env
sudo chmod 600 .env
```

```dotenv
NODE_ENV=production
PORT=3000
HOST=127.0.0.1
MONGODB_URI=mongodb://julekalender:<password>@127.0.0.1:27017/julekalender?authSource=julekalender
SESSION_SECRET=<at least 32 random characters>
```

Watch out: while the site runs on plain `http://` without a certificate, use `NODE_ENV=development`. In `production` the login cookie only works over HTTPS.

### Step 8: run it with PM2

```sh
sudo -u julekalender pm2 start npm --name julekalender -- start
sudo -u julekalender pm2 save
sudo env PATH=$PATH pm2 startup systemd -u julekalender --hp /var/www/julekalender
```

The last command creates a system service, so the app starts again by itself after a reboot.

### Step 9: nginx in front

Create `/etc/nginx/sites-available/julekalender`:

```nginx
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```sh
sudo ln -s /etc/nginx/sites-available/julekalender /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

If the school gives us a domain name, HTTPS is two commands: `sudo apt install certbot python3-certbot-nginx` and `sudo certbot --nginx`.

### Step 10: check that it works

```sh
sudo -u julekalender pm2 status
curl -I http://127.0.0.1:3000
curl -I http://<IP>
sudo reboot     # after this, the site should come back by itself
```

## 5. Updating

```sh
cd /var/www/julekalender
git pull
sudo -u julekalender npm ci --omit=dev
sudo -u julekalender pm2 restart julekalender --update-env
```

## 6. Backups

```sh
sudo mkdir -p /var/backups/julekalender
sudo mongodump --uri="mongodb://admin:<password>@127.0.0.1:27017/?authSource=admin" \
  --db julekalender --out /var/backups/julekalender/$(date +%F)
```

To restore: `mongorestore --uri=... --db julekalender <folder>/julekalender`.

## 7. When something breaks

- **The site doesn't load:** is nginx running (`sudo systemctl status nginx`)? Is the firewall open (`sudo ufw status`)?
- **502 Bad Gateway:** nginx works, but the app doesn't. Check `sudo -u julekalender pm2 status` and `pm2 logs julekalender`.
- **"MONGODB_URI is missing" or "SESSION_SECRET is missing":** `.env` is missing or the `julekalender` user can't read it.
- **No "MongoDB connected" in the log:** is MongoDB running (`sudo systemctl status mongod`)? Are the username and password in `MONGODB_URI` right?
- **Login doesn't stay:** `NODE_ENV=production` without HTTPS (see step 7).
- **Permission denied:** check `ls -l /var/www/julekalender`. After being added to a group, log out and back in.

## 8. Security, in short

- **Passwords:** only stored as argon2id hashes. HTTPS as soon as we have a domain.
- **Logins:** session cookies can't be read by JavaScript and expire after 2 hours.
- **Secrets:** `.env` is not in Git and only the app account can read it.
- **Database:** only reachable from the server itself, and it needs a password.
- **Server:** SSH keys only, no root login, firewall on, regular `apt upgrade`.
- **The app:** runs as its own account without `sudo`, never as root.
- **Personal data (GDPR):** only name, e-mail and answers are stored. Only the winner's name is shown publicly. Everything is deleted when the calendar is over.
