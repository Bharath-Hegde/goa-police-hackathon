// var fs = require('fs');
// var obj = JSON.parse(fs.readFileSync('./train.json'));

// var trainingSet=obj['x'];
// var predictions=obj['y'];

// var spawn = require("child_process").spawn;
// var fs = require('fs');
// const { exec } = require('child_process');
// var request = require('request');
import { publicIp, publicIpv4, publicIpv6 } from 'public-ip';
import { spawn } from "child_process";
import fs from "fs";
import request from 'request';
import { exec } from "child_process";
import readline from "readline";

var process = spawn('python', ["./RF.py"]);
var obj = JSON.parse(fs.readFileSync('./lab.json'));
var lab = obj['col'];
var arr;

function getPred(path) {
    exec("objdump -D " + path + " | cut -c33- > raw.txt", (error, stdout, stderr) => {
        if (error) {
            console.error(`error: ${error.message}`);
            return;
        }

        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }


        var lineReader = readline.createInterface({
            input: fs.createReadStream('raw.txt')
        });
        var l = [];
        var i = 0;
        lineReader.on('line', function (line) {
            var y = line.split(" ");
            var yo = y.length - 2;
            while (y[yo] == '') {
                yo--;
            }
            l.push(y[yo]);
            i++;
        });
        lineReader.on('close', function () {
            var di = { "mov": 0 };
            for (var c of l) {
                if (c in di) {
                    di[c]++;
                }
                else {
                    di[c] = 1;
                }
            }
            arr = Array(lab.length);
            for (var c = 0; c < lab.length; c++) {
                if (lab[c] in di) {
                    arr[c] = di[lab[c]];
                }
                else {
                    arr[c] = 0;
                }
            }

            var s = "";
            for (const x of arr) {
                s = s + x.toString() + ',';
            }
            s = s.substring(0, s.length - 1);
            s = s + "\n";
            process.stdin.write(s);

        });

    });
}


process.stdout.on('data', (data) => {
    console.log(Number(data));
    if (Number(data) < 0.5) {
        myip();
    }
});

// request({
//     uri: 'https://ip-geolocation-ipwhois-io.p.rapidapi.com/json/',
//     headers: {
//       'X-RapidAPI-Key': '23ca8e1712msh28fcb611dc36f6dp13d166jsn8922d6950104',
//       'X-RapidAPI-Host': 'ip-geolocation-ipwhois-io.p.rapidapi.com'
//     },
//     method: 'GET'
//   }, function (err, res, body) {
//     console.log(JSON.parse(res.body)['ip']);
//     console.log(JSON.parse(res.body)['latitude']);
//     console.log(JSON.parse(res.body)['longitude']);
//   });

async function myip() {
    publicIpv4().then((ip) => {
        request({ uri: "http://ipwho.is/" + ip, method: 'GET' }, function (err, res, body) {
            var ip=JSON.parse(res.body)['ip']; var lat= JSON.parse(res.body)['latitude']; var lon=JSON.parse(res.body)['longitude'];
            console.log("Sending");
            request.post(
                'http://127.0.0.1:4000/report',
                { json: { 'coord': [lon,lat] ,'ip': ip} },
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log(response.body);
                    }
                }
            );
        })
    });
}

getPred("../exe/sh2.exe");


