const { execSync } = require('child_process');

module.exports = function() {
    const diff = execSync(
        `git diff HEAD~1 packages/create-cloudflare/src/frameworks/package.json`
      ).toString();

      const changedPackages =
        diff
            .match(/-\s*".*?":\s".*?",?/g)
            ?.map((match) => match.match(/-\s*"(.*)":/)?.[1])
            .filter(Boolean) ?? [];
      
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

      return changes;
}