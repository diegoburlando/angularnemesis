import React, { Component } from "react"; // eslint-disable-line no-unused-vars
import {Route, Switch, HashRouter } from "react-router-dom"; // eslint-disable-line no-unused-vars
import About from "../components/AboutComponent/index";
import Home from "../components/HomeComponent/index";
import d3Histogram from "../components/d3Histogram/index";
import ComparisonDataVis from "../components/ComparisonDataVis/index";
import Work from "../components/WorkComponent/index";
import Contacts from "../components/ContactsComponent/index";
import CaseStudies from "../components/CaseStudiesComponent/index";
import YoutubeListComponent from "../components/YoutubeListComponent/index";
import YoutubeDetailsComponent from "../components/YoutubeDetailsComponent/index"; // eslint-disable-line no-unused-vars
import Chat88 from "../components/Chat88/index";
import EmailForm from "../components/EmailForm/index";
import Admin from "../components/AdminComponent/index";
import NasaApodsComponent from "../components/NasaApods/index";
import Navbar from "./header/navbar"; // eslint-disable-line no-unused-vars
import Footer from "./footer/index"; // eslint-disable-line no-unused-vars
import Technologies from "../components/Technologies/index";
import JwtSecurity from "../components/JwtSecurityComponent/index";
import Login from "../components/LoginComponent/index";
import Register from "../components/RegisterComponent/index";
import Profile from "../components/ProfileComponent/index";
import Markov from "../components/MarkovComponent/index";
import Swan from "../components/SwanComponent/index";
import AudioRecorder from '../components/Audiorecorder/AudioRecorder';
import EmailVerify from '../components/EmailVerify/index';

class Layout extends Component {
	
	render(){
		return(
			<div>
				<HashRouter>
					<div>    
						<Navbar/>
						<div style={{paddingTop:"5em"}}>
							<Switch>
								<Route exact path= "/" component = {Home} />} /> 
								<Route exact path= "/about" component = {About} />
								<Route exact path= "/contacts" component = {Contacts} />
								<Route exact path= "/casestudies" component = {CaseStudies} />
								<Route exact path= "/technologies" component = {Technologies} />
								<Route exact path= "/d3histogram" component = {d3Histogram} />
								<Route exact path= "/jwtsecurity" component = {JwtSecurity} />
								<Route exact path= "/youtube" component = {YoutubeListComponent} />
								<Route exact path="/youtube/details/:id/:optionalparam?" render={(props) => <YoutubeDetailsComponent {...props} otherparam="testparameter"/>}/>
								<Route exact path= "/comparison" component = {ComparisonDataVis} />
								<Route exact path= "/chat" component = {Chat88} />
								<Route exact path= "/emailform"  render={(props)=><EmailForm {...props} distanceFromTop="5em" />} />
								<Route exact path= "/nasa" component = {NasaApodsComponent} />
								<Route exact path= "/work" component = {Work} />
								<Route exact path= "/admin" component = {Admin} />
								<Route exact path= "/login" component = {Login} />
								<Route exact path= "/register" component = {Register} />
								<Route exact path= "/profile" component = {Profile} />
								<Route exact path= "/markov" component = {Markov} />
								<Route exact path= "/swan" component = {Swan} />
								<Route exact path= "/emailverify" component = {EmailVerify} />
								<Route exact path= "/audiorecorder" component = {AudioRecorder} />
							</Switch> 
						</div>        
						<Footer/> 
					</div>
				</HashRouter>
			</div>
		);
	}
}

export default Layout;