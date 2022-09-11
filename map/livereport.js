var arr=[];
// setInterval(async () => {
//     await fetch('http://localhost:4000/map').then(response => response.json()).then((data) => arr = data);
//     createList(arr);
// }, 500)

function createList(arr) {
    arr?.forEach((element, index) => {
        const div1 = document.createElement('div');
        const div2 = document.createElement('div');
        const div2_child1 = document.createElement('div');
        div1.id = index;
        div2_child1.innerHTML = "Coordinates " + element.coordinates;
        div2.appendChild(div2_child1);

        const li2 = document.createElement('div');
        li2.innerHTML = "IP Address " + element.ip
        div2.appendChild(li2);
        div1.appendChild(div2);
        div1.classList.add('live-report-child')

        liveReports.appendChild(div1);
    });

}
