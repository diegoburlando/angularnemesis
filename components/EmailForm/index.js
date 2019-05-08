import React, { Component } from "react";
import "./styles.css";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";// To render available the state in the component
import { TrackState } from "../../state/tracker";
import apiConfig from "../../apiconfiguration/apiconfig";

class EmailForm extends Component {
	static contextTypes = {store: PropTypes.object};
	constructor(props) {
		super(props);
		this.emailReadyToSubmit= false;
		this.messageReadyToSubmit = false;   
		this.nameReadyToSubmit = false; 
		this.captchaVisible = false; 
		this.thanksarea = React.createRef();
		this.writetousform =  React.createRef();
		this.customerName = React.createRef();
		this.email = React.createRef();
		this.spinner = React.createRef();
		this.captcha = React.createRef();
		this.submitbutton = React.createRef();
		this.sendunsuccessful =  React.createRef();
		this.custmessage = React.createRef();
		this.emailvalidator = React.createRef();
			
	  }
	componentWillMount() {window.scrollTo(0, 0);}
	componentDidMount () 
	{		
		TrackState(this.context.store,"Email Form");
		let googlecaptcha = document.createElement('script');
		googlecaptcha.src = apiConfig.googlecaptcha;
		
		document.head.appendChild(googlecaptcha);
		let googlecaptchaCallback = document.createElement('script');
		googlecaptchaCallback.src = "captchacallback.js";
		document.head.appendChild(googlecaptchaCallback);
		this.submitbutton.current.disabled = true;
	
	};	

	submitForm = (event) => {
		
		event.preventDefault(); 	  
		this.spinner.current.style.display="block";	  
		let cp = document.getElementsByName("g-recaptcha-response");	  
		//let encode = encodeURIComponent;	  
		let payLoad = {    	  
		  email:this.email.current.value,	  
		  customerName:this.customerName.current.value,	  
		  message:this.custmessage.current.value,	  
		  captcha:cp[0].value	  
		};
		
		fetch(apiConfig.contactus, { method: "POST" ,body:JSON.stringify(payLoad),	  
		headers: {'content-type': 'application/json'}})	  
		.then(response => {	  
			if (response.status >= 400) {	  
				  
			}			 
			return response.json();	  
		})	  
		.then(res => {this.spinner.current.style.display="none";	  
		 
		if(res.success){
			console.log(res)	  
			this.writetousform.current.style.display="none";	  
			this.thanksarea.current.style.display="block";	  
			window.scrollTo(0, 0);
			}	  
		else{this.sendunsuccessful.current.style.display="block";}});	  
	}

	validateEmail = (email) => {
		let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	}
	  
	emailChange = (event) => {
	
		let emailToCheck = event.target.value;
		if(emailToCheck === "" ){
		
			this.emailvalidator.current.style.visibility="hidden";    
			this.submitbutton.current.disabled = true;
			this.emailReadyToSubmit = false;
			this.captchaVisible = (this.emailReadyToSubmit && this.messageReadyToSubmit && this.nameReadyToSubmit);
			this.captcha.current.style.visibility=  this.captchaVisible===true? "visible" :"hidden";
	
			}
		else if(!this.validateEmail(emailToCheck)){   
			this.emailvalidator.current.style.visibility="visible";
			this.submitbutton.current.disabled = true;
			this.emailReadyToSubmit = false;
			this.captchaVisible = (this.emailReadyToSubmit && this.messageReadyToSubmit && this.nameReadyToSubmit);
			this.captcha.current.style.visibility=  this.captchaVisible===true? "visible" :"hidden";
		}       
		else{
			this.emailvalidator.current.style.visibility="hidden";      
			this.emailReadyToSubmit=true;
			this.captchaVisible = (this.emailReadyToSubmit && this.messageReadyToSubmit && this.nameReadyToSubmit );
			this.captcha.current.style.visibility=  this.captchaVisible===true? "visible" :"hidden";
			} 
		
	
	}
	  
	messageChange = (event) => {
		
		let messageToCheck = event.target.value;
		if(messageToCheck === "" ){       
			this.submitbutton.current.disabled = true;
			this.messageReadyToSubmit = false;
			this.captchaVisible = (this.emailReadyToSubmit && this.messageReadyToSubmit && this.nameReadyToSubmit);
			this.captcha.current.style.visibility=  this.captchaVisible===true? "visible" :"hidden";
		}
		
		else {
			this.messageReadyToSubmit = true;
			this.captchaVisible = (this.emailReadyToSubmit && this.messageReadyToSubmit && this.nameReadyToSubmit);
			this.captcha.current.style.visibility=  this.captchaVisible===true? "visible" :"hidden";
		} 
		
	
	}
	  
	  
	nameChange = (event) => {
	
		let nameToCheck = event.target.value;
		if(nameToCheck === "" ){       
			this.submitbutton.current.disabled = true;
			this.nameReadyToSubmit = false;
			this.captchaVisible = (this.emailReadyToSubmit && this.messageReadyToSubmit && this.nameReadyToSubmit);
			this.captcha.current.style.visibility=  this.captchaVisible===true? "visible" :"hidden";
		}
		
		else {
			this.nameReadyToSubmit = true;
			this.captchaVisible = (this.emailReadyToSubmit && this.messageReadyToSubmit && this.nameReadyToSubmit);
			this.captcha.current.style.visibility=  this.captchaVisible===true? "visible" :"hidden";
		}
			
	}
	  
	render() {
		return (
		<div>
			<div style = {{paddingTop:this.props.distanceFromTop}} className = "write-to-us-container"> 
				<div ref= {this.thanksarea} className="thanksarea">
					<h2>Thanks for contacting us!</h2> 
					<p>You will soon receive an email as a receipt of your query. You'll be contacted within one working day.</p> 
					<Link to ="/"><button>Back to home</button></Link>
				</div>           
				<form ref={this.writetousform} className="write-to-us-form" onSubmit={this.submitForm}>					 
					<p>Name <span title="Field required">*</span></p>
					<input ref={this.customerName} placeholder="Insert your name" name="name" type="text" onChange={this.nameChange}/>
					<p>Email <span title="Field required">*</span></p>
					<input ref={this.email} placeholder="Insert a valid email" name="email" type="text"  onChange={this.emailChange} />                  
					<p className="cont-invalid-email"  ref = {this.emailvalidator} hidden>You have entered an invalid email</p>
					<p>Message <span title="Field required">*</span> </p>
					<div className="write-to-us-area">
					<div ref={this.spinner} className="write-to-us-spinner"></div>
					<textarea  ref={this.custmessage} rows="15" placeholder="Please write your message here..." name="message" type="text"  onChange={this.messageChange} ></textarea>
					</div>
					<div className= "write-to-us-submit">
						<div ref={this.captcha} className = {this.captchaVisible ? "captcha-visible":"captcha-hidden"} >
							<div className="g-recaptcha" data-callback="recaptcha_callback" data-sitekey="6LfdDkYUAAAAAHM-ALhAlntRCDTH4st8x376wlq0"></div>   
						</div>
						<input id ="submitbuttonid" ref={this.submitbutton} value="Send your message"  type = "submit"/>
					</div>
					<p style={{color:"red",display:"none"}} ref={this.sendunsuccessful}>You were unsuccessful, please try again.</p>
					
				</form> 
			</div>     
		</div>
		);
	}

}

export default EmailForm;