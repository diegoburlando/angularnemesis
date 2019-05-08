import React, { Component } from "react";
import "./styles.css";
import PropTypes from "prop-types";// To render available the state in the component
import { TrackState } from "../../state/tracker";
import EmailForm from "../EmailForm/index";

class Contacts extends Component {
	static contextTypes = {store: PropTypes.object}; 
	
	componentWillMount() {window.scrollTo(0, 0);}
	componentDidMount () { TrackState(this.context.store,"Contacts"); 

}

	render() {

		return (
			<div className="cont-mainContainer">
				<h1 className="nav-component-heading">Contact us</h1>
				<hr className="nav-component-hr"/>

				<EmailForm distanceFromTop = "1em" />
				 <div className = "cont-contactsContainer">
			
					<div className = "cont-flexContacts">
						<div className= "cont-contacts">
							
							<div className = "cont-icons"><i className="fa fa-mobile" aria-hidden="true"></i>
								<p>UK: +44 7391005191</p>
							</div>
							<div className = "cont-icons"><a title = "mailto:diegoaldoburlando62@gmail.com" href ="mailto:diegoaldoburlando62@gmail.com" ><i className="fa fa-envelope-o" aria-hidden="false"></i></a>
								<p>diegoaldoburlando62@gmail.com</p></div>
							

							<div className = "cont-icons"><a title = "skype:diegus.burlando" href="skype:diegus.burlando?call"><i className="fa fa-skype" aria-hidden="false"></i></a>
								<p>Call Diego</p></div>	
							
						</div>

						<div className= "cont-contacts">
							
							<div className = "cont-icons"><i className="fa fa-mobile" aria-hidden="true"></i>
								<p>UK: +44 7498497847</p>
							</div>
							<div className = "cont-icons"><a title = "mailto:mary_62442@outlook.com" href ="mailto:maria.bu62442@gmail.com" ><i className="fa fa-envelope-o" aria-hidden="false"></i></a>
								<p>mary_62442@outlook.com</p></div>

							<div className = "cont-icons"><a title = "skype:live:mary_62442?call" href="skype:live:mary_62442?call"><i className="fa fa-skype" aria-hidden="false"></i></a>
								<p>Call Maria</p></div>
							
						</div>
					</div>					
				</div>	 		
			</div>
		);
	}

}
export default Contacts;