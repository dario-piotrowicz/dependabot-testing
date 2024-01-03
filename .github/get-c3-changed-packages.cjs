const { execSync } = require('child_process');

/**
 * Detects the names of the packages that changed in the packages/create-cloudflare/src/frameworks/package.json file
 *
 * @param {1|2} numberOfCommits The number of commits to diff in order to detect the correct changes
 * @returns {string[]} an array containing names of the packages that changed
 */
module.exports = function(numberOfCommits){
  const diff = execSync(
    `git diff HEAD~${numberOfCommits} packages/create-cloudflare/src/frameworks/package.json`
  ).toString();

  const changedPackages =
    diff
        .match(/-\s*".*?":\s".*?",?/g)
        .map((match) => match.match(/-\s*"(.*)":/)?.[1])
        .filter(Boolean);

  return changedPackages;
};