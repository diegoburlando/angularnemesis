import React, { Component } from 'react';
//import Rx from 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import styles from './maps.css';
import Footer from '../../FooterComponent/index';

class MapComponent extends Component {

constructor (props) {
  super(props);
  this.state = { noGeolocation : false };
  this.map ={};
  this.map_canvas = React.createRef();
}

componentDidMount() {
 this.drawLocation(3);
 }

componentWillMount() {
    window.scrollTo(0, 0);
  }

drawLocation = (zoomRatio) => {
    if("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position)=> {
        let latlng = new window.google.maps.LatLng(position.coords.latitude,position.coords.longitude);
        let myOptions = {
          zoom: zoomRatio,
          center: latlng,
          mapTypeId: window.google.maps.MapTypeId.TERRAIN,
          disableDefaultUI: true
        }
        this.map = new window.google.maps.Map(this.map_canvas.current, myOptions);
      });
    } else { this.setState( {noGeolocation:true}); } 
    
}


zoom = (event) =>{ this.drawLocation(parseInt(event.target.value,10)); }

	render() { 

	if(this.state.noGeolocation)  return (<div className ={styles.mapcontainer}><p>Argh!! no Geolocation</p></div>);		
	return (
	<div className ={styles.mapcontainer}>		
		<input onChange = {this.zoom}  type="range" min="3" max="30" defaultValue ="3" className="slider" ref="zoomRange"/>
    	<div ref = {this.map_canvas} className = {styles.map_canvas} >test</div>
    	<Footer/>
	</div>
	)}


}
export default MapComponent;



//*********************************************************************************
// const flowers:any = Observable.fromPromise(fetch('https://apimicrobach.azurewebsites.net/flowers').then(response => response.json()))
// .subscribe(
//    (flowers:any[]) => {
//    const items = Observable.interval(1000).take(flowers.length)
//    .subscribe((x) => {console.log('___________',x);
//       fetch('https://apimicrobach.azurewebsites.net/flower/?flowerName='+ encodeURIComponent(flowers[x].Name))
//      .then(response => {return response.json()}).then(json => {console.log(json);});})      
//     },
//      (err) => {console.log('Error: ' + err);},
//      () => { console.log('Completed'); });
//*********************************************************************************


  
//     function drawLocation(zoomMagn){    
//     if("geolocation" in navigator) {
//       navigator.geolocation.getCurrentPosition((position)=> {
//         var latlng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
//         var myOptions = {
//           zoom: zoomMagn,
//           center: latlng,
//           mapTypeId: google.maps.MapTypeId.SATELLITE,
//           disableDefaultUI: true
//         }
//         var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
//       });
//     } else {
//       var para = document.createElement('p');
//       para.textContent = 'Argh, no geolocation!';
//       document.body.appendChild(para);
//     }}
    
// drawLocation(5);   

//var slider = document.getElementById("myRange");
//slider.oninput = function() {drawLocation(parseInt(this.value));}


