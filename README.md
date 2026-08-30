# DevTrace 📓

**DevTrace** is a modern, gamified, and heavily stylized reimagining of legacy bug trackers (inspired by Bugzilla). We deconstructed the core developer workflows—filing bugs, triaging, collaborating, and tracking progress—and reconstructed them into an environment that developers *actually want to use*. 

Say goodbye to enterprise grey and endless form fields. Say hello to a **Developer Notebook** aesthetic, where bugs are "cases," evidence is pinned with masking tape, and resolving issues fires off victory confetti! 🎉

## 💡 The Mission: Track 2 - Bugzilla Reconstruction

The goal of this project was to tackle **Track 2: Developer Tool Reconstruction – Bugzilla**. 
Instead of merely reskinning Bugzilla, DevTrace rethinks the user experience from the ground up:
- **Deconstruct the legacy tool**: We extracted the essential DNA of Bugzilla (Statuses, Severities, Priorities, Attachments, Comments, Audit Logs, and Dependencies).
- **Extract core workflows**: Developers need to rapidly enter logs, drop screenshots, assign teammates, and view the burn-down without friction.
- **Reconstruct a modern experience**: Built with a sleek React SPA architecture, using intuitive visual cues (sticky notes, washi tape tags, polaroid attachments) rather than sterile tables.
- **Innovate beyond the reference**:
  - 🎨 **Playful Aesthetic**: A hand-drawn, notebook-style interface that makes bug tracking feel like solving a detective case.
  - 🌙 **Dual Modes**: Both Dark and Light notebook covers (themes).
  - 🔊 **Ambient Flow State**: Built-in Lofi beats, rain simulators, and mechanical keyboard ASMR to keep developers in the zone right from their dashboard.
  - 🤖 **AI Clue Insights**: Mocked AI integrations that analyze stack traces to propose root causes instantly.
  - 📊 **Dynamic CSV Exports**: Easily export bug lists to CSV for external reporting.

## ⚖️ The Classic Rules, Reimagined

Even though we’ve given the UI a massive glow-up, DevTrace is still built on the legendary rules that made Bugzilla great. We kept the core DNA, but made it friendly:

1. **Bugs Only, No Fluff**: We are a pure defect-tracking tool. No generic project boards, no feature creep. We are here to help you solve "cases" (bugs) and nothing else.
2. **Built on Open Source**: DevTrace is powered by free, open-source tools like React and Vite. No locked-down commercial systems here.
3. **Lightning Fast**: Nobody likes a slow tool. By filtering everything instantly on your screen, we skip the slow, "speed-sucking" database loading screens so you can close cases faster.
4. **Plug-and-Play Data**: Bugzilla famously made sure it wasn't tied to one specific database. We do the same! Our code is designed so you can easily swap out the backend database anytime without breaking the app.
5. **Works Everywhere**: We stick to the standard rules of the web (clean HTML and standard CSS). No weird browser-specific hacks, meaning your notebook looks perfect no matter what browser you're using.

## ✨ Core Features

1. **Bug Dossiers (The Issue Detail View)**
   - View bugs as interactive "case folders" complete with red-thread connected cases, printed masking tape, and severity stickers.
   - Drop screenshots that instantly render as pinned Polaroid photos.
   - Interactive evidence reproduction checklists.
2. **Interactive Triage (The Bug List)**
   - Filter by severity, status, and product using a fast, client-side data layer.
   - Export your current filtered list instantly to CSV.
3. **The Detective Dashboard**
   - Live **Activity Feed** tracking the team's audit logs.
   - Bug Heatmaps, Kanban previews, and Sprint Burndown charts.
   - Developer Mood tracking and a caffeine meter.
4. **Team Collaboration**
   - Dispatch Memos (Threaded Comments) that look like sticky notes.
   - Reassign bugs instantly via the Lead Detective dropdown.
   - Customizable User Profiles.

## 🛠️ Technology Stack

- **Core**: React 18, TypeScript, Vite
- **Styling**: Vanilla CSS (`index.css`) with heavy use of CSS variables for theming, custom fonts (Inter, Permanent Marker, Caveat, Fira Code), and glassmorphism/paper-morphism elements.
- **Icons**: Lucide React
- **Extras**: `canvas-confetti` for dopamine hits when closing bugs.

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit `http://localhost:5173` to start investigating glitches!

---
*Built for the Developer Tool Reconstruction Challenge.*
