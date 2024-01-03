module.exports = function(){
  const collectChangesPackagesChanges = require('.github/collect-c3-packages-changes.cjs');
  const changes = collectChangesPackagesChanges();

  if (changes.length === 0) {
    console.warn("No changes detected!");
    return null;
  } else if(changes.length > 1){
    console.warn("More then one package has changes, that's not currently supported");
    throw new Error('More than one change detected');
  } else {
    console.log(`====>>>>> ${changes[0].package}`);
    return changes[0].package;
  }
};