const { execSync } = require('child_process');

module.exports = function(){
  const diff = execSync(
    "git diff HEAD~1 packages/create-cloudflare/src/frameworks/package.json"
  ).toString();

  const changedPackages =
    diff
      .match(/-\s*".*?":\s".*?",?/g)
      ?.map((match) => match.match(/-\s*"(.*)":/)?.[1])
      .filter(Boolean) ?? [];

  console.log('\nDIFF ===================\n\n');

  console.log(diff);

  console.log('\nFFID ===================\n\n');

  const changes = changedPackages.map((pkg) => {
    const getPackageChangeRegex = (addition) =>
      new RegExp(`${addition ? "\\+" : "-"}\\s*"${pkg}":\\s"(.*)",?`);

    const from = diff.match(getPackageChangeRegex(false))?.[1];
    const to = diff.match(getPackageChangeRegex(true))?.[1];

    if (!from || !to) {
      throw new Error(
        `Unexpected changes for package ${pkg} (could not determine upgrade)`
      );
    }

    return {
      package: pkg,
      from,
      to,
    };
  });

  if (changes.length === 0) {
    console.warn("No changes detected!");
    return null;
  } else if(changes.length > 1){
    console.warn("More then one package has changes, that's not currently supported");
    throw new Error('More than one change detected');
  } else {
    console.log(`%%%%%%+++++++>>>>> ${changes[0].package}`);
    return changes[0].package;
  }
};