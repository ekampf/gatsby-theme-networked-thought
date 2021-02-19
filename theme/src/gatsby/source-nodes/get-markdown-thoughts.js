const fs = require(`fs`);
const path = require(`path`);

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

function getMarkdownThoughts({ thoughtsDirectory, generateSlug }) {
  // let filenames = fs.readdirSync(thoughtsDirectory);
  const filenames = getAllFiles(thoughtsDirectory).map((filename) => filename.slice(thoughtsDirectory.length));

  return filenames
    .filter((filename) => {
      return [".md", ".mdx"].includes(path.extname(filename).toLowerCase());
    })
    .map((filename) => {
      const { dir, name } = path.parse(filename);
      const noteName = path.join(dir, name);
      const slug = generateSlug(noteName);
      const fullPath = thoughtsDirectory + filename;
      const rawContent = fs.readFileSync(fullPath, "utf-8");
      const { birthtime, mtime } = fs.statSync(fullPath);
      return {
        birthtime,
        mtime,
        filename,
        fullPath,
        slug,
        name: noteName,
        rawContent,
      };
    });
}

module.exports = {
  getMarkdownThoughts,
};
