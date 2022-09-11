const express = require('express')
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 4000;
var item=[];
var cors = require('cors');
app.use(cors({
    origin: '*'
}));


var di = {'coords':item,'opcodes':item.slice(),'ips':item.slice(),'fnames':item.slice(),'groups':item.slice(),'fingroups':item.slice(),'timestamps':item.slice()};
fs.writeFileSync('./data.json',JSON.stringify(di));
var obj = JSON.parse(fs.readFileSync('./data.json'));
console.log(obj);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.post('/report', (req, res) => {
    console.log(req.body);
    di['coords'].push(req.body['coord']);
    di['opcodes'].push(req.body['opcode']);
    di['ips'].push(req.body['ip']);
    di['fnames'].push(req.body['fname']);
    di['timestamps'].push(new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''));
    var mi=Infinity,mii;
    var tmp=req.body['opcode'].split(',');
    for(var i=0;i<di['groups'].length;i++){
        var cu=0;
        for(var j=0;j<di['groups'][i].length;j++){
            var cucu=0;
            var yo=di['opcodes'][di['groups'][i][j]].split(',');
            for(var k=0;k<tmp.length;k++){
                let x=Number(yo[k]);
                cucu+=(Number(tmp[k])-x)*(Number(tmp[k])-x);
            }
            cu+=Math.sqrt(cucu);
        }
        cu=cu/di['groups'][i].length;
        if(cu<mi){
            mi=cu;
            mii=i;
        }
    }
    if(di['groups'].length==0){
        di['groups']=[[di['opcodes'].length-1]];
        mii=0;
    }
    else{
        di['groups'][mii].push(di['opcodes'].length-1);
    }
    di['fingroups'].push(mii);
    res.sendStatus(200);
});


app.get('/map', (req, res) => {
    var di2={};
    di2['coords']=di['coords'];
    di2['ips']=di['ips'];
    di2['fnames']=di['fnames'];
    di2['fingroups']=di['fingroups'];
    res.send(JSON.stringify(di2));
});

app.listen(port, () => console.log(`App listening on port ${port}!`));