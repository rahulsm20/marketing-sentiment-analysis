import fs from "fs";
import path from "path";
import UglifyJS from ("uglify-js");

const sourceFolder = "src"; // Change this to your source folder
const outputFolder =  "dist"; // Change this to your output folder

// Function to recursively traverse through directories
function traverseDirectory(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      traverseDirectory(filePath);
    } else {
      minifyFile(filePath);
    }
  });
}

// Function to minify a single file
function minifyFile(filePath) {
  const sourceCode = fs.readFileSync(filePath, "utf8");
  const minifiedCode = UglifyJS.minify(sourceCode).code;
  const outputFile = filePath.replace(sourceFolder, outputFolder);
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, minifiedCode, "utf8");
  console.log(`Minified ${filePath} -> ${outputFile}`);
}

// Start minification process
traverseDirectory(sourceFolder);
