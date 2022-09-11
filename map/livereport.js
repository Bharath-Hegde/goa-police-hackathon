// const arr = require('./report.js');
var arr = [
    {
        coordinates: [1,2],
        ip:"123.123.123.123"
    },
    {
        coordinates: [1,2],
        ip:"123.123.123.123"
    },
    {
        coordinates: [1,2],
        ip:"123.123.123.123"
    },{
        coordinates: [1,2],
        ip:"123.123.123.123"
    },{
        coordinates: [1,2],
        ip:"123.123.123.123"
    },{
        coordinates: [1,2],
        ip:"123.123.123.123"
    },{
        coordinates: [1,2],
        ip:"123.123.123.123"
    },{
        coordinates: [1,2],
        ip:"123.123.123.123"
    },{
        coordinates: [1,2],
        ip:"123.123.123.123"
    },{
        coordinates: [1,2],
        ip:"123.123.123.123"
    },{
        coordinates: [1,2],
        ip:"123.123.123.123"
    },{
        coordinates: [1,2],
        ip:"123.123.123.123"
    },{
        coordinates: [1,2],
        ip:"123.123.123.123"
    },{
        coordinates: [1,2],
        ip:"123.123.123.123"
    }
]
const liveReports = document.getElementById('live-reports');

console.log("ping")
arr.forEach((element,index) => {
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');
    const div2_child1 = document.createElement('div');
    div1.id=index;
    div2_child1.innerHTML="Coordinates " + element.coordinates;
    div2.appendChild(div2_child1);

    const li2= document.createElement('div');
    li2.innerHTML= "IP Address "+element.ip
    div2.appendChild(li2);
    div1.appendChild(div2);
    div1.classList.add('live-report-child')
    
    liveReports.appendChild(div1);
});
