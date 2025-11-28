# 🪐 Mercurius

**Your Ultimate Local File Transfer & Review Hub.**

Mercurius is a modern, high-speed desktop application designed to bridge the gap between your mobile devices and your computer. It allows you to transfer photos and videos instantly over your local network—no cloud, no internet, no compression.

Once your files land on your desktop, Mercurius transforms into a powerful review station. With a **TikTok-style vertical gallery**, you can fly through your uploads, keeping the best shots and discarding the rest with lightning-fast keyboard shortcuts.

---

## 🚀 Why Mercurius?

### 🔒 **Private & Secure**
Your data never leaves your local network. Files go directly from your phone to your computer. No third-party servers, no privacy risks.

### ⚡ **Blazing Fast**
Leveraging your local Wi-Fi speed, transfers are instantaneous. Forget about slow cloud uploads and downloads.

### 🎮 **Gamified Review Workflow**
Reviewing hundreds of photos can be tedious. Mercurius makes it fun and efficient:
- **Vertical Scroll**: Smooth, snap-scrolling feed just like your favorite social apps.
- **Keyboard First**: Use arrow keys to navigate and sort.
    - ⬅️ **Left Arrow**: Keep (Green Check)
    - ➡️ **Right Arrow**: Reject (Red X)

### 📱 **Universal Compatibility**
No need to install an app on your phone. Just scan the **QR Code** displayed on the desktop app, and you're ready to upload directly from your mobile browser.

---

## ✨ Key Features

- **Instant Local Uploads**: Drag & drop or select files from your mobile device.
- **Dynamic QR Code**: Automatically detects your local IP for seamless connection.
- **Custom Upload Directory**: Choose exactly where your files are saved on your PC.
- **Smart Gallery**:
    - Supports Images (JPG, PNG, WEBP, SVG) and Videos (MP4, WEBM, MOV).
    - Visual feedback for "Keep" vs "Reject" status.
- **Multilingual**: Native support for **English** 🇬🇧 and **Italian** 🇮🇹.
- **Dark Mode**: Sleek, eye-friendly interface for late-night editing sessions.

---

## 🛠️ Technical Setup

Mercurius is built with cutting-edge web technologies wrapped in a robust Electron shell.

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/mercurius.git
    cd mercurius
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

### 🏃‍♂️ Running in Development

To start the application in development mode (with hot-reload for both Renderer and Main processes):

```bash
npm run dev
```

This command will:
- Start the **Vite** dev server for the React UI.
- Compile the **Electron** main process.
- Launch the **Electron** window.
- Start the internal **Hono** server for mobile uploads.

### 📦 Building for Production

To create a distributable package for your OS (macOS, Windows, or Linux):

```bash
npm run build
```

The output will be available in the `dist` folder.

---

## 💻 Tech Stack

- **Electron**: Desktop runtime.
- **React**: UI library.
- **Vite**: Next-generation frontend tooling.
- **Hono**: Ultra-fast web standard framework for the local upload server.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **TypeScript**: Type safety and developer experience.
- **i18next**: Internationalization.

---

Made with ❤️ by Luca Pulina.
