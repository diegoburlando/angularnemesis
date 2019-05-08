import React, { Component } from 'react';
import './styles.css';
import PropTypes from "prop-types";

class StarrySky extends Component {
	static contextTypes = {store: PropTypes.object};
	constructor(props) {
		super(props);
		this.stars = [];
		this.state= {starsPushed:false, theme:""};
		this.unsubscribe=null;
	};

	observeState = () =>{ 
		this.setState({			
			theme:this.context.store.getState().theme
		}); 		
	}  

	componentDidMount() {
		this.addStars();
		this.observeState();
		this.unsubscribe = this.context.store.subscribe(this.observeState); 
		window.addEventListener('resize', this.addStars)
	};

	componentWillUnmount() {
		this.unsubscribe();
		window.removeEventListener('resize', this.addStars);
	}

	findRandom = (max, min) => {
		return Math.floor(Math.random() * (max - min + 1) + min);
	};

	addStars = () => {	

		if (this.state.starsPushed) {
			this.stars.length = 0;
		};
		
	  	let width= window.innerWidth;
	 	let height = window.innerHeight;	  

		for ( let i = 0; i < 150; i++) {
		    let randomSize = this.findRandom(5, 1);
		    let randomTop = this.findRandom(height, 1);
		    let randomLeft = this.findRandom(width, 1);
		    let randomOpacity = (this.findRandom(10, 5)/10);
		    let randomDuration = (this.findRandom(20, 5)/10);
		    let randomColor = this.findRandom(360, 1);
		    let revOrNot = this.findRandom(2, 1);
		    let rev = 'normal';
		    if (revOrNot === 1) rev = 'reverse';
		    
		    let starsCss = {
		    	backgroundColor: "hsl("+randomColor+",100%,90%)",
		     	top:randomTop+"px",
		     	left:randomLeft+"px",
		     	opacity:randomOpacity,
		     	animationDirection:rev,
		     	width:randomSize+"px",
		     	height:randomSize+"px",
		     	animationDuration: randomDuration+"s",
		     	animationDelay: randomOpacity+"s",		     			     	
		     	borderRadius:"50%",
  				boxShadow:"0 0 20px white",
  				position:"absolute", 
		    } 
		    let key = `star${i}`; 
			this.stars.push(<p key = {key} className = "apod-starsAnimation" style = {starsCss}></p>);
			this.setState({starsPushed: true});		
		
		};
	}	

	render() {
		
		return(
			<div className = {this.state.theme === "light" ? "apod-containerOfStars-light" : "apod-containerofStars-dark"}>
			{this.stars}
			</div>
		)
	}

}
export default StarrySky;