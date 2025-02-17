let fs = require("fs");
let ytdl = require("ytdl-core");

let videos = [
	// list of videos as string
];

videos.forEach((video, index) => {
	let filename = `video${(index + 1).toString().padStart(2, "0")}.mp4`;

	let options = {
		quality: "highest",
		filter: "audioandvideo",
	};

	ytdl(video, options)
		.pipe(fs.createWriteStream(filename))
		.on("finish", () => {
			console.log("Video downloaded successfully!");
		})
		.on("error", (err) => {
			console.error("Error downloading video:", err);
		});
});
