const proc = require("./proc.json");
const constants = {};

module.exports = () => {
  constants.css = (proc.css !== "css") ? require(`gulp-${proc.css}`) : null;
  constants.html = (proc.html !== "html") ? require(`gulp-${proc.html}`) : null;
  constants.js = require(`gulp-${proc.js === "js" ? "babel" : proc.js === "ts" ? "typescript" : proc.js}`);

  return constants;
};
