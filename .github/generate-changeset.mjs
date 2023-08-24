// const { promises: fs } = require("fs");
//             // Parses package.json files and returns the package names
//             async function getPackagesNames(files) {
//               const names = [];
//               for (const file of files) {
//                 const data = JSON.parse(await fs.readFile(file, "utf8"));
//                 if (!data.private) {
//                   names.push(data.name);
//                 }
//               }
//               return names;
//             }

//             async function createChangeset(fileName, packageBumps, packages) {
//               let message = "";
//               for (const [pkg, bump] of packageBumps) {
//                 message = message + `Updated dependency \`${pkg}\` to \`${bump}\`.\n`;
//               }

//               const pkgs = packages.map((pkg) => `'${pkg}': patch`).join("\n");
//               const body = `---\n${pkgs}\n---\n\n${message.trim()}\n`;
//               await fs.writeFile(fileName, body);
//             }

//             async function getBumps(files) {
//               const bumps = new Map();
//               for (const file of files) {
//                 const { stdout: changes } = await exec.getExecOutput("git", [
//                   "show",
//                   file,
//                 ]);
//                 for (const change of changes.split("\n")) {
//                   if (!change.startsWith("+ ")) {
//                     continue;
//                   }
//                   const match = change.match(/"(.*?)"/g);
//                   bumps.set(match[0].replace(/"/g, ""), match[1].replace(/"/g, ""));
//                 }
//               }
//               return bumps;
//             }

//             const branch = await exec.getExecOutput("git branch --show-current");
//             if (!branch.stdout.startsWith("renovate/")) {
//               console.log("Not a renovate branch, skipping");
//               return;
//             }
//             const diffOutput = await exec.getExecOutput("git diff --name-only HEAD~1");
//             const diffFiles = diffOutput.stdout.split("\n");
//             if (diffFiles.find((f) => f.startsWith(".changeset"))) {
//               console.log("Changeset already exists, skipping");
//               return;
//             }
//             const files = diffFiles
//               .filter((file) => file !== "package.json") // skip root package.json
//               .filter((file) => file.includes("package.json"));
//             const packageNames = await getPackagesNames(files);
//             if (!packageNames.length) {
//               console.log("No package.json changes to published packages, skipping");
//               return;
//             }
//             const { stdout: shortHash } = await exec.getExecOutput(
//               "git rev-parse --short HEAD"
//             );
//             const fileName = `.changeset/renovate-${shortHash.trim()}.md`;

//             const packageBumps = await getBumps(files);
//             await createChangeset(fileName, packageBumps, packageNames);
//             await exec.exec("git", ["add", fileName]);
//             await exec.exec("git commit -C HEAD --amend --no-edit");
//             await exec.exec("git push --force");



import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

// var {spawn, exec} = require('child_process');

    // 'node' is an executable command (can be executed without a shell) 
    // uses streams to transfer data (spawn.stout)  
// var spawn = spawn('node', ['module.js']);     
// spawn.stdout.on('data', function(msg){         
//     console.log(msg.toString())
// });

    // the 'node module.js' runs in the spawned shell 
    // transfered data is handled in the callback function 
// var exec = execSync('node module.js', function(err, stdout, stderr){
//     console.log(stdout);
// });

const branchName = process.argv[2];


writeFileSync(`.changeset/changeset-${Math.round(Math.random() * 100000)}.md`,
`---
"dependabot-testing": patch
---

this is a test (${branchName})
`);

execSync("git add .changeset");
execSync("git commit -m 'this is a test'");
execSync("git push");
// execSync("git commit -C HEAD --amend --no-edit");
// execSync("git push --force");

