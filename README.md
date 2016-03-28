:dog: Wilddog Design Starting Web-Scaffold :+1:
===============================================

Installing
----------
The software used in this project includes Node.js, Gulp, Jspm and Bower.
We recommend the use of Homebrew to install all the dependencies.
```
cd path/to/project
npm run setup
```

Process
-------
- The building process employs script and styles minification, as well as critical CSS inclusion. To switch off these procedures pass `--no-minification` and `--no-critical-css` to the script when building.
- Critical CSS generation depends on [Jacket](https://github.com/at-import/jacket) plugin.

Developing
----------
To run the development server, use:
```
cd path/to/project
npm run start
```
This will create a development build in `dist` folder, run the server on `127.0.0.1:8888` and
open a new browser window with the BrowserSync script included.

Building
--------
To build the live templates, use:
```
cd path/to/project
npm run build [-- [--no-minification] [--no-critical-css]]
```
The output will be located in `dist` folder

Updating
--------
Before building a new version of the project, don't forget to update the dependencies.
```
cd path/to/project
npm run uptodate
```

Styleguides
-----------
The living style guide is employed in the project. Refer to [Styledown](https://github.com/styledown/styledown)
documentation for more information.
To generate the styleguide, use:
```
cd path/to/project
npm run styleguide
```
The generated styleguide will be available at `dist/styleguide`

Deploying (optional)
--------------------
The project employs Flightplan.js to perform versioned deployments. To build and deploy to a development derver,
first install Flightplan by running
```
npm install -g flightplan
```
Then, amend flightplan.js file with correct remote server information (your public key has to be added to the remote
user's shell for you to authorize the transfer *and* your personal key should be added to ssh-agent locally), and then run
```
npm run deploy [-- [--no-minification] [--no-critical-css]]
```
Keep in mind, that the script is not using sudo, so the deployer user has to have full permissions to the project and versions folders.

Brought to you by
-----------------

```
ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
ZZZZZZZZZZZZZZZZZZZZZ WILD DOG DESIGN ZZZZZZZZZZZZZZZZZZZZZZ
ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ~ ...ZZZZZZZZZZ
ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ... ....ZZZZZZZZZ
ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ. ..   ....+ZZZZZZZ
ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZI.           .. ZZZZZZ
ZZZZZZZZZZZZZZZZZZZZZZ$+,.~IZZZZZZZZ?....       ... .ZZZZZZZ
ZZZZZZZZZZZZZZZZZZ$... ...     .... ..          .. .?ZZZZZZZ
ZZZZZZZZZZZZZZZZZ...                            .ZZZZZZZZZZZ
ZZZZZZZZZZZZZZZZ....                            ~ZZZZZZZZZZZ
ZZZZZZZZZZZZZZZI.                             ..ZZZZZZZZZZZZ
ZZZZZZZZZZ$+:....                            ...ZZZZZZZZZZZZ
ZZZZZZZZ....  ...        .... .              ..,ZZZZZZZZZZZZ
ZZZZZ=...... ...        .......              ..ZZZZZZZZZZZZZ
ZZZZ......?:$ZZZ        ..,~...              ?ZZZZZZZZZZZZZZ
ZZZZZZZZZZZZZZZZ.   . ..ZZZZZZZZ7.. ..   ...ZZZZZZZZZZZZZZZZ
ZZZZZZZZZZZZZZZ..   ...ZZZZZZZZZZZZ7..   ..ZZZZZZZZZZZZZZZZZ
ZZZZZZZZZZZZZZ+. ...~$ZZZZZZZZZZZZZZ..   ..ZZZZZZZZZZZZZZZZZ
ZZZZZZZZZZZZZZZ... ZZZZZZZZZZZZZZZZZ .   . ZZZZZZZZZZZZZZZZZ
ZZZZZZZZZZZZZZ....ZZZZZZZZZZZZZZZZZZ7 .....ZZZZZZZZZZZZZZZZZ
ZZZZZZZZZZZZZ+. ...ZZZZZZZZZZZZZZZZZZZ+.....,ZZZZZZZZZZZZZZZ
ZZZZZZZZZZZZZZZ=+IZZZZZZZZZZZZZZZZZZZZZZ?:~+$ZZZZZZZZZZZZZZZ
ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
```