import React, { Component } from 'react';
import './styles.css';
import { Link } from 'react-router-dom';
import MariaGithub from './GithubComponent/indexmaria';
import DiegoGithub from './GithubComponent/indexdiego';
import Technologies from '../Technologies/index';

import ReactVsNgLogos from '../ComparisonDataVis/ReactVsNgLogos/index';
import PropTypes from 'prop-types';// To render available the state in the component
import { TrackState } from '../../state/tracker';
import apiConfig from '../../apiconfiguration/apiconfig';

class Work extends Component {
	static contextTypes = {store: PropTypes.object};

	constructor(props) {
		super(props);
		this.unsubscribe=null;
		this.state = {theme:""};
		this.youtube = React.createRef();
		this.chat = React.createRef();
		this.nasa = React.createRef();
		this.comparison = React.createRef();
	}
	componentWillMount() { window.scrollTo(0, 0);}

	componentDidMount() {	
		this.observeState();	
		TrackState(this.context.store,"Development");
		this.unsubscribe = this.context.store.subscribe(this.observeState); 
		this.handleScroll();
		window.addEventListener("scroll", this.handleScroll)      
  	}

  	observeState = () =>{ 
		this.setState({			
			theme:this.context.store.getState().theme
		}); 		
	}  

	componentWillUnmount() {
		window.removeEventListener("scroll", this.handleScroll);
		this.unsubscribe(); 
	}
 
  	handleScroll = (event) => {

	    let youtubeDesc = this.youtube.current;     
	    if ((youtubeDesc.getBoundingClientRect().top + 200) <= window.innerHeight)   {
	      youtubeDesc.style.opacity = '1';
	      youtubeDesc.style.marginTop = '0';
	    }

	    let chatDesc = this.chat.current;     
	    if ((chatDesc.getBoundingClientRect().top + 200) <= window.innerHeight)   {
	      chatDesc.style.opacity = '1';
	      chatDesc.style.marginTop = '0';
	    }

	    let comparison = this.comparison.current;     
	    if ((comparison.getBoundingClientRect().top + 200) <= window.innerHeight)   {
	      comparison.style.opacity = '1';
	      comparison.style.marginTop = '0';
	    }

	    let nasa = this.nasa.current;     
	    if ((nasa.getBoundingClientRect().top + 200) <= window.innerHeight)   {
	      nasa.style.opacity = '1';
	      nasa.style.marginTop = '0';
	    }
	}
	
	
	render() { 
		return (
			<div className="dev-workContainer">
				<div className = "dev-secondDiv">
				<h1 className = "nav-component-heading" >Development</h1>
					<hr className = "nav-component-hr"/>
					<div className = "dev-gitTitle">
						<i className="fa fa-github" aria-hidden="true"></i>
						<p>GitHub</p>
					</div>
					<div className= "dev-github">
						<DiegoGithub  user = "diegomary"/>
						<MariaGithub user = "Mary62442"/>
					</div>					
				</div>	
				<section className = {this.state.theme ==="light"?"dev-reactVsNgPres reactVsNg-light":"dev-reactVsNgPres reactVsNg-dark"}>
					<div ref = {this.comparison}>
					<h1>Comparison of performances</h1>
					<ReactVsNgLogos color="white"/>
					<div className = "dev-comparisonGrid">
						<p className = "dev-gridItem">An example of data visualisation made in React 16.2.0 and Angular 5.2 to observe differences in performance. Both example make a call to a rest API on Azure to display the same kind of data</p>
						<Link to ="/comparison" className = "dev-gridItem"><button>Go to comparison</button></Link>
						<p className = "dev-gridItem">What can be noticed upon entering the page is that Angular 5 takes longer than React 16 to display results. Moreover, when the pagination buttons are clicked, the data to be visualised is much more responsive in React</p>
					</div>
					</div>
				</section>					
				<section className="dev-feedsPresentation">
					<div ref = {this.youtube}>
					<h1>Youtube API</h1>
						<h3>Completely written in React.js</h3>
						<p>This example uses Youtube API V3 to search for videos using an input value. The component has been completely written in React.js following best practices</p>
						<hr/>
						<h3>Play single videos</h3>
						<p>There are two main components in this example: a list component, and a single result component. The single result component displays the video data aquired through a fetch function</p>
						<hr/>
						<h3>Or play a playlist</h3>
						<p>Where the video is part of a playlist, another call to a V3 API is performed to aquire the info of the other videos. The necessary style has been applied for the benefit of data visualisation</p>
						<Link className = {this.state.theme === "light" ? "dev-btn-white-light":"dev-btn-white-dark"} to="/youtube"><button>Go to Youtube example</button></Link>
					</div>
					<div className = "dev-youtubepage"></div>
				</section>
				
				<Technologies />
				<section className="dev-chatPresentation">
					<div ref = {this.chat}>
					<h1>Chat88</h1>
						<h3>A chat made entirely in react.js</h3>
						<p>An example of real time development using Firebase Google Platform to build an accessible chat to all Google Account holders</p>
						<hr/>
						<h3>designed with traditional features</h3>
						<p>A user can send messages to the administrator of the wensite, as well as pictures and audio exerpts. To test properly, please use Chrome, Firefox, and Opera due to browser incompatibility with Microsoft Edge and Safari</p>
						<hr/>
						<h3>Admin priority</h3>
						<p>The administrator is able to send private messages to a single user or public messages to all users to manage private customers' requests. Therefore, this chat is ideal to be hosted in a web application that requires customer support</p>
						<Link className = {this.state.theme === "light" ? "dev-btn-white-light":"dev-btn-white-dark"} to="/chat"><button>Go to Chat</button></Link>
					</div>
					<div className = "dev-chatpage"></div>
				</section>	
				<section className = {this.state.theme === "light"? "dev-nasaApods dev-nasa-light":"dev-nasaApods dev-nasa-dark"}>
					<div ref = {this.nasa}>
						<h1>nasa apods</h1>
						<p>React fetch call to Nasa API</p>
						<div className = "dev-gridNasa">
							<div className = "dev-gridItem"></div>
							<p className = "dev-gridItem dev-gridItemText">A data visualisation page written in React.js showing a series of space-related images obtained from Nasa Apod's API. The layout is a responsive grid system designed to assign different element sizes depending on the mapped element's index.</p>
							<div className = "dev-gridItem"></div>
							<p className = "dev-gridItem dev-gridItemText">An imported ES6 class provides methods to obtain random date ranges to display 15 images in the grid layout. The images are then fetched according to the time period described, and due to missing images in the API, if there is an internal error 500, a new date will be called.</p>
							<Link className = "dev-gridItem" to="/nasa"><button>Go to Nasa Apods</button></Link>
							<p className = "dev-gridItem dev-gridItemText">The astronomical pictures, together with any possible videos, can be clicked and enlarged to display further details. Different buttons navigate through time acquiring previous and subsequent time periods, as well as going back to the current date.</p>
						</div>
					</div>
				</section>
				<section className="dev-d3Histo">
					<h1>d3.js custom histogram building</h1>
					<h3>Made in Angular 5 cli and Angular Material</h3>
					<iframe title="d3 histogram" src={apiConfig.angularSiteD3}></iframe>
				</section>
				{/*<section>
					<Link to="/work/maps"><button>Got to Maps</button></Link>
				</section>	*/}					
				
			</div>
	    )
	}

}
export default Work;