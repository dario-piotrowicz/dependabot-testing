const getChangedPackages = require('./get-c3-changed-packages.cjs');

module.exports = function(){
  const changedPackages = getChangedPackages(2);

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