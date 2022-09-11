const { app, BrowserWindow, ipcMain, dialog } = require('electron');
// const fs = require('fs');
const { channels } = require('../src/shared/constants');
// const {getPred} = require('../src/Model/script.js');



var spawn = require("child_process").spawn;
var fs = require('fs');
const { exec } = require('child_process');
var request = require('request');
var readline = require('readline');
const publicIp = require('public-ip');
// import { publicIpv4} from 'public-ip';
// import { spawn } from "child_process";
// import fs from "fs";
// import request from 'request';
// import { exec } from "child_process";
// import readline from "readline";
var process = spawn('python', ["/Users/bharath/programming/polici/hack/client_side/src/RF.py"]);
var obj = JSON.parse(fs.readFileSync('/Users/bharath/programming/polici/hack/client_side/src/lab.json'));
var lab = obj['col'];
var arr;


var q=[];
async function getPred(path) {
    await exec("objdump -D " + path + " | cut -c33- > ./src/raw.txt", (error, stdout, stderr) => {
        if (error) {
            console.error(`error: ${error.message}`);
            return;
        }

        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }

    });
    var lineReader = readline.createInterface({
        input: fs.createReadStream('./src/raw.txt')
    });
    var l = [];
    var i = 0;
    lineReader.on('line', function (line) {
        var y = line.split(" ");
        var yo = y.length - 2;
        while (y[yo] === '') {
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
        process.stdin.write(s+q.length.toString()+"\n");
        q.push([s.substring(0,s.length-1),path]);
    });
}


process.stdout.on('data', (data) => {
    var da=data.toString().split(',');
    da[1]=Number(da[1].substring(0,da[1].length-1));
    da[0]=Number(da[0]);
    if (da[1] < 0.5) {
        op=q[da[1]][0];
        fn=q[da[1]][1];
        console.log(fn);
        getIP(op,fn);
    }
});

function ipp(ip){
    return new Promise((resolve,reject)=>{
        request({ uri: "http://ipwho.is/" + ip, method: 'GET' }, function (err, res, body) {
            var ip=JSON.parse(res.body)['ip']; var lat= JSON.parse(res.body)['latitude']; var lon=JSON.parse(res.body)['longitude'];
            resolve(res.body);
        });
    });
}

async function getIP(op,fn) {
    var ip=await publicIp.v6();
    const lol=await ipp(ip);
    var lat= JSON.parse(lol)['latitude']; var lon=JSON.parse(lol)['longitude'];
    var x={ 'coord': [lon,lat] ,'ip': ip,'opcode':op,'fname':fn.replace(/^.*[\\\/]/, '')};
    request.post(
        'http://127.0.0.1:4000/report',
        { json: x },
        function (error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log(response.body);
            }
        }
    );
}




// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        fullscreenable:false,
        fullscreen: false,
        maximizable: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
          }
    });

    // and load the index.html of the app.
    mainWindow.loadURL('http://localhost:3000');

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
}); 

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on(channels.GET_PATH, (event, arg) => {


        
        //    dialog.showOpenDialog({
        //        properties: ['openFile']
        //    }, function (files) {
        //         console.log(files);
        //       if (files) event.sender.send('selected-file', files[0]);
        //    });
           dialog.showOpenDialog(mainWindow,{
            properties: ['openFile']
          }).then(result => {
            getPred(result.filePaths[0]);
            event.sender.send(channels.GET_PATH_REPLY, result.filePaths[0]);
          }).catch(err => {
            console.log(err)
          })
           
       
  
});
ipcMain.on(channels.GET_POPUP,(event,arg) => {
    dialog.showMessageBox({
        // option Object
        type: 'warning',
        buttons: ['Delete', 'Keep it'], noLink: true, defaultId: 0,
        icon: '',
        title: 'Alert',
        message: 'This file has x% chances of being malicious. What would you like to do with it?',
        detail: '',
        cancelId: 0,
        normalizeAccessKeys: false,
    }).then(box => {
        if(box.response===0){
            const {filePath} = arg;
            console.log(filePath);
            
                // fs.unlink(filePath, (err) => {
                //     if (err) {
                //         alert("An error ocurred updating the file" + err.message);
                //         console.log(err);
                //         return;
                //     }
                //     console.log("File succesfully deleted");
                // });
            

        }
        else if(box.response===1){
            console.log('Keep the file');
        }
        event.sender.send(channels.GET_POPUP_REPLY,box.response);
    }).catch(err => {
        console.log(err)
    }); 
})
