const express = require('express');
const app = express();
const config = require('./config.js');

var ipcamera = require('node-hikvision-api');
var hikvision = new ipcamera.hikvision(config.hikvision.options);
var player = Omx();

const {pass, user, host} = config.hikvision;

// Monitor Camera Alarms
hikvision.on('alarm', function(code,action,index) {

	if (code === 'VideoMotion' && action === 'Start') {
        console.log(' Channel ' + index + ': Video Motion Detected')
        if (!player.running) {
            const stream = `rtsp://${user}:${pass}@${host}:554/Streaming/Channels/102`;
            player.newSource(stream);
        }
    }

    if (code === 'VideoMotion'   && action === 'Stop') {
        console.log(' Channel ' + index + ': Video Motion Ended');
        player.quit();

    }
	if (code === 'VideoMotion'   && action === 'Start')  console.log(' Channel ' + index + ': Video Motion Detected')
	if (code === 'VideoMotion'   && action === 'Stop')   console.log(' Channel ' + index + ': Video Motion Ended')
	if (code === 'LineDetection' && action === 'Start')  console.log(' Channel ' + index + ': Line Cross Detected')
	if (code === 'LineDetection' && action === 'Stop')   console.log(' Channel ' + index + ': Line Cross Ended')
	if (code === 'AlarmLocal'    && action === 'Start')  console.log(' Channel ' + index + ': Local Alarm Triggered: ' + index)
	if (code === 'AlarmLocal'    && action === 'Stop')   console.log(' Channel ' + index + ': Local Alarm Ended: ' + index)
	if (code === 'VideoLoss'     && action === 'Start')  console.log(' Channel ' + index + ': Video Lost!')
	if (code === 'VideoLoss'     && action === 'Stop')   console.log(' Channel ' + index + ': Video Found!')
	if (code === 'VideoBlind'    && action === 'Start')  console.log(' Channel ' + index + ': Video Blind!')
	if (code === 'VideoBlind'    && action === 'Stop')   console.log(' Channel ' + index + ': Video Unblind!')
});

app.get('/', (req, res) => res.send('NOP'))

app.listen(3334, () => console.log('app started on port 3334!'))