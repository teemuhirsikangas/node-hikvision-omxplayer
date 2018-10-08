const express = require('express');
const app = express();
const config = require('./config.js');

let ipcamera = require('node-hikvision-api');
let hikvision = new ipcamera.hikvision(config.hikvision.options);
let Omx = require('node-omxplayer');
let player = Omx();

const {user, pass, host} = config.hikvision.options;
let motionStatus = false;
let lineCrossStatus = false;

function stopPlayer() {

    if(player.running && motionStatus === false && lineCrossStatus === false) {
        player.quit();
    }
}

// Monitor Camera Alarms
hikvision.on('alarm', function(code,action,index) {

	if (code === 'VideoMotion' && action === 'Start') {
        console.log(' Channel ' + index + ': Video Motion Detected')
        motionStatus = true;
        if (!player.running) {
            const stream = `rtsp://${user}:${pass}@${host}:554/Streaming/Channels/102`;
            player.newSource(stream);
        }
    }

    if (code === 'VideoMotion'   && action === 'Stop') {
        console.log(' Channel ' + index + ': Video Motion Ended');
        motionStatus = false;
        //close video stream after x secs if no movement
        setTimeout(stopPlayer, config.hikvision.stopAfter * 1000);

    }

	if (config.hikvision.triggers.line && code === 'LineDetection' && action === 'Start') {
        console.log(' Channel ' + index + ': Line Cross Detected');
        lineCrossStatus = true;
        if (!player.running) {
            const stream = `rtsp://${user}:${pass}@${host}:554/Streaming/Channels/102`;
            player.newSource(stream);
        }
    }
	if (config.hikvision.triggers.line && code === 'LineDetection' && action === 'Stop') {
        console.log(' Channel ' + index + ': Line Cross Ended');
        lineCrossStatus = false;
        setTimeout(stopPlayer, config.hikvision.stopAfter * 1000);

    }

	if (code === 'AlarmLocal'    && action === 'Start')  console.log(' Channel ' + index + ': Local Alarm Triggered: ' + index)
	if (code === 'AlarmLocal'    && action === 'Stop')   console.log(' Channel ' + index + ': Local Alarm Ended: ' + index)
	if (code === 'VideoLoss'     && action === 'Start')  console.log(' Channel ' + index + ': Video Lost!')
	if (code === 'VideoLoss'     && action === 'Stop')   console.log(' Channel ' + index + ': Video Found!')
	if (code === 'VideoBlind'    && action === 'Start')  console.log(' Channel ' + index + ': Video Blind!')
	if (code === 'VideoBlind'    && action === 'Stop')   console.log(' Channel ' + index + ': Video Unblind!')
});

app.get('/', (req, res) => res.send('NOP'));

app.get('/health', (req, res) => res.send('OK'));

app.listen(3334, () => console.log('app started on port 3334!'));

process.on( 'SIGTERM', function () {
    console.log( "closing omxplayer");
    if (player.running) {
        player.quit(); 
    }
 });

 process.on( 'SIGINT', function () {
    console.log( "closing omxplayer because SIGINT");
    if (player.running) {
        player.quit(); 
    }
    process.exit();
 });

 process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', reason.stack || reason);
  })