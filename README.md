<div align="center">
  <img src="https://img.icons8.com/color/144/000000/detective.png" alt="DevTrace Detective" />
  
  # 🕵️‍♂️ DevTrace: The Developer Notebook
  
  **A modern, gamified, and heavily stylized reimagining of legacy bug trackers.**
  
  [![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.0-purple?style=for-the-badge&logo=vite)](https://vitejs.dev/)
  [![Firebase](https://img.shields.io/badge/Firebase-v10-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

  Say goodbye to enterprise grey and endless form fields. Say hello to a **Developer Notebook** aesthetic, where bugs are "cases," evidence is pinned with masking tape, and resolving issues fires off victory confetti! 🎉
</div>

---

## 💡 The Mission: Bugzilla Reconstruction

The goal of this project was to tackle the **Developer Tool Reconstruction** of classic systems like Bugzilla. Instead of merely reskinning it, **DevTrace** rethinks the user experience from the ground up:

- 🧬 **Deconstruct the Legacy Tool**: We extracted the essential DNA of Bugzilla (Statuses, Severities, Priorities, Attachments, Comments, Audit Logs, and Dependencies).
- ⚡ **Extract Core Workflows**: Developers need to rapidly enter logs, drop screenshots, assign teammates, and view the burn-down without friction.
- 🎨 **Reconstruct a Modern Experience**: Built with a sleek React SPA architecture, using intuitive visual cues (sticky notes, washi tape tags, polaroid attachments) rather than sterile tables.

## ⚖️ The Classic Rules, Reimagined

Even though we’ve given the UI a massive glow-up, DevTrace is still built on the legendary rules that made classic bug trackers great:

1. **Bugs Only, No Fluff**: We are a pure defect-tracking tool. No generic project boards, no feature creep. We are here to help you solve "cases" (bugs) and nothing else.
2. **Lightning Fast**: By filtering everything instantly on the client side, we skip the slow, speed-sucking loading screens so you can close cases faster.
3. **Plug-and-Play Data**: Designed so you can easily swap out the backend database anytime without breaking the app.
4. **Works Everywhere**: We stick to clean HTML and standard CSS. No weird browser-specific hacks.

---

## ✨ Core Features

### 📂 1. Bug Dossiers (The Detail View)
- View bugs as interactive "case folders" complete with red-thread connections, masking tape, and severity stickers.
- Drop screenshots that instantly render as pinned Polaroid photos.
- Interactive evidence reproduction checklists.

### 🔎 2. Interactive Triage
- Filter by severity, status, and product using a blazing-fast UI.
- Export your current filtered list instantly to CSV.
- **Report a Problem** confidential tip line built right into the sidebar.

### 🏆 3. Detective Dashboard & Squad
- **Live Activity Feed** tracking the team's audit logs.
- Bug Heatmaps, Kanban previews, and Sprint Burndown charts.
- **"Suspects" Leaderboard**: A police lineup tracking which detectives have squashed the most bugs!
- Developer Mood tracking and a caffeine meter.

### 🔥 4. Live Synchronization & Firebase Auth
- Secure **Google Authentication** to verify your detectives.
- Real-time GitHub Actions syncing GitHub Events directly into the **Cloud Firestore** database.

---

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| **Core** | React 18, TypeScript, Vite |
| **Backend & Sync** | Firebase (Auth & Firestore), GitHub Actions |
| **Styling** | Vanilla CSS (`index.css`), CSS Variables, Glassmorphism |
| **Typography** | Inter, Permanent Marker, Caveat, Fira Code |
| **Icons & Extras** | Lucide React, `canvas-confetti` |

---

## 🚀 Getting Started Locally

### 1. Clone & Install
```bash
git clone https://github.com/Saitriveni23/Dev-Trace-.git
cd Dev-Trace-
npm install
```

### 2. Configure Firebase (Optional but Recommended)
Set up a Firebase project and add your `.env` file with the configuration keys to enable Google Auth and Live Sync.

### 3. Run the Detective Workspace
```bash
npm run dev
```
Visit `http://localhost:5173` to start investigating glitches!

---
<div align="center">
  <i>Built by Triveni for the Developer Tool Reconstruction Challenge.</i>
</div>
