var plan       = require('flightplan');
var project    = 'puppy';

// configuration
plan.target('development', {
  host: 'wilddogdevelopment.com',
  projectRoot: '/Users/webdog/www/' + project,
  username: 'deployer',
  agent: process.env.SSH_AUTH_SOCK,
  maxDeploys: 5
});

var versionDir = project + '-' + new Date().getTime();

// run commands on localhost
plan.local('deploy', function(local) {
  local.log('Run build');
  local.exec('grunt prod');

  local.log('Copy files to remote hosts');
  var filesToCopy = local.exec('find dist -name "*" -type f', {silent: true});
  // rsync files to all the target's remote hosts
  local.transfer(filesToCopy, '/tmp/' + versionDir);
});

// run commands on the target's remote hosts
plan.remote('deploy', function(remote) {
  remote.hostname();

  remote.log('Move version folder to project versions folder');
  remote.exec('mv /tmp/' + versionDir + '/dist ' + remote.runtime.projectRoot + '/versions/' + versionDir, {user: remote.runtime.username});
  remote.rm('-rf /tmp/' + versionDir);
  remote.log('Point to current version');
  remote.exec('rm -f ' + remote.runtime.projectRoot + '/current && ln -snf ' + remote.runtime.projectRoot + '/versions/' + versionDir + ' ' + remote.runtime.projectRoot + '/current');

  if (remote.runtime.maxDeploys > 0) {
    remote.log('Cleaning up old deploys...');
    remote.exec('rm -rf `ls -1dt ' + remote.runtime.projectRoot + '/versions/* | tail -n +' + (remote.runtime.maxDeploys+1) + '`');
  }

});

plan.remote('rollback', function(remote) {
  remote.hostname();

  remote.with('cd ' + remote.runtime.projectRoot, function() {
    var command = remote.exec('ls -1dt versions/* | head -n 2');
    var versions = command.stdout.trim().split('\n');

    if (versions.length < 2) {
      return remote.log('No version to rollback to');
    }

    var lastVersion = versions[0];
    var previousVersion = versions[1];

    remote.log('Rolling back from ' + lastVersion + ' to ' + previousVersion);

    remote.exec('ln -fsn ' + previousVersion + ' current');
    // remote.exec('chown -R ' + remote.runtime.ownerUser + ':' + remote.runtime.ownerUser + ' current');

    remote.exec('rm -rf ' + lastVersion);
  });
});