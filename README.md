# node-hikvision-omxplayer

Simple app to listen hikvision alerts and to launch omxplayer when motion detected on Raspberry Pi

`git clone https://github.com/teemuhirsikangas/node-hikvision-omxplayer.git`

Nodejs needs to be version 8 (Does not work with 10 or newer or, haven't had the time to upgrade and refactor)

`sudo curl -sL https://deb.nodesource.com/setup_8.x | bash -`
`node -v`
v8.17.0

`cd node-hikvision-omxplayer/`

`npm install`

`sudo npm install -g pm2`

edit the config file: `nano config.js`

start:
`pm2 start index.js`

if you want it to autostart on next reboot:
`pm2 save`
