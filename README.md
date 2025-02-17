# 🎥 YouTube Video Downloader

This is a simple Node.js script that **downloads YouTube videos** in **MP4 format** using `yt-dlp` and **ensures macOS compatibility** by converting them with `ffmpeg`. The videos are saved in an `output/` folder, and if a file with the same name exists, a number is added automatically.

---

## 🚀 Features
✔ Downloads the **best video + audio quality**  
✔ Saves videos as **MP4** in an `output/` folder  
✔ **Auto-renames** duplicate files (e.g., `video01.mp4`, `video01-01.mp4`)  
✔ Uses **yt-dlp** instead of `ytdl-core` (which is unreliable)  
✔ **Works on macOS, Windows, and Linux**  

---

## 📌 **Prerequisites**
Before running the script, you need to have **Node.js**, **yt-dlp**, and **ffmpeg** installed.

### ✅ **1. Install Node.js**
Check if you have Node.js installed:
```sh
node -v
```
If you don't have it, download and install it from [nodejs.org](https://nodejs.org/).

---

### ✅ **2. Install Required Dependencies**
Run the following command in your terminal:
```sh
npm install
```
This will install any required dependencies listed in `package.json`.

---

### ✅ **3. Install yt-dlp and ffmpeg**
#### **macOS (Homebrew)**
```sh
brew install yt-dlp ffmpeg
```
#### **Ubuntu/Debian**
```sh
sudo apt update
sudo apt install yt-dlp ffmpeg
```
#### **Windows (Chocolatey)**
```sh
choco install yt-dlp ffmpeg
```

---

## 🎬 **How to Use**
### **1️⃣ Add YouTube Video Links**
- Open `app.js`
- Modify the `videos` array to include the links you want to download:
```js
const videos = [
  "https://www.youtube.com/watch?v=EXAMPLE1",
  "https://www.youtube.com/watch?v=EXAMPLE2"
];
```

### **2️⃣ Run the Script**
Run the following command:
```sh
node app.js
```
This will:
- Download the best **video + audio**.
- Convert it to **MP4** if necessary.
- Save it inside the **output/** folder.

---

## 📺 **Where are the Videos Saved?**
- All downloaded videos are stored inside an `output/` folder.
- If a file with the same name exists, the script adds a number:
  ```
  output/
  ├── video01.mp4
  ├── video01-01.mp4
  ├── video02.mp4
  ```

---

## 🛠 **Updating Dependencies**
To keep your project clean and up to date:
```sh
npm prune       # Remove unused dependencies
npm update      # Update to latest compatible versions
npm outdated    # Check for outdated packages
npx npm-check-updates -u  # Update all packages to latest versions
npm install     # Install updated dependencies
```

---

## 📝 **Troubleshooting**
### 🔹 **Error: yt-dlp not found**
Make sure `yt-dlp` is installed by running:
```sh
yt-dlp --version
```
If not installed, follow the installation steps above.

### 🔹 **Error: ffmpeg not found**
Check if `ffmpeg` is installed:
```sh
ffmpeg -version
```
If not, install it using Homebrew, apt, or Chocolatey.

---

## 🐝 **License**
This project is open-source and available for personal use.

---

## 💡 **Contributions**
Feel free to **fork** this project, suggest improvements, or add features!

---

### 💯 **Now Just Run:**
```sh
node app.js
```
And enjoy your downloaded videos! 🎥✨

