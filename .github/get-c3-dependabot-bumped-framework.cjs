module.exports = function(prDescription){
    const json = require('../packages/create-cloudflare/src/frameworks/package.json')

    const frameworkCliPackages = Object.values(json.frameworkCliMap);

    const semverRegexStr = '\\d+\\.\\d+\\.\\d+';

    const frameworkCliRegex = new RegExp(
      `(?:^|\\s+)Bumps\\s+\\[(${frameworkCliPackages.join(
        '|'
      )})\\]\\(.*?\\)\\s+from\\s+${semverRegexStr}\\s+to\\s+${semverRegexStr}`
    );

    const bumpedFrameworkCli = prDescription.match(frameworkCliRegex)?.[1];
    return bumpedFrameworkCli;
};