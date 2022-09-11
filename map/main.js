import {useGeographic} from 'ol/proj';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
// import View from 'ol/View';
import Point from 'ol/geom/Point';
import TileJSON from 'ol/source/TileJSON';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import {Icon, Style} from 'ol/style';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import OSM from 'ol/source/OSM';
// import arr from './report.js';
// const arr = require('./report.js');






let coordinateArrays = [] 
let iconFeatures = []

useGeographic();

const iconStyle = new Style({
  image: new Icon({
    anchor: [0.5, 1200],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    src: 'marker.png',
    scale: 0.03,
  }),
});

coordinateArrays.forEach(function(item,index){
  let temp = new Feature({
    geometry: new Point(item),
    num: index,
    name: 'metadata',
  })
  temp.setStyle(iconStyle);
  iconFeatures.push(temp);
});

const vectorSource = new VectorSource({
  features: iconFeatures,
});

const vectorLayer = new VectorLayer({
  source: vectorSource,
});

const rasterLayer = new TileLayer({
        source: new OSM()
      })

const map = new Map({
  layers: [rasterLayer, vectorLayer],
  target: document.getElementById('map'),
  view: new View({
    center: [73.98018005767172, 15.42284259356],
    zoom: 10,
  }),
});

const element = document.getElementById('popup');

const popup = new Overlay({
  element: element,
  positioning: 'bottom-center',
  stopEvent: false,
});
map.addOverlay(popup);

let popover;
function disposePopover() {
  if (popover) {
    popover.dispose();
    popover = undefined;
  }
}

var lastClicked = "-1";
map.on('click', function (evt) {
  const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });
  document.getElementById(lastClicked)?.classList.remove('highlight');
  if (feature) {
    
    lastClicked = feature.get('num');
    document.getElementById(lastClicked)?.classList.add('highlight');
    return;
  }
});

var flag = 0;
map.on('pointermove', function (e) {

  // change mouse cursor when over marker
  const pixel = map.getEventPixel(e.originalEvent);
  const hit = map.hasFeatureAtPixel(pixel);
  map.getTarget().style.cursor = hit ? 'pointer' : '';

  const feature = map.forEachFeatureAtPixel(e.pixel, function (feature) {
    return feature;
  });
  
  if(!feature){
    flag = 0;
    disposePopover();
  }
  if (feature){
    if(!flag ){
      flag = 1;
    // console.log(feature.get('geometry'));
    var zoom = map.getView().getZoom();
    // var arr1 = feature.get('geometry').flatCoordinates[1]+(1/zoom)*1200*iconStyle.getImage().getScale();
    var arr1 = feature.get('geometry').flatCoordinates[1]+0.05;
    var arr0 = feature.get('geometry').flatCoordinates[0];
    console.log([arr0,arr1]);
    console.log(e.coordinate);
    popup.setPosition([arr0,arr1]);
    popover = new bootstrap.Popover(element, {
      placement: 'top',
      html: true,
      content: feature.get('name'),
    });
    popover.show();}
  }
});
const liveReports = document.getElementById('live-reports');

async function myFunction(){
  // var coordinateArrays;
  const response = await fetch('http://127.0.0.1:4000/map/');
  const jobj = await response.json();
  coordinateArrays = jobj['coords'];
  console.log(coordinateArrays);
  console.log(jobj);
  var iconFeatures=[];
  while (liveReports.firstChild) {
    liveReports.removeChild(liveReports.lastChild);
  }
  coordinateArrays.forEach(function(item,index){
    let temp = new Feature({
      geometry: new Point(item),
      num: index,
      name: "Sim Index "+jobj['fingroups'][index].toString(),
    })
    temp.setStyle(iconStyle);
    iconFeatures.push(temp);


    
  });
  const listReq=[];
  for (let i = 0; i < coordinateArrays.length; i++) {
    listReq.push({
      coord: jobj.coords[i],
      ip: jobj.ips[i],
      fname: jobj.fnames[i],
      similarityIndex:jobj.fingroups[i]
    })
    
  }
  listReq.forEach((element,index) => {
    const div1 = document.createElement('div');
        const div2 = document.createElement('div');
        const div2_child1 = document.createElement('div');
        div1.id = index;
        div2_child1.innerHTML = "Coordinates: " + element.coord;
        div2.appendChild(div2_child1);

        const li2 = document.createElement('div');
        li2.innerHTML = "IP Address: " + element.ip
        div2.appendChild(li2);
        const li3 = document.createElement('div');
        li3.innerHTML = "File Name: " + element.fname
        div2.appendChild(li3);
        const li4 = document.createElement('div');
        li4.innerHTML = "Similarity Index: " + element.similarityIndex
        div2.appendChild(li4);
        div1.appendChild(div2);
        div1.classList.add('live-report-child')
        
        liveReports.appendChild(div1);

        // div1.onclick = function(){
        //   View.setCenter(element.coord);
        //   console.log(element.coord);
        // }
  }
  )
  document.getElementById('malwareNumber').innerHTML=coordinateArrays.length;
  console.log(iconFeatures);    
  const vectorSource = new VectorSource({
    features: iconFeatures,
  });
  map.removeLayer(map.getLayers().getArray()[1]);
  const vectorLayer = new VectorLayer({
    source: vectorSource,
  });
  map.addLayer(vectorLayer);
}
var intervalId = setInterval(myFunction, 5000);


