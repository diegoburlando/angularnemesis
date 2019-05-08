import React, { Component } from "react";
import "./styles.css";
import PropTypes from "prop-types";
import {images} from "./image-importer";
import windRose from "./../images/home-windRose.png"

class Carousel extends Component {
	static contextTypes = {store: PropTypes.object}; 

	constructor(props) {
        super(props);
        this.imgArray = [];
        this.unsubscribe=null;
        this.state = {shuffled:false};
        this.intervalImagesShuffle = null;  
        this.carouselImg = [];
	}

	observeState = () => {}

  	componentDidMount() {  
        this.carouselImg = document.getElementsByClassName('carousel-img');
        this.imgArray = Object.keys(images).map((key) => { return [images[key]]; });     
		this.observeState();
        this.unsubscribe = this.context.store.subscribe(this.observeState);        
        this.intervalImagesShuffle = setInterval(this.shuffleArray,5000)
    };
  
    componentWillUnmount() {
        this.unsubscribe();		
        clearInterval(this.intervalImagesShuffle);
        clearTimeout(this.imgEase);		
	}  

    shuffleArray = () => { 
        this.setState({shuffled:false});
        Object.keys(this.carouselImg).forEach((key) => {            
            this.carouselImg[key].style.opacity = 0;
        });
        this.imgEase = setTimeout(()=>{ 
            for (let i = this.imgArray.length - 1; i > 0; i--) { 
                let j = Math.floor(Math.random() * (i + 1)); 
                [this.imgArray[i], this.imgArray[j]] = [this.imgArray[j], this.imgArray[i]];             
            }
            this.setState({shuffled:true});
			Object.keys(this.carouselImg).forEach((key) => {            
                this.carouselImg[key].style.opacity = 1;
            });
		}, 400);        
    } 

	render() {
		return (
			<div className = "carousel-container">
                <div className = "carousel-images-container">
                    <img alt="" className = "carousel-img1 carousel-img" src = {this.imgArray[0]}/>
                    <img alt="" className = "carousel-img2 carousel-img" src = {this.imgArray[1]}/>
                    <img alt="" className = "carousel-img3 carousel-img" src = {this.imgArray[2]}/>
                    <img alt="" className = "carousel-img4 carousel-img" src = {this.imgArray[3]}/>
                    <img alt="" className = "carousel-img5 carousel-img" src = {this.imgArray[4]}/>
                    <img alt="" className = "carousel-img6 carousel-img" src = {this.imgArray[5]}/>
                    <img alt="" className = "carousel-img7 carousel-img" src = {this.imgArray[6]}/>
                    <img alt="" className = "carousel-img8 carousel-img" src = {this.imgArray[7]}/>  
                </div>
                <img alt="" className = "carousel-wind-rose" src = {windRose} />
            </div>
		);
	}
}

export default Carousel;