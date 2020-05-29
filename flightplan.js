const plan = require('flightplan');

const project = 'puppy';

// let user = "Someone";

const remoteRoot = '/var/www/';
const remoteHost = 'wilddogdevelopment.com';

// const args = {
//   critical: !(process.argv.indexOf("--no-critical-css") > -1),
//   minify: !(process.argv.indexOf("--no-minification") > -1),
// };

// configuration
plan.target('development', {
  host: remoteHost,
  projectRoot: `${remoteRoot}${project}`,
  username: 'deployer',
  agent: process.env.SSH_AUTH_SOCK,
  maxDeploys: 5,
  port: 2022,
});

const versionDir = `${new Date().getTime()}`;

// run commands on localhost
plan.local('deploy', (local) => {
  local.log('Run build');
  local.exec('npm run build');
  // user = local.exec("git config user.name");

  local.log('Copy files to remote hosts');
  const filesToCopy = local.exec('find dist -name "*" -type f', {
    silent: true,
  });
  // rsync files to all the target's remote hosts
  local.transfer(filesToCopy, `/tmp/${versionDir}`);
});

// run commands on the target's remote hosts
plan.remote('deploy', (remote) => {
  remote.hostname();

  remote.log('Move version folder to project releases folder');
  remote.exec(
    `mv /tmp/${versionDir}/dist ${remote.runtime.projectRoot}/releases/${versionDir}`,
    {
      user: remote.runtime.username,
    }
  );
  remote.rm(`-rf /tmp/${versionDir}`);
  remote.log('Point to current version');
  remote.exec(
    `rm -f ${remote.runtime.projectRoot}/current && ln -snf ${remote.runtime.projectRoot}/releases/${versionDir} ${remote.runtime.projectRoot}/current`
  );

  if (remote.runtime.maxDeploys > 0) {
    remote.log('Cleaning up old deploys...');
    remote.exec(
      `rm -rf \`ls -1dt ${remote.runtime.projectRoot}/releases/* | tail -n +${
        remote.runtime.maxDeploys + 1
      }\``
    );
  }
});

plan.remote('rollback', (remote) => {
  remote.hostname();

  remote.with(`cd ${remote.runtime.projectRoot}`, () => {
    const command = remote.exec('ls -1dt releases/* | head -n 2');
    const releases = command.stdout.trim().split('\n');

    if (releases.length < 2) {
      return remote.log('No version to rollback to');
    }

    const lastVersion = releases[0];
    const previousVersion = releases[1];

    remote.log(`Rolling back from ${lastVersion} to ${previousVersion}`);

    remote.exec(`ln -fsn ${previousVersion} current`);

    remote.exec(`rm -rf ${lastVersion}`);
  });
});
