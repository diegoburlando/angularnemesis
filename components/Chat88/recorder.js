import "./analyzer.css";
import React, { Component } from "react";

class Recorder extends Component {

	constructor (props) {
		super(props);
		this.blob = null;  
		this.chunks = [];
		this.constraints = { audio: true };
		this.noCap = false;
		this.mediaRecorder = null;
		this.mediaErrormessage = "";
		this.audioCtx = null;
		this.analyser = null;
		this.bufferLength =null;
		this.dataArray = null;
		this.source = null;
		this.requestId =null;
		this.active = true;
		if (!navigator.mediaDevices.getUserMedia) 
		{
			this.mediaErrormessage ="This Browser doesn't support Media Recording";
			this.noCap=true;
		}
		else
		{
			navigator.mediaDevices.getUserMedia(this.constraints)
				.then(this.onSuccess, this.onError);
			try {
				window.AudioContext = ( window.AudioContext || window.webkitAudioContext );
				this.audioCtx = new AudioContext();   
			}
			catch(e) { alert("Web Audio API is not supported in this browser");}    
		}
	}

	componentDidMount () {
  this.canvasCtx = this.refs.analyzer.getContext("2d");
}

componentWillUnmount(){
  //cancelAnimationFrame(this.requestID); (this doesn't work)
  this.active = false; //this works
}

onSuccess = (stream) => {
 this.mediaRecorder = new MediaRecorder(stream);
 this.visualize(stream);
 this.mediaRecorder.onstop = (e) => {
 this.blob = new Blob( this.chunks, { "type" : "audio/ogg; codecs=opus" });
 this.chunks = [];
 this.props.getRecordedData(this.blob);    
 };
 this.mediaRecorder.ondataavailable = (e) => {this.chunks.push(e.data);}
};

onError = () => {};

record = () => {
try
{
  this.mediaRecorder.start(); 
  this.refs.record.style.background = "red";
  this.refs.stop.disabled = false;
  this.refs.record.disabled = true;
}
catch (err) {alert("Please be sure to give permission to use the microphone.");}

};

stop = () => {
  if(this.mediaRecorder.state === "recording") // also is possible to check for "inactive" state
  {
	this.mediaRecorder.stop(); 
	this.refs.record.style.background = "";
	this.refs.record.style.color = ""; 
	this.refs.stop.disabled = true;
	this.refs.record.disabled = false;
  }
};

visualize = (stream) => {
  this.source = this.audioCtx.createMediaStreamSource(stream);
  this.analyser = this.audioCtx.createAnalyser();
  this.analyser.fftSize = 2048;
  this.bufferLength = this.analyser.frequencyBinCount;
  this.dataArray = new Uint8Array(this.bufferLength);
  this.source.connect(this.analyser);
  this.draw();  
};

draw = () => {
  try{
  if(this.active) { this.requestId = requestAnimationFrame(this.draw)};
  let WIDTH = this.refs.analyzer.width
  let  HEIGHT = this.refs.analyzer.height;  
  this.analyser.getByteTimeDomainData(this.dataArray);
  this.canvasCtx.fillStyle = "rgb(0, 0, 0)";
  this.canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
  this.canvasCtx.lineWidth = 2;
  this.canvasCtx.strokeStyle = "rgb(0, 220, 0)";
  this.canvasCtx.beginPath();
  let sliceWidth = WIDTH * 1.0 / this.bufferLength;
  let x = 0;
  for(let i = 0; i < this.bufferLength; i++) { 
  let v = this.dataArray[i] / 128.0;
  let y = v * HEIGHT/2;
  if(i === 0) {
    this.canvasCtx.moveTo(x, y);
    } else {
    this.canvasCtx.lineTo(x, y);
    }
   x += sliceWidth;
   }
   this.canvasCtx.lineTo(this.refs.analyzer.width, this.refs.analyzer.height/2);
   this.canvasCtx.stroke();
 }
 catch(error){console.log(error)}
};

 

	componentWillMount() {};
	render() {
		if(this.noCap) return (
			<div>
				<p> {this.mediaErrormessage} </p>
				<canvas  className ="chat-analyzercss" width= "200px" height= "25px" ref = "analyzer"></canvas> 
			</div>
		);
		return(
			<div className = "chat-recorder">
				<span>Send an audio recording</span>
				<button ref = "record" onClick = {this.record} ><i className="fa fa-microphone" aria-hidden="true"></i></button>
				<button ref = "stop" onClick = {this.stop} ><i className="fa fa-stop" aria-hidden="true"></i></button>
      
				<canvas className ="chat-analyzercss" width= "200px" height= "45px" ref = "analyzer"></canvas> 
			</div>
		);
	}
}

export default Recorder;

// video/webm
// video/webm;codecs=vp8
// video/webm;codecs=vp9
// video/webm;codecs=vp8.0
// video/webm;codecs=vp9.0
// video/webm;codecs=h264
// video/webm;codecs=H264
// video/webm;codecs=avc1
// video/webm;codecs=vp8,opus
// video/WEBM;codecs=VP8,OPUS
// video/webm;codecs=vp9,opus
// video/webm;codecs=vp8,vp9,opus
// video/webm;codecs=h264,opus
// video/webm;codecs=h264,vp9,opus
// video/x-matroska;codecs=avc1
// audio/webm
// audio/webm;codecs=opus
// audio/wav