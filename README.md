# ✨ Dhanush Login — Creator Lounge

> **A premium, modern web experience combining a stylish sign-in interface with an interactive entertainment hub.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-ff3b88?style=for-the-badge)](https://dhanush-login.onrender.com)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-Backend-000000?style=for-the-badge&logo=express)](https://expressjs.com/)

## 🚀 Project Hub

**Dhanush Login** is a personal web project designed as a polished, mobile-friendly **Creator Lounge**. It starts with a social-style username experience and transitions into a second entertainment round with interactive challenges.

### 🎯 Experience Flow

**Round 01 — Welcome / Sign In**
- Premium glassmorphism interface
- Username input with live preview
- Optional password field for the local visual experience
- Show / hide password control
- Password-strength visual meter
- Responsive mobile-first layout
- Smooth transition into the next round

**Round 02 — Entertainment Hub**
- 🎲 Surprise generator
- ✨ Fun messages
- 🎯 Quick challenges
- Interactive result area
- User handle carried into the experience
- Easy return to Round 01

## 🔐 Privacy & Safety

This project is intentionally designed so that **actual passwords are never transmitted to the backend or stored by the application**.

The backend can receive basic, non-sensitive interaction information such as:
- Username entered by the visitor
- Entry ID
- Timestamp
- Page/action information
- Browser language
- Timezone
- Viewport dimensions

No passwords, session cookies, access tokens, or authentication secrets are collected by the application.

## 🧩 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| UI | Glassmorphism + gradient visual system |
| Backend | Node.js + Express |
| Deployment | Render |
| Notifications | Optional Telegram bot integration |

## 📁 Project Structure

```text
Dhanush-Login/
├── index.html      # Main UI and two-round experience
├── style.css       # Responsive premium visual design
├── script.js       # Frontend interactions and entertainment logic
├── server.js       # Express server and safe backend telemetry
├── package.json    # Node.js project configuration
└── README.md       # Project documentation
```

## ⚙️ Run Locally

```bash
npm install
npm start
```

Then open:

```text
http://localhost:3000
```

## 🌐 Live Project

**Creator Lounge:** https://dhanush-login.onrender.com

## 🛠️ Environment Variables

For optional Telegram notifications, configure secrets through your hosting provider's environment-variable settings:

```text
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

> Never commit real tokens or other secrets to GitHub.

## 🎨 Design Direction

The visual language focuses on:

- Premium dark background
- Pink / purple / orange gradient lighting
- Frosted glass cards
- Rounded modern controls
- High-contrast typography
- Responsive layouts for phones and desktops
- Simple interactions with an entertainment-first feel

## 📌 Project Status

**Active personal project — Creator Lounge experience**

Built for experimentation, frontend design practice, backend integration, and learning modern web development.

## 👨‍💻 Creator

**Dhanush Creations**

> Think. Create. Code. Evolve.

---

⭐ If you like the project, consider starring the repository and following its development.
