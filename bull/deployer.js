const sleep = (time) => new Promise(resolve => setTimeout(resolve, time));

module.exports = function(job) {
  return sleep(2000)
    .then(() => `[DEPLOYER] finished job ${job.data.app.name} version ${job.data.app.version}`);
}