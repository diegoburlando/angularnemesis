import React, { Component } from "react";
import logo from "./images/nav-windRose.png";
import "./styles.css";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {light, dark, removeLoginClaims, notlogged} from "../../state/actions";
import classNames from "classnames";
import genericAuth from "../../services/authentication/genericshelpersauth";
import moment from "moment";
import apiConfig from "../../apiconfiguration/apiconfig";

class Navbar extends Component {	
	static contextTypes = {store: PropTypes.object}; 

	constructor(props) {
		super(props);	
		this.unsubscribe=null;	
		this.visitorIp = "";
		this.state = {
			toggled: false,
			currentPage : "",
			theme:"",
			authenticated : false,
			loginClaims : {},
			isAdmin: false		
		};
	}
	
	 
	observeState = () =>{ 
		let current = this.context.store.getState().pageVisited.pageNames[this.context.store.getState().pageVisited.pageNames.length -1]
		this.setState({
			currentPage:current,
			theme:this.context.store.getState().theme,
			authenticated: this.context.store.getState().authenticated,
			loginClaims : this.context.store.getState().profileClaims.Claims,
			isAdmin: this.context.store.getState().profileClaims.Claims.userClaims ? JSON.parse(this.context.store.getState().profileClaims.Claims.userClaims.isAdmin) : false
		});		
		

	}
	componentWillMount() {
		this.observeState();
	}

  	componentDidMount(){ 	
  		/* genericAuth().getCSRFToken()
		.then(response => {return "done";})
		.then(() => {console.log("Protection up")}); */	
		this.unsubscribe = this.context.store.subscribe(this.observeState); 
		this.getIpAndVisits();				
		document.addEventListener('click', this.closeMobileNav);
	};

	closeMobileNav = (event) => {
		let mobileNav = this.refs.mobileMenu;
		let isClickInside = mobileNav.contains(event.target);
		if (!isClickInside) {
			this.setState({
				toggled: false
			});	    
			mobileNav.style.marginTop = "-15em";
		}
	}

	componentWillUnmount() {
		this.unsubscribe();
		document.removeEventListener('click', this.closeNav)
	}

	getIpAndVisits = () => {
		fetch(apiConfig.ipApi).then(resIpJson => resIpJson.json()).then(resIp => {			
			this.visitorIp =  resIp.ip;
			this.updateVisits();
		});
	}

	updateVisits = () => {		
		let currentDate = moment().format("dddd Do of MMMM YYYY - HH:mm");

		fetch(apiConfig.visits, { 
			method: "POST", credentials: 'include', 
			body: JSON.stringify({ visitDate:currentDate, visitorIp: this.visitorIp}),     
			headers: {
				'Content-type':'application/json'			           
			}
		})
		.then(resVisitsJson => {
		if (resVisitsJson.status >= 400) {		
			console.log(resVisitsJson.status);
			return	"error";			
		}
		return resVisitsJson.json();
		})
		.then(resVisits => {
			this.refs.visits.innerHTML= "Visits: " + resVisits;			
		});
		 
	}
 

	displayMenu = () =>  {
		this.setState({
			toggled: !this.state.toggled
		});	    	
		if (!this.state.toggled) {
			this.refs.mobileMenu.style.marginTop = "0em";
		}
		else {
			this.refs.mobileMenu.style.marginTop = "-15em";
		}    	
	}

	casesClass = () => {
		if(this.state.currentPage === "Case Studies" || this.state.currentPage ==="Nasa Apods" || this.state.currentPage === "Technologies" || this.state.currentPage === "Email Form" || this.state.currentPage === "JWT Security" || this.state.currentPage === "Angular React Comparison" || this.state.currentPage === "D3.js Histogram" || this.state.currentPage === "Youtube Feeds" || this.state.currentPage === "Youtube Feeds Detail" || this.state.currentPage === "Chat88")
		{return true;}
		return false;
	}

	lightTheme = () => {
		this.context.store.dispatch(light());
		localStorage.setItem('theme_diegomary', this.context.store.getState().theme );
	}

	darkTheme = () => {
		this.context.store.dispatch(dark());
		localStorage.setItem('theme_diegomary', this.context.store.getState().theme );
	}

