// const { exec } = require("child_process");
// const fs = require("fs");
// const path = require("path");

// const outputDir = path.resolve("output"); // Define output directory

// // Ensure output directory exists
// if (!fs.existsSync(outputDir)) {
// 	fs.mkdirSync(outputDir);
// }

// const videos = [
	
// ];

// videos.forEach((video, index) => {
// 	const baseFilename = `video${(index + 1).toString().padStart(2, "0")}`;
// 	const tempFilename = `temp_video_${index + 1}`;
// 	let outputFilename = path.join(outputDir, `${baseFilename}.mp4`);

// 	console.log(`📥 Downloading: ${video}`);

// 	// Step 1: Download best video + audio in any format
// 	exec(
// 		`yt-dlp -f "bv*+ba/b" -o "${tempFilename}.%(ext)s" "${video}"`,
// 		(error) => {
// 			if (error) {
// 				console.error(`Error downloading ${video}:`, error);
// 				return;
// 			}
// 			console.log(`✅ Download complete: ${video}`);

// 			// Step 2: Find the correct downloaded filename
// 			fs.readdir(".", (err, files) => {
// 				if (err) {
// 					console.error("Error reading directory:", err);
// 					return;
// 				}

// 				// Detect the downloaded file (could be .webm, .mkv, etc.)
// 				let downloadedFile = files.find((file) =>
// 					file.startsWith(tempFilename)
// 				);
// 				if (!downloadedFile) {
// 					console.error(`Could not find downloaded file for ${video}`);
// 					return;
// 				}

// 				let downloadedFilePath = path.resolve(downloadedFile);

// 				// Step 3: Ensure unique filename in output directory
// 				let counter = 1;
// 				while (fs.existsSync(outputFilename)) {
// 					outputFilename = path.join(
// 						outputDir,
// 						`${baseFilename}-${counter.toString().padStart(2, "0")}.mp4`
// 					);
// 					counter++;
// 				}

// 				console.log(`Converting ${downloadedFile} to MP4...`);

// 				// Step 4: Convert to MP4 using ffmpeg
// 				exec(
// 					`ffmpeg -i "${downloadedFilePath}" -c:v libx264 -preset veryfast -crf 23 -c:a aac -b:a 192k "${outputFilename}"`,
// 					(convertError) => {
// 						if (convertError) {
// 							console.error(
// 								`Error converting ${downloadedFile}:`,
// 								convertError
// 							);
// 							return;
// 						}

// 						console.log(`🎬 Successfully converted to MP4: ${outputFilename}`);

// 						// Step 5: Cleanup temporary files
// 						fs.unlink(downloadedFilePath, (unlinkErr) => {
// 							if (unlinkErr) {
// 								console.error(
// 									`Warning: Could not delete temp file ${downloadedFilePath}`
// 								);
// 							} else {
// 								console.log(`Deleted temporary file: ${downloadedFilePath}`);
// 							}
// 						});
// 					}
// 				);
// 			});
// 		}
// 	);
// });

const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Setup terminal input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const outputDir = path.resolve("output"); // Define output directory

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Prompt user for URLs
rl.question("Enter YouTube URLs (comma-separated): ", (input) => {
  const videos = input.split(",").map((url) => url.trim());

  if (videos.length === 0 || videos[0] === "") {
    console.log("No URLs provided. Exiting...");
    rl.close();
    return;
  }

  videos.forEach((video) => {
    console.log(`📥 Fetching title for: ${video}`);

    // Get video title with legacy server connect option
    exec(`yt-dlp --legacy-server-connect --get-title "${video}"`, (titleError, titleStdout) => {
      if (titleError) {
        console.error(`Error fetching title for ${video}:`, titleError);
        return;
      }

      const videoTitle = titleStdout.trim().replace(/[<>:"/\\|?*]/g, ""); // Sanitize filename
      const tempFilename = `temp_${videoTitle}`;
      const outputFilename = path.join(outputDir, `${videoTitle}.mp4`);

      console.log(`📥 Downloading: ${video} as "${videoTitle}.mp4"`);

      // Step 1: Download best video + audio in any format
      exec(
        `yt-dlp --legacy-server-connect -f "bv*+ba/b" -o "${tempFilename}.%(ext)s" "${video}"`,
        (downloadError) => {
          if (downloadError) {
            console.error(`Error downloading ${video}:`, downloadError);
            return;
          }
          console.log(`✅ Download complete: ${videoTitle}`);

          // Step 2: Find the correct downloaded filename
          fs.readdir(".", (err, files) => {
            if (err) {
              console.error("Error reading directory:", err);
              return;
            }

            let downloadedFile = files.find((file) =>
              file.startsWith(tempFilename)
            );
            if (!downloadedFile) {
              console.error(`Could not find downloaded file for ${video}`);
              return;
            }

            let downloadedFilePath = path.resolve(downloadedFile);

            console.log(`🎬 Converting ${downloadedFile} to MP4...`);

            // Step 3: Convert to MP4 using ffmpeg
            exec(
              `ffmpeg -i "${downloadedFilePath}" -c:v libx264 -preset veryfast -crf 23 -c:a aac -b:a 192k "${outputFilename}"`,
              (convertError) => {
                if (convertError) {
                  console.error(
                    `Error converting ${downloadedFile}:`,
                    convertError
                  );
                  return;
                }

                console.log(`🎬 Successfully converted to MP4: ${outputFilename}`);

                // Step 4: Cleanup temporary files
                fs.unlink(downloadedFilePath, (unlinkErr) => {
                  if (unlinkErr) {
                    console.error(
                      `Warning: Could not delete temp file ${downloadedFilePath}`
                    );
                  } else {
                    console.log(`Deleted temporary file: ${downloadedFilePath}`);
                  }
                });
              }
            );
          });
        }
      );
    });
  });

  rl.close();
});
