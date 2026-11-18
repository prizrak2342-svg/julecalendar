# Linux deployment plan

**Status:** planning only. No VM, IP allocation, SSH account, MongoDB service, or PM2 deployment has been verified. Values below are proposals or fields to complete, not provisioned infrastructure.

## VM specifications

Proposed starting point for a small school deployment:

| Resource | Initial proposal | Rationale |
| --- | --- | --- |
| Operating system | School-approved supported Linux distribution | Match available administration and update procedures |
| CPU | 2 vCPUs | Initial capacity for the web process and small database workload |
| Memory | 4 GB RAM | Initial headroom if Node.js and MongoDB share the VM |
| Storage | 25 GB disk | Application, database, packages, and bounded logs; media volume may require more |
| Backup | Separate school-approved backup destination | Recovery must remain possible after loss of the VM |

These are estimates, not measured capacity. Confirm expected concurrent users, media hosting, database location, and retention. Run load checks and monitor CPU, RAM, disk, and response times before accepting the sizing.

## IP and service plan

| Setting | Planned value or information to record |
| --- | --- |
| Hostname | To be assigned by the school |
| VM IP and subnet/prefix | To be allocated by the network administrator |
| Gateway and DNS resolver | To be supplied by the school |
| Public or school-facing URL | To be confirmed, including DNS and TLS setup |
| SSH | TCP 22; restrict to approved management networks |
| Web access | HTTPS 443 through a reverse proxy; HTTP 80 only if needed for redirect/certificate setup |
| Node.js | Port 3000 behind the proxy; do not expose it directly to clients |
| MongoDB | Default TCP 27017 if hosted locally; restrict to local/private application access |

The current app uses `app.listen(3000)` without an explicit host. Before deployment, bind it to the intended private/loopback interface or enforce equivalent network restrictions. The deployment topology must be tested, not assumed from this plan.

## VM users, roles, and permissions

| Account or group | Proposed access | Purpose |
| --- | --- | --- |
| Named student developer account | Own SSH key; scoped deployment access and necessary administration rights | Development and operation |
| One named account per teacher | Each teacher's own SSH key; access level agreed and documented individually | Assessment and support; all teachers require SSH access |
| `julekalender` service account | No shared interactive login; owns application runtime and PM2 process | Run the application without root privileges |
| Deployment group | Approved developer/teacher accounts only | Controlled access to project files |
| System administrator | Administrative access as required by school policy | OS, network, and account maintenance |

Record actual usernames, groups, authorized-key fingerprints, and sudo scope after provisioning. These Linux accounts are separate from the web application's student/admin roles. Never include private SSH keys, passwords, or connection secrets in documentation.

Proposed application directory: `/var/www/julekalender`. Assign explicit owner/group access, avoid world-writable files, restrict `.env` to the service account (mode `600`), and grant write access only where needed. Test SSH access for the developer and every teacher before changing login policies.

## Planned configuration

The app currently reads none of these variables. Implement and validate configuration loading before using this example, then add a tracked `.env.example` and ignore `.env` in Git.

```dotenv
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/julekalender
```

The URI is an illustrative local address without credentials. The deployed database must use the agreed authentication and network configuration. Add session or authentication secrets only after selecting the authentication approach; `.env.example` must contain placeholders, never real secrets. Store calendar timestamps explicitly so availability does not depend on the server's local timezone.

## Deployment sequence

1. Provision the VM; record the actual sizing and IP plan above.
2. Create named accounts and groups, install public SSH keys, and verify developer and teacher access.
3. Install Git, the agreed supported Node.js/npm versions, MongoDB or access to the chosen MongoDB host, a reverse proxy, and PM2. Record exact versions after installation.
4. Deploy a reviewed repository revision into `/var/www/julekalender`, set ownership and permissions, and run `npm ci` in that directory.
5. Create the restricted `.env`, configure database access, and verify that the implemented app reads its configuration and reaches MongoDB.
6. Run the app under the service account's PM2 instance from the application directory:

   ```sh
   pm2 start app.js --name julekalender
   pm2 save
   pm2 startup
   ```

   Run `pm2 startup` as the intended service account, then have an authorized administrator execute the platform-specific command it prints. Confirm the generated service uses that same account and PM2 home. Never run a second root-owned copy of the app.

7. Configure the reverse proxy, HTTPS, firewall, log rotation, and database backups.
8. Verify the browser flows, proxy access, database persistence, PM2 restart, and automatic recovery after VM reboot. Record actual results in [testing](testing.md).

## Operation and troubleshooting

Run `pm2 status` and `pm2 logs julekalender` as the service account to inspect the process. After a reviewed update and dependency/configuration changes, use `pm2 restart julekalender --update-env`, then perform a smoke check. Keep the deployed revision and a compatible rollback revision recorded; database changes require a separate recovery plan.

For an unavailable site, check DNS/network access, reverse-proxy status, PM2 logs, and database connectivity in that order. For startup errors, verify permissions, the configured port, Node.js version, and environment loading. Limit log retention and avoid logging student answers, credentials, or session secrets unnecessarily.

Before handover, record the backup schedule, retention, location, restore procedure, support contact, and a successful restore test. The assignment requires usable access documentation; complete the pending infrastructure fields once the server is configured.
