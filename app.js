const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const puppeteer = require("puppeteer");

const COOKIES_FILE = "cookies.txt";
const OUTPUT_DIR = path.resolve("output");

function formatCookiesForYtDlp(cookies) {
  return (
    "# Netscape HTTP Cookie File\n\n" +
    cookies
      .map((cookie) => {
        const domain = cookie.domain.startsWith(".") ? cookie.domain : `.${cookie.domain}`;
        const flag = cookie.domain.startsWith(".") ? "TRUE" : "FALSE";
        const path = cookie.path || "/";
        const secure = cookie.secure ? "TRUE" : "FALSE";
        const expiration = Math.floor(cookie.expires || Date.now() / 1000 + 3600);
        return [domain, flag, path, secure, expiration, cookie.name, cookie.value].join("\t");
      })
      .join("\n")
  );
}

async function ensureCookies() {
  if (fs.existsSync(COOKIES_FILE)) {
    console.log("🍪 cookies.txt already exists — skipping login.");
    return;
  }

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--disable-infobars",
    ],
    ignoreDefaultArgs: ["--enable-automation"],
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
  );
  await page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" });

  console.log("🔗 Opening YouTube... Please log in manually.");
  await page.goto("https://www.youtube.com", { waitUntil: "networkidle2" });

  console.log("⏳ Waiting 45 seconds for login...");
  await new Promise((resolve) => setTimeout(resolve, 45000));

  const cookies = await page.cookies();
  fs.writeFileSync(COOKIES_FILE, formatCookiesForYtDlp(cookies));
  console.log("✅ cookies.txt saved.");
  await browser.close();
}

function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }
}

function promptUserInput() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Enter YouTube URLs (comma-separated): ", (input) => {
      rl.close();
      const videos = input
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url);
      resolve(videos);
    });
  });
}

function sanitizeFilename(name) {
  return name.replace(/[<>:"/\\|?*]/g, "");
}

function processVideo(video) {
  console.log(`📥 Fetching title for: ${video}`);

  exec(`yt-dlp --cookies ${COOKIES_FILE} --legacy-server-connect --get-title "${video}"`, (titleError, titleStdout) => {
    if (titleError) {
      console.error(`❌ Failed to fetch title: ${video}`, titleError);
      return;
    }

    const videoTitle = sanitizeFilename(titleStdout.trim());
    const tempFilename = `temp_${videoTitle}`;
    const outputFilename = path.join(OUTPUT_DIR, `${videoTitle}.mp4`);

    console.log(`📥 Downloading as "${videoTitle}.mp4"`);

    exec(
      `yt-dlp --cookies ${COOKIES_FILE} --legacy-server-connect -f "bv*+ba/b" -o "${tempFilename}.%(ext)s" "${video}"`,
      (downloadError) => {
        if (downloadError) {
          console.error(`❌ Download failed: ${video}`, downloadError);
          return;
        }

        console.log(`✅ Download complete: ${videoTitle}`);

        const downloadedFile = fs.readdirSync(".").find((file) => file.startsWith(tempFilename));
        if (!downloadedFile) {
          console.error(`❌ Temp file not found for: ${videoTitle}`);
          return;
        }

        const downloadedFilePath = path.resolve(downloadedFile);

        console.log(`🎬 Converting ${downloadedFile} to MP4...`);
        exec(
          `ffmpeg -i "${downloadedFilePath}" -c:v libx264 -preset veryfast -crf 23 -c:a aac -b:a 192k "${outputFilename}"`,
          (convertError) => {
            if (convertError) {
              console.error(`❌ Conversion failed: ${videoTitle}`, convertError);
              return;
            }

            console.log(`✅ Converted to MP4: ${outputFilename}`);
            fs.unlink(downloadedFilePath, (unlinkErr) => {
              if (unlinkErr) {
                console.warn(`⚠️ Failed to delete temp file: ${downloadedFilePath}`);
              } else {
                console.log(`🧹 Deleted temp file: ${downloadedFilePath}`);
              }
            });
          }
        );
      }
    );
  });
}

async function main() {
  await ensureCookies();
  ensureOutputDir();

  const videos = await promptUserInput();
  if (videos.length === 0) {
    console.log("🚫 No URLs provided. Exiting...");
    return;
  }

  videos.forEach(processVideo);
}

main();