	logOut = ()=> {		
		localStorage.removeItem('jwt_diegomary');
		localStorage.removeItem('authenticated');
		localStorage.removeItem('userclaims_diegomary');
		this.context.store.dispatch(removeLoginClaims());
		this.context.store.dispatch(notlogged());
	}


	render() {
		let ProfileP = () => {
			let profilepstyle = {
				marginLeft:'1em',
				fontSize:'0.9em'
			}				
			if (typeof this.state.loginClaims.userClaims !== 'undefined') {
				let firstName = this.state.loginClaims.userClaims.firstName;
				let lastName = this.state.loginClaims.userClaims.lastName;
				return (
					<p style = {profilepstyle}>{` Hello ${firstName} ${lastName}!!`}</p>
				)				
			}
			else return null;
		  }
		
		let loginClasses =  classNames({
			
			"navLogLiElements" : !this.state.authenticated,
			"navLiElementsHidden" : this.state.authenticated
		})

		let profileClasses = classNames({
			
			"navLogLiElements" : this.state.authenticated,
			"navLiElementsHidden" : !this.state.authenticated
		})

		let adminClasses = classNames({			
			"navLogLiElements" : this.state.authenticated && this.state.isAdmin,
			"navLiElementsHidden" : !this.state.authenticated || !this.state.isAdmin
		})
		
		return (		
			<div className = "fixedNav">
				<nav ref="mainNav" className ={this.state.theme === "light"?"navbar nav-light":"navbar nav-dark"} >	
					<ul className="navList">
						<li className = {this.state.currentPage === "Home"? "navLiElementsFocused":"navLiElements" }><Link to="/"><img alt="logo" className = "logo" src={logo}/></Link></li>
						<li className = {this.state.currentPage === "About"? "navLiElementsFocused":"navLiElements"}><Link to="/about">About</Link></li>	
						<li className = {this.state.currentPage === "Development"? "navLiElementsFocused":"navLiElements"}><Link to="/work">Development</Link></li>
						<li className = {this.casesClass() ? "navLiElementsFocused":"navLiElements"}><Link to="/casestudies">Case Studies </Link></li>		
						<li className = {this.state.currentPage === "Contacts"? "navLiElementsFocused":"navLiElements"}><Link to="/contacts">Contact us</Link></li>	
						<li className = {loginClasses}><Link to="/login">Login</Link></li>
						<li className = {loginClasses}><Link to="/register">Register</Link></li>
						<li className = {profileClasses}><Link to = "/profile" >Profile</Link></li>
						<li className = {adminClasses}><Link to = "/admin" >Admin</Link></li>
						<li className = {this.state.authenticated ? "navLogLiElements": "navLiElementsHidden"}><Link onClick = {this.logOut} to = "/login" >Logout</Link></li>
						<ProfileP/>
						<li style = {{display:"none"}} className = {this.state.currentPage === "Admin"? "navLiElementsFocused":"navLiElements"}><Link to="/admin">Admin</Link></li>							
					</ul>		

					<div className = "theme-changer">
						<p>Theme</p>
						<p><i className="fa fa-chevron-down"></i></p>
						<div className = "theme-buttons-container" >
							<button className = {this.state.theme === "light"? "theme-button-focused" : "theme-button-not-focused"} onClick={this.lightTheme}>light</button>
							<button className = {this.state.theme === "dark"? "theme-button-focused" : "theme-button-not-focused"} onClick={this.darkTheme}>dark</button>
							<p className = "nav-visits" ref = "visits"></p>
						</div>
					</div>								
				</nav>
				
				<nav ref = "mobileMenu" className= "mobileListContainer">
					<ul className = "mobileList">
						<li className = "theme-buttons-container-mobile"> 
							<button  onClick={this.lightTheme}>light</button>
							THEME
							<button  onClick={this.darkTheme}>dark</button>
						</li>
						<li><Link to="/">Home</Link></li>
						<li><Link to="/about">About</Link></li>	
						<li><Link to="/work">Development</Link></li>
						<li><Link to="/casestudies">Case Studies </Link></li>	
						<li><Link to="/contacts">Contact us</Link></li>	
						
					</ul>
					<div onClick = {this.displayMenu} className = "logoMobile" >
						<div></div>
						<div></div>
						<div></div>
					</div>															
				</nav>					
			</div>	
		);
	}
}
export default Navbar;
