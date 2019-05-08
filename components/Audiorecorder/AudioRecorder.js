import React, {useRef, useEffect} from 'react';
import './audiorecorder.scss';
import Chart from 'chart.js';
import { beep } from './beeps';
import apiConfig from "../../apiconfiguration/apiconfig";


function AudioRecorder() {
  
  let blob = null; 
	let isRecording = false; 
	let chunks = [];
	let constraints = { audio: true,video: false };
	let noCap = false;
	let mediaRecorder = null;
	let mediaErrormessage = "";
	let audioCtx = null;
	let analyser = null;
	let bufferLength =null;
	let dataArray =  Array(1024).fill(0); ;
	let source = null;
	let requestId =null;
  let active = true;		
	let chartFFT=null;	
	let chartTD=null;
  let constLabels =  Array(1024).fill(0);
  let counter = 0;
  let overallStrength = 0;
  let realTimeFftChart = null;
  const analyzerfft = useRef(null);
  const graphTD = useRef(null);
  const graphFFT = useRef(null);
  const recordButton = useRef(null);
  const player = useRef(null);
  const downloadAudio = useRef(null);
  const freqlabel = useRef(null); 


  const setupChartRealTime = () => {    
    let canvasTDContext = analyzerfft.current.getContext('2d');
    realTimeFftChart = new Chart(canvasTDContext, {
      type: 'line',
      data: {
      labels:constLabels,
      datasets: [{ 
        data: dataArray,
        label: "Frequency",
        borderColor: "rgb(62,149,205)",
        backgroundColor:"rgba(62,149,205, 0.3)",
        fill: true,           
        borderWidth: 1,
        pointRadius: 0,           
        animation:false,
        cubicInterpolationMode:'monotone'  
      } 
    ]
    },
    options: {
    animation: {duration: 0,},
    hover: {animationDuration: 0,},
    responsiveAnimationDuration: 0,     
    scales: {        
      yAxes: [{
          display: false,		  
          ticks: {
          min: 0,
          stepSize: 255,              
          max: 255,
          callback: function(value, index, values) {
            return index === 0 ? 'Max' : '';
          }
          }
        }],
        xAxes: [{
        display: false,
        
      }],	  
    
    },
    title: {
      display: true,
      text: 'Real Time Frequency Spectra',
      
    },
    responsive: false,
    maintainAspectRatio:false,
    
    }
    });
    
    
      
  };

  const setupChartWavData =(x,y) => {	

    let canvasTDContext = graphTD.current.getContext('2d');	
    chartTD = new Chart(canvasTDContext, {
        type: 'line',
        data: {
          labels: x,
          datasets: [{ 
            data: y,
            label: "Time Domain",				
            borderColor: "rgb(0, 150, 37)",				
            fill: false,			
            borderWidth: 1,
            pointRadius: 0,			
            tension: 0,
            animation:false,			
          }]
        },
        options: {  
          animation: {duration: 0,},
          hover: {animationDuration: 0,},
          responsiveAnimationDuration: 0,     
          title: { display: true,	text: 'Time Domain Spectra'			
        },
        scales: {        
          yAxes: [{
              display: false,		  
              ticks: {
                min: -32678,
                stepSize: 32678,//8169.5,              
                max: 32678,
               
              }
            }],		  
            xAxes: [{
              display: false,
              min:0,
              stepSize: 500,  				  
            },
            {
            display: true,			
              type: 'category',
              labels: ['','Samples in seconds',''],
            }
          ],		  
          },
        responsive: false,
        maintainAspectRatio:true,				
        }
    });
    
  };

  const setupChartFFTData = (x,y) => {
    let canvasFFTContext = graphFFT.current.getContext('2d');
    chartFFT = new Chart(canvasFFTContext, {
      type: 'line',
      data: {
        labels: x,
        datasets: [{ 
          data: y,
          label: "Frequency Domain",				
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.3)",
          fill: true,
          animation:false,		
          borderWidth: 1,
          pointRadius: 0,				
          tension: 0,			
        }]
      },
      options: {
      animation: {duration: 0,},
      hover: {animationDuration: 0,},
      responsiveAnimationDuration: 0,   
      title: {
        display: true,
        text: 'FFT Frequency Spectra',			
      },
  
      scales: {        
        yAxes: [{
            display: false,		  
            
          }],		  
          xAxes: [{
            display: false,
                   
          },
          {
          display: true,			
            type: 'category',
            labels: ['0','500Hz','1000Hz','1500Hz','2000Hz','2500Hz','3000Hz','3500Hz','4000Hz','4500Hz','5000Hz','5500Hz','6000Hz','6500Hz','7000Hz','7500Hz','8000Hz'],		
  
          }
        ],		  
      },
  
      responsive: false,
      maintainAspectRatio:true,				
      },
  
    });  
  };

  const onSuccess = (stream) => {
    mediaRecorder = new MediaRecorder(stream);
    visualizeFft(stream);

    mediaRecorder.onstop = (e) => {
      blob = new Blob( chunks, { "type" : "audio/flac" });
      chunks = [];
      player.current.src = URL.createObjectURL(blob);
      const audioName= 'rec-' + getFormattedTime();
      let fd = new FormData();
      fd.append(audioName, blob);
      fd.append('phrase',"This is the value to save on disk with the same name of the wav file but with txt extension");
      fd.append('txtfilename', audioName + '.txt');
      fetch( apiConfig.postaudio, { headers: { Accept: "application/json"},credentials: 'include', method: 'post', body: fd })
      .then(res => res.json()).then((waveformData) => {
        chartTD.data.datasets[0].data = waveformData.waveform;			
        chartTD.data.labels = 	[...waveformData.waveform.keys()].map(element =>   (element)   );	
        chartTD.options.scales.xAxes[1].labels = ['', (waveformData.waveform.length/16000).toFixed(2) + ' secs recorded 16 bits mono 16KHz.'   ,''];	
        chartTD.update();
        chartFFT.data.datasets[0].data = waveformData.fftData.y.slice(0, waveformData.fftData.y.length/2);			
        chartFFT.data.labels = waveformData.fftData.x.slice(0, waveformData.fftData.x.length/2).map(element => (element).toFixed(0));
        chartFFT.update();  
      }).catch(err => console.log(err));
    
      downloadAudio.current.click();
    
    };

    mediaRecorder.ondataavailable = (e) => {chunks.push(e.data);}
    
  };

  const onError = () => {alert("Error")};

  const record = () => {
    try
    {
      var snd = new Audio(beep);  
      snd.play();
      let beepDelaied = setTimeout(() => {
        counter = 0;
        overallStrength = 0;
        isRecording = true;
        mediaRecorder.start(); 
        recordButton.current.style.background = "red";
        clearTimeout(beepDelaied);    
      },1500)         
    }
    catch (err) {alert("Please be sure to give permission to use the microphone.");}    
  };

  const stop = () => {
    if(mediaRecorder.state === "recording") // also is possible to check for "inactive" state
    {
    counter=0;
    overallStrength=0;
    mediaRecorder.stop();
    isRecording = false; 
    recordButton.current.style.background = "";
    recordButton.current.style.color = ""; 
    recordButton.current.style.background = "green";
    }
  };

  const visualizeFft = (stream) => {
    let AudioContext = ( window.AudioContext || window.webkitAudioContext );
    audioCtx = new AudioContext();
    console.log(audioCtx.sampleRate); //44100 fixed at time of development  
    source = audioCtx.createMediaStreamSource(stream);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    source.connect(analyser);    
    overallStrength =  0;
    counter =0;
    drawFft();  
  };

  const drawFft = () => {

    try{ 
        
        if(active) { requestAnimationFrame(drawFft)};		
        analyser.getByteFrequencyData(dataArray);			
        realTimeFftChart.data.datasets[0].data = dataArray;			
        realTimeFftChart.update();	
    }
  
    catch(error){ console.log(error) }
  };

  const getFormattedTime = () => {
    let today = new Date();
    let y = today.getFullYear();
    // JavaScript months are 0-based.
    let m = today.getMonth() + 1;
    let d = today.getDate();
    let h = today.getHours();
    let mi = today.getMinutes();
    let s = today.getSeconds();
    return y + "-" + m + "-" + d + "-" + h + "-" + mi + "-" + s;
  };

  const onMouseMoveInCanvas = (evt) => {
    var rect = analyzerfft.current.getBoundingClientRect();  
    let x = (Math.floor(evt.clientX - rect.left)); 
    let coef =  (11025 *1.0 / 400);
    freqlabel.current.innerHTML = `Frequency = ${(x * coef).toFixed(0)} Hz.`;
  };

  const onMouseLeaveCanvas = () => {
    freqlabel.current.innerHTML = `Hover to check frequency.`;
  };

  const performGraphTD =  () =>  chartTD.update();
  const performGraphFFT = () => chartFFT.update();


  useEffect(() => {

    setupChartRealTime();
	  setupChartWavData([],[]);
    setupChartFFTData([],[]);
    
    if (!navigator.mediaDevices.getUserMedia) {
      mediaErrormessage ="This Browser doesn't support Media Recording";
      noCap=true;
    }
    else {
      navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
      recordButton.current.style.background = "green";	
    }   

    return () => {
      audioCtx.close(); 
      active = false; //this works
    }
  },[]);

  
  
  if(noCap) return (
    <div>
      <p> {mediaErrormessage} </p>
      
    </div>
  );
  else {
    return(		
      <div className = "audiocontainer">
      <div className = "chat-recorder">							
        <button ref = {recordButton} onClick = { () => {isRecording === true ? stop(): record() }} ><i className="fa fa-microphone" aria-hidden="true"></i></button>				
        <audio  controls ref = {player}></audio>				
        <a hidden ref={downloadAudio} href="#" download = "download.flac">Download</a>			
      </div>
      <div ref ={freqlabel}>Hover to check frequency.</div>	
      <canvas height="200" width="800" ref={analyzerfft} onMouseMove={onMouseMoveInCanvas} onMouseLeave = {onMouseLeaveCanvas} ></canvas> 
      <canvas height="300" width="800" ref={graphTD}></canvas>
      <button onClick = {performGraphTD}>Draw Time domain</button>	
      <canvas height="300" width="800" ref={graphFFT}></canvas>
      <button onClick = {performGraphFFT}>Draw  FFT domain</button>
      </div>		
    );
  }
}

export default AudioRecorder;
