# DNS & CNAME Technical Walkthrough: How Web Addresses & Subdomains Work

**Author**: Srikant (FlyRank AI Intern)  
**Track**: General AI Fluency  
**Target FlyRank Subdomain**: `srikant.flyrank.ai`  
**Host Target URL**: `srikant-90.github.io/flyrank-ai-capstone` (or `srikant-flyrank.netlify.app`)  
**Date**: August 2026  

---

## 1. What is a CNAME Record? (Explained for Everyone)

### The Phonebook Alias Analogy
Imagine you have a friend named **Srikant** who frequently moves between apartments. Instead of giving everyone his physical home address (an IP address like `185.199.108.153`), Srikant says: *"If you want to reach me, look up my alias `srikant.flyrank.ai` — it points directly to my permanent hosting address `srikant-90.github.io`."*

In the Domain Name System (DNS), a **CNAME Record** (short for **Canonical Name Record**) is an alias entry. It tells the internet:  
> *"Don't map this domain directly to a fixed IP address. Instead, point `srikant.flyrank.ai` to `srikant-90.github.io`, and let GitHub/Netlify handle the exact IP routing!"*

### Why We Use CNAME Records for Subdomains
1. **Dynamic IP Protection**: Cloud providers (GitHub Pages, Netlify, Cloudflare) change their underlying server IP addresses constantly to handle traffic loads and DDoS protection.
2. **Zero Maintenance**: When FlyRank points your subdomain `srikant.flyrank.ai` via CNAME to your host, you never have to manually update server IP addresses if GitHub/Netlify changes their infrastructure.

### The Value Your Record Will Hold
When Ops grants your FlyRank subdomain at capstone approval, the DNS record created in FlyRank's DNS manager will be:

```dns
NAME:               TYPE:     TARGET (VALUE):
srikant.flyrank.ai  CNAME     srikant-90.github.io
```

---

## 2. What Happens Step-by-Step When Someone Types Your Address?

When a teammate or recruiter opens their web browser and types `https://srikant.flyrank.ai`, a sub-second 7-step journey takes place behind the scenes:

```
[ User Browser ] ──(1) Check Cache──► [ Local OS Resolver ]
                                              │ (2) Query
                                              ▼
[ Target Host Server ] ◄──(6) CNAME Alias ── [ Recursive Resolver (8.8.8.8) ]
   (GitHub / Netlify)                         │
                                              ├─► (3) Root Server (.)
                                              ├─► (4) TLD Server (.ai)
                                              └─► (5) FlyRank Authoritative DNS
```

### Step 1: Browser & Local Cache Check
The user's browser checks if it already knows the IP address for `srikant.flyrank.ai` in its short-term memory (browser cache or OS DNS cache). If cached recently, it skips the web query entirely.

### Step 2: The Recursive Resolver (The Courier)
If not cached, the computer sends a query to a **Recursive DNS Resolver** (usually provided by their ISP or public DNS services like Google `8.8.8.8` or Cloudflare `1.1.1.1`). The resolver acts like a courier tasked with hunting down the address.

### Step 3: Asking the Root Name Server (`.`)
The resolver asks a **Root Name Server** (one of 13 global clusters handling the global internet root `.`). The Root Server responds: *"I don't know `srikant.flyrank.ai`, but I know who handles all `.ai` domains. Ask the `.ai` TLD server!"*

### Step 4: Asking the TLD Name Server (`.ai`)
The resolver asks the **Top-Level Domain (TLD) Server** for `.ai`. The `.ai` server replies: *"FlyRank manages `flyrank.ai`. Go ask FlyRank's Authoritative Name Server at `ns1.flyrank.ai`!"*

### Step 5: Asking the Authoritative Name Server
The resolver queries FlyRank's Authoritative Name Server. The Authoritative Server looks up the zone records and finds our CNAME entry:
> *"The canonical address for `srikant.flyrank.ai` is `srikant-90.github.io`."*

### Step 6: Resolving the Alias to an IP Address
The resolver follows `srikant-90.github.io` to GitHub/Netlify's DNS servers, which return the active web server IP address (e.g. `185.199.108.153`). The resolver hands this final IP back to the user's browser.

### Step 7: HTTPS Handshake & The Padlock 🔒
The user's browser initiates an **encrypted TLS/HTTPS handshake** with the host server. The server presents a cryptographic **SSL/TLS certificate** (automatically issued via Let's Encrypt or host SSL) matching `srikant.flyrank.ai`. The browser verifies the certificate, displays the green padlock 🔒, and loads your personal portfolio page!

---

## 3. FlyRank Subdomain Provisioning Checklist (For Capstone Time)

When your capstone is approved at the end of the internship track, perform the following 4-step checklist to attach your custom subdomain:

```
[ Step 1: Ops Creates CNAME ] ──► [ Step 2: Add Custom Domain in Host ]
                                             │
[ Step 4: Confirm HTTPS Padlock ] ◄── [ Step 3: Wait for DNS Propagation ]
```

- [ ] **Step 1: Confirm Ops Provisioning**: Ops creates the DNS CNAME record mapping `srikant.flyrank.ai -> srikant-90.github.io` (or `srikant-flyrank.netlify.app`).
- [ ] **Step 2: Add Custom Domain in Hosting Settings**:
  - *On GitHub Pages*: Go to Repository Settings -> Pages -> Custom domain -> Enter `srikant.flyrank.ai` -> Save.
  - *On Netlify*: Go to Site Configuration -> Domain Management -> Add custom domain -> Enter `srikant.flyrank.ai`.
- [ ] **Step 3: Wait for DNS Propagation**: Allow 5 to 15 minutes for global DNS caches to update. You can verify propagation using `dig srikant.flyrank.ai` or [whatsmydns.net](https://www.whatsmydns.net).
- [ ] **Step 4: Verify HTTPS Certificate & Padlock**: Open `https://srikant.flyrank.ai` in a clean private browser window and confirm the HTTPS padlock icon appears cleanly without SSL warnings.

---

## 4. Deployed Files & Explanation Guarantee

Every file in this repository deployment serves a specific purpose:

1. **`index.html`**: Root portfolio landing page containing semantic HTML5 structures, bio positioning, social links, and project showcase cards.
2. **`Week5_Agent_Design_Doc.html`**: Styled specification presentation for the ResearchScout AI Agent.
3. **`Week5_Build_Log.html`**: Styled execution and iteration log for Checkpoint 1.
4. **`Week5_DNS_Walkthrough.html`**: Styled presentation version of this DNS & CNAME walkthrough.
