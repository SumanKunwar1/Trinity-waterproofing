const sharp = require("sharp");
const fs = require("fs");

const imagePath =
  "C:\\Users\\admin\\Downloads\\Crystaline-waterproofing-coating-01.png";

sharp(imagePath)
  .metadata()
  .then((metadata) => {
    fs.stat(imagePath, (err, stats) => {
      if (err) {
        console.error("Error reading file stats:", err);
        return;
      }

      console.log("Image Metadata:");
      console.log("Format:", metadata.format); // File format (e.g., png, jpeg)
      console.log("Width:", metadata.width); // Width in pixels
      console.log("Height:", metadata.height); // Height in pixels
      console.log("Channels:", metadata.channels); // Number of color channels
      console.log("Density (DPI):", metadata.density); // DPI if available
      console.log("Space:", metadata.space); // Color space (e.g., srgb)
      console.log("Has Alpha Channel:", metadata.hasAlpha); // Whether it has an alpha channel
      console.log("Orientation:", metadata.orientation); // Orientation, if available
      console.log("File Size (bytes):", stats.size); // Size in bytes
      console.log("MIME Type:", `image/${metadata.format}`); // Approx. MIME type
    });
  })
  .catch((err) => {
    console.error("Error:", err);
  });
