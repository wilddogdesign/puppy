Wilddog Design Starting Web-Scaffold
====================================

Installing
----------
The software used in this project includes Node.js, Grunt and Bower.
We recommend the use of Homebrew to install all the dependencies (including Ruby, if needed).
For the sake of convenience when using Ruby, RVM might also be useful.
```
cd path/to/project
npm install
bower install
```

Developing
----------
To run the development server, use:
```
cd path/to/project
grunt dev && grunt server
```
This will create a development build in `dist` folder, run the server on 127.0.0.1:8888 and
open a new browser window with the livereload script included.

Building
--------
To build the live templates, use:
```
cd path/to/project
grunt prod
```
The output will be located in `dist` folder

Updating
--------
Before building a new version of the project, don't forget to update the grunt and bower
dependencies.
```
cd path/to/project
npm update && npm prune
bower update && bower prune
```

Styleguides
-----------
The living style guide is employed in the project. Refer to [Styledown](https://github.com/styledown/styledown)
documentation for more information.
To generate the styleguide, use:
```
cd path/to/project
grunt styleguide
```
The generated styleguide will be available at `dist/styleguide`

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