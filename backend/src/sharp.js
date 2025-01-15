const sharp = require("sharp");

sharp("C:/Users/ranad/OneDrive/Desktop/Was Media Office/products/IMG_7405.JPG")
  .toBuffer()
  .then((data) => {
    console.log("File is valid for compression");
  })
  .catch((err) => {
    console.error("Error:", err);
  });
