import React, { Component } from "react";// eslint-disable-line no-unused-vars
import  "./styles.css";
import genericAuth from "../../services/authentication/genericshelpersauth";
import PropTypes from "prop-types";// To render available the state in the component
import { TrackState } from "../../state/tracker";
import Journal from "./JournalComponent/index";
import HtmlEditor from "./HtmlEditorComponent/index"

class Profile extends Component {
	static contextTypes = {store: PropTypes.object};
    constructor(props) {
		super(props);
		this.unsubscribe=null;	
		this.userfirstname = "";
		this.isValidToken = false;
        this.userlastname = "";
		this.useremail = "";
		this.clear = {};
		this.authToken  = null;
		this.hasCheckOfTokenPerformed = false;
		this.state = {
			authenticated:false,
			isValidToken:false,
			loading:true,
			entryAdded:false		
		}
		this.candidateToken = "";
		this.entries = [];
    }

	componentWillMount() {
		window.scrollTo(0, 0);
	}


	loadEntries = () => {

		TrackState(this.context.store,"Profile");
		this.unsubscribe = this.context.store.subscribe(this.observeState);
		this.candidateToken  = this.context.store.getState().profileClaims.Claims.userToken;
		genericAuth().checkValidToken(this.candidateToken).then(response => {
			if (response.status >= 400) {		
				console.log(response.status);			
			}
			return response.json();
		})
		.then(restokenvalid => {
			this.hasCheckOfTokenPerformed = true;

			if (!restokenvalid.success) {
				this.setState({
					isValidToken : restokenvalid.success ? true : false,
					loading:false					
				});	
				return;	
			}
			if (typeof this.context.store.getState().profileClaims.Claims.userClaims !== 'undefined') {
				this.userfirstname = this.context.store.getState().profileClaims.Claims.userClaims.firstName;
				this.userlastname = this.context.store.getState().profileClaims.Claims.userClaims.lastName;
				this.useremail = this.context.store.getState().profileClaims.Claims.userClaims.email;
			}			
			
			genericAuth().fetchJournal(this.candidateToken, this.useremail).then(response => {

				if (response.status >= 400) {		
				  console.log(response.status);			
				}
				return response.json();
			  })
			  .then(resentries => {
	  
				if (Array.isArray(resentries) || resentries.length) {				
					this.entries = resentries;
				}
				this.setState({
					isValidToken : restokenvalid.success ? true : false, 
					isAdmin : restokenvalid.claim.isAdmin > 0 ? true : false,
					loading: false					
				});			
			});	 
		});
	}


	componentDidMount() {
		this.loadEntries();		
	}

	componentWillUnmount() {
		this.unsubscribe();	
		clearInterval(this.clear);
	}
	
	observeState = () => {
		this.setState({			
			authenticated: this.context.store.getState().authenticated			
		}); 	
	}


	handleEntryAdded = (e) => {		
		this.loadEntries();		
	  }
   	
	render() {

		if(this.state.loading) {
			return (
				<div ref="loader" className = {this.state.loading ? "ap-loader-profile" :  "ap-loader-profile-hidden"}>
					<div></div>
				</div>
			)			
		}
		
		else if (this.state.isValidToken) {			
			return (
				<div className = "profile-journal-container">					
					<h1>{`${this.userfirstname}'s journal`}</h1>
					<HtmlEditor userFirstName = {this.userfirstname} initialContent = "" userEmail = {this.useremail}  callbackUpdate = {this.handleEntryAdded}   />
					<Journal entries = {this.entries}/>					
				</div>
			);	
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
export default Profile;