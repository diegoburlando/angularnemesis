import React, { Component } from "react";
import "./styles.css";
import logo from "./images/foot-windRose.png";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

class Footer extends Component {
	static contextTypes = {store: PropTypes.object}; 

	constructor(props) {
		super(props);
		this.unsubscribe=null;
		this.state = {theme:""};
	}

	observeState = () =>{ 		
		this.setState({			
			theme:this.context.store.getState().theme
		}); 		
	}

  	componentDidMount(){ 
		this.observeState();
		this.unsubscribe = this.context.store.subscribe(this.observeState); 		  
	};

	componentWillUnmount() {
		this.unsubscribe();
	}


	render() {

		return (
			<footer style={{clear:"both"}} className = {this.state.theme ==="light"? "endFooter endFooter-light":"endFooter endFooter-dark"} >
				<img alt="logo" src={logo}/> 
				<hr/>
				<div className= "linksContainer">				
					<div>
						<Link to = "/">Home</Link>
						<Link to = "/about">Who we are</Link>
					</div>
					<div>
						<Link to = "/work">Development</Link>
						<Link to = "/contacts">Contacts</Link>
					</div>
					<div>
						<Link to="/casestudies">Case studies</Link>
						<Link to = "/login">Login</Link>
					</div>
				</div>
				<hr/>
				<p>&copy; 2018 Diego &amp; Maria</p>
			</footer>

		);
	}

}

export default Footer;