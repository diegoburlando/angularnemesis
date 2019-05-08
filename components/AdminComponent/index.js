import React, { Component } from "react";
import "./styles.css";
import PropTypes from "prop-types";// To render available the state in the component
import { TrackState } from "../../state/tracker";
import genericAuth from "../../services/authentication/genericshelpersauth";
import UserManager from "./UserManager/index";

class Admin extends Component {
	static contextTypes = {store: PropTypes.object}; 
	 constructor(props) {
		super(props);
		this.hasCheckOfTokenPerformed = false;
		this.candidateToken = "";
		this.formUpload = React.createRef();
		this.uploaded = React.createRef();
		this.state = {			
			isValidToken:false,
			isAdmin:false,
			loading:true
		}		
	} 
	
	componentDidMount () {
		TrackState(this.context.store,"Admin");
		this.candidateToken  = this.context.store.getState().profileClaims.Claims.userToken;
		genericAuth().checkValidToken(this.candidateToken).then(response => {
			if (response.status >= 400) {		
							
			}
			return response.json();
		})
		.then(res => {
			this.hasCheckOfTokenPerformed = true;
			this.setState({
				isValidToken : res.success ? true : false, 
				isAdmin : res.claim.isAdmin > 0 ? true : false,
				loading:false
			});				 
		});				
	};

	componentWillMount() {
		window.scrollTo(0, 0);		
	}

	componentWillUnmount() {		
		clearInterval(this.clear);
	}

	resetForm = ()=>{ this.formUpload.current.reset(); }

	fileUploadChange=(event) => {
		let files = event.target.files;
		if (files.length > 0) {
			for(let file of files)
			{			
				fetch(`https://xn47wk4dg2.execute-api.us-east-2.amazonaws.com/production`, { 
					method: "POST",  
					body: file ,     
					headers: {'Content-type':'multipart/form-data','filename': file.name, 'loggedintoken':this.candidateToken}
					})
				.then(response => {
				if (response.status >= 400) { 
					 
				}    
				return response.json();
				})
				.then(data => {	
					this.uploaded.current.innerHTML = `Successfully uploaded ${data} to AWS S3 bucket`;			
				});
			}
		 }
	}

	render() {	
		
		if (this.state.isValidToken && this.state.isAdmin) {	
			return (
				<div className="admin-main-container">
 			<form ref = "formUpload">
		 		<input onClick={this.resetForm} type="file"  onChange= {this.fileUploadChange} accept=".*"/>
		 	</form>
			 <p ref ="uploaded"></p>

			 <UserManager/>
                Admin Component				
			</div>
			);			
		}

		else if (this.state.isValidToken) {
			return (				
				<div className = "insufficient-credentials">
					<p>Sorry, you do not have the priviliges to access this part of the website. :(</p>
					<p><small>Ask the system administrator to elevate your credentials.</small></p>
				</div>
			)			
		}

		else if(this.state.loading) {
			return (
				<div ref="loader" className = {this.state.loading ? "ap-loader-profile" :  "ap-loader-profile-hidden"}>
					<div></div>
				</div>
			)			
		}


		else {			
			if(!this.hasCheckOfTokenPerformed ) return null;		
			
			this.clear = setTimeout( ()=> {	this.props.history.push('/login');}, 1200)
			return (				
				<div className = "no-user-logged">
					<p>Oops. No user logged in.</p>
				</div>
			)	
		}
	}

}

export default Admin;