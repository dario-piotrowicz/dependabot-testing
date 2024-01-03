const { execSync } = require('child_process');

module.exports = function(){
  const diff = execSync(
    `git diff HEAD~2 packages/create-cloudflare/src/frameworks/package.json`
  ).toString();

  const changedPackages =
    diff
        .match(/-\s*".*?":\s".*?",?/g)
        .map((match) => match.match(/-\s*"(.*)":/)?.[1])
        .filter(Boolean);

  if (changedPackages.length === 0) {
    console.warn("No changes detected!");
    return null;
  } else if(changedPackages.length > 1){
    console.warn("More then one package has changed, that's not currently supported");
    throw new Error('More than one change detected');
  } else {
    return changedPackages[0];
  }
};