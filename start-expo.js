const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const envPath = path.join(".", ".env");
const file = fs.readFileSync(envPath, "UTF-8");

console.log("Fetching environment...");
let env = process.env;
if (file) {
  const lines = file.split("\n").filter(Boolean);
  env = lines.reduce((acc, line) => {
    const separator = line.indexOf("=");
    const key = line.substr(0, separator);
    const value = line.substr(separator + 1, line.length - 1);

    return {
      ...acc,
      [key]: value
    };
  }, env);
}
console.log("Spawning expo...");

const expo = spawn("expo-cli", ["start"], {
  env,
  cwd: path.join("."),
  shell: true,
  stdio: "inherit"
});

expo.on("exit", function(code) {
  console.log("Expo process exited with code " + code.toString());
});
