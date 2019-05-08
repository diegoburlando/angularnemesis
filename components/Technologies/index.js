import React, { Component } from "react";// eslint-disable-line no-unused-vars
import  "./styles.css";
import {images} from "./image-importer";
import ProficiencyScale from "./ProficiencyScale/index";// eslint-disable-line no-unused-vars
import technologies from "../../appData/technologies";
//import logo from './images/nodelogo.png';

import PropTypes from "prop-types";// To render available the state in the component
import { TrackState } from "../../state/tracker";

class Technologies extends Component {
	static contextTypes = {store: PropTypes.object};
	constructor(props) {
		super(props);    	
		this.frontend = technologies.FrontEnd;
		this.backend = technologies.BackEnd;
		this.cloud = technologies.Cloud;
		this.database = technologies.Database;
		this.state = {theme:""};
		this.unsubscribe=null;
	}

	componentWillMount() {
		window.scrollTo(0, 0);
	}
	componentDidMount() {
		this.observeState();
		this.unsubscribe = this.context.store.subscribe(this.observeState); 	
		TrackState(this.context.store,"Technologies");
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

  	observeState = () =>{ 
		this.setState({			
			theme:this.context.store.getState().theme
		}); 		
	}  

	render() {		
		
		let frontend = this.frontend.map((item)=> {
			const inlineStyle = {
				backgroundImage: "url(" + images[item.LogoName] + ")",
				backgroundColor: item.BackColor	
			};			
			return(
				<li key = {item.Id} className= "tec-logosContainer">
					<div style={inlineStyle} className="tec-divLogo"></div>					
					<ProficiencyScale widthStars={item.Stars * 20} experienceYears={item.Years} tecName={item.Name} numberOfStars={item.Stars}/>
				</li>				
			)
		});

		let backend = this.backend.map((item)=> {
			const inlineStyle = {
				backgroundImage: "url(" + images[item.LogoName] + ")",
				backgroundColor: item.BackColor	
			};
			
			return(

				<li key = {item.Id} className= "tec-logosContainer">
					<div style={inlineStyle} className="tec-divLogo"></div>
					<ProficiencyScale widthStars={item.Stars * 20} experienceYears={item.Years} tecName={item.Name} numberOfStars={item.Stars}/>

				</li>				
			);
		});

		let cloud = this.cloud.map((item)=> {
			const inlineStyle = {
				backgroundImage: "url(" + images[item.LogoName] + ")",
				backgroundColor: item.BackColor	
			};
			
			return(

				<li key = {item.Id} className= "tec-logosContainer">
					<div style={inlineStyle} className="tec-divLogo"></div>
					<ProficiencyScale widthStars={item.Stars * 20} experienceYears={item.Years} tecName={item.Name} numberOfStars={item.Stars}/>
				</li>				
			);
		});

		let database = this.database.map((item)=> {
			const inlineStyle = {
				backgroundImage: "url(" + images[item.LogoName] + ")",
				backgroundColor: item.BackColor	
			};
			
			return(

				<li key = {item.Id} className= "tec-logosContainer">
					<div style={inlineStyle} className="tec-divLogo"></div>
					<ProficiencyScale widthStars={item.Stars * 20} experienceYears={item.Years} tecName={item.Name} numberOfStars={item.Stars}/>

				</li>				
			);
		});		
		
		return (

			<main className = {this.state.theme === "light" ? "tec-mainWork-light": "tec-mainWork-dark"}>
				<h1 className = "tec-heading">TECHNOLOGIES</h1>
				<div className = "tec-tecContainer">
					<div className = "tec-lists">
						<h2>FrontEnd</h2>
						<hr/>
						<ul>{frontend}</ul>
					</div>
					<div className = "tec-lists">
						<h2>BackEnd</h2>
						<hr/>
						<ul>{backend}</ul>
					</div>
					<div className = "tec-lists">
						<h2>Cloud and Deployment</h2>
						<hr/>
						<ul>{cloud}</ul>
					</div>
					<div className = "tec-lists">
						<h2>Database</h2>
						<hr/>
						<ul>{database}</ul>
					</div>
				</div>
			</main>
		);
	}
}
export default Technologies;