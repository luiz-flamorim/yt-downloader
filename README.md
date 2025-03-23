# YouTube Video Downloader (Node + yt-dlp)

This is a simple Node.js script that downloads YouTube videos in MP4 format using `yt-dlp` and converts them using `ffmpeg`. It handles authentication automatically through a browser window (using Puppeteer), stores cookies for reuse, and downloads multiple videos at once.

---

## Features

- Downloads best available video + audio
- Converts to MP4 using `ffmpeg` for compatibility
- Stores all videos in an `output/` folder
- Remembers login via saved cookies (no need to re-login every time)
- Accepts multiple YouTube URLs, comma-separated

---

## Prerequisites

You must have the following installed:

### 1. Node.js

Check if installed:
```sh
node -v
```
If not, install it from [https://nodejs.org](https://nodejs.org).

### 2. Required system tools

Install `yt-dlp` and `ffmpeg`:

#### macOS (Homebrew)
```sh
brew install yt-dlp ffmpeg
```

#### Ubuntu/Debian
```sh
sudo apt update
sudo apt install yt-dlp ffmpeg
```

#### Windows (Chocolatey)
```sh
choco install yt-dlp ffmpeg
```

---

## Setup

1. Install project dependencies:

```sh
npm install
```

This installs Puppeteer and other required packages.

---

## Usage

### 1. Run the script:

```sh
node app.js
```

### 2. Login to YouTube (first time only)

- A browser window will open.
- Log into your YouTube account manually.
- The script waits 45 seconds for you to complete login.
- Cookies will be saved to `cookies.txt` for reuse.

> On future runs, login is skipped automatically if `cookies.txt` already exists.

### 3. Enter video URLs

After login, the terminal will prompt:

```
Enter YouTube URLs (comma-separated):
```

Example input:
```
https://www.youtube.com/watch?v=EXAMPLE1, https://www.youtube.com/watch?v=EXAMPLE2
```

---

## Output

- All videos are downloaded and converted to MP4
- Saved in the `output/` directory
- Files are named after the video title

---

## Notes

- You only need to log in once. After that, cookies are reused automatically.
- To force a fresh login, delete `cookies.txt` and run the script again.

---

## Troubleshooting

### yt-dlp not found
Check with:
```sh
yt-dlp --version
```

### ffmpeg not found
Check with:
```sh
ffmpeg -version
```

If not installed, follow the install steps under "Prerequisites".

---

## License

This project is open-source and available for personal use.
