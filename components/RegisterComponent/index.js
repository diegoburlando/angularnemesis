import React, { Component } from "react";// eslint-disable-line no-unused-vars
import  "./styles.css";
import classNames from "classnames";
import PropTypes from "prop-types";// To render available the state in the component
import { TrackState } from "../../state/tracker";
import apiConfig from "../../apiconfiguration/apiconfig";
import cookieHelper from "../../apiconfiguration/cookiehelper";

class Register extends Component {
	static contextTypes = {store: PropTypes.object};
    constructor(props) {
        super(props);       
        this.username="";
        this.firstname="";
        this.lastname="";
        this.email="";
        this.address1="";
        this.address2="";
        this.city="";
        this.postalcode="";
        this.country="";
        this.password1 ="";
        this.password2 = "";
        this.recaptcha ="";
        
        this.state = {            
            registered:false,
            cannotRegister:false,
            usernameExists:null,
            fetchingUsername:false,
            emailExists:null,
            fetchingEmail:false,
            theme:""
        }   
    };

    checkEmail = (event) => {
        this.refs.emailspan.style.visibility='hidden';
        this.email = event.target.value;
        if(this.email === "" ){ this.refs.emailvalidator.style.display="none";  }
        else if ( !this.validateEmail(this.email)) {this.refs.emailvalidator.style.display="inline-block";}
        else {this.refs.emailvalidator.style.display="none";  }
    };

    checkPassword2 = (event) => {
        this.password2 = event.target.value; 
        if (this.password2 !== this.refs.password1.value) event.target.style.backgroundColor = '#ffdae0';
        else event.target.style.backgroundColor = '#b1ffb1'        
    };

    checkPassword1 = (event) => {
        this.password1 = event.target.value;
        this.emptyPassword2();
        if (!this.validatePassword(this.password1)) {
            event.target.style.backgroundColor = '#ffdae0';
        }
        else event.target.style.backgroundColor = 'white';
    };

    emptyPassword2 = () => {
        this.refs.password2.value = "";
        this.refs.password2.style.backgroundColor = 'white';
        this.password2 = "";
    }

    validateEmail = (email) => {
		let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
    }
    
    validatePassword = (password) => {
        let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return regex.test(password);
    }

    checkUserData = () => {
        if (this.username !== "" &&  
        this.firstname !== "" && 
        this.lastname !== "" &&  
        this.email !== "" &&  
        this.password1 !== "" &&
        this.password2 !== "" &&
        this.recaptcha !== "" &&
        this.validateEmail(this.email) &&
        this.password1 === this.password2 &&
        this.validatePassword(this.password1) &&
        !this.state.emailExists &&
        !this.state.usernameExists 
    )  {
        return true;
    }
    return false;
    }  
    
    fetchUsernameEmail = (usernameemail) => {
        return fetch( apiConfig.checkUserNameEmailUrl,{ 
            method: "POST",credentials: 'include', 
            body: JSON.stringify({
                usernameemail:usernameemail
            }),
            headers: {
                'Content-type':'application/json',
                'csrf-token' : cookieHelper().getCookie('XSRF-TOKEN')              
            }
        });
    };

    responseHandling = (response) => {
        if (response.status >= 400) return "error"; 
        return response.json() 
    };
    
    
    usernameBlur = (event) => {
        if(event.target.value !== '') {
            this.setState({fetchingUsername:true})
            this.fetchUsernameEmail(event.target.value)
            .then(this.responseHandling) 
            .then(data => {
                this.setState({fetchingUsername:false})
                if (data.userExists) {
                    this.refs.username.style.backgroundColor = '#ffdae0';
                    this.setState({usernameExists:true})
                }  
                else   {
                    this.refs.username.style.backgroundColor = 'white';   
                    this.setState({usernameExists:false}) 
                }         
            })         
        }
        else {
            this.refs.username.style.backgroundColor = 'white';
            this.setState({usernameExists:null})
        }
    }

    emailBlur = (event) => {
        if (event.target.value !== '' && this.validateEmail(event.target.value)) {
            this.refs.emailspan.style.visibility='visible';            
            this.setState({fetchingEmail:true});
            this.fetchUsernameEmail(event.target.value)
            .then(this.responseHandling) 
            .then(data => {
                this.setState({fetchingEmail:false})
                if (data.userExists) {
                    this.refs.email.style.backgroundColor = '#ffdae0';
                    this.setState({emailExists:true})
                }  
                else   {
                    this.refs.email.style.backgroundColor = 'white';   
                    this.setState({emailExists:false}) 
                }         
            })         

        }
        else {
            this.refs.email.style.backgroundColor = 'white';
            this.setState({emailExists:null})
        }
    }

    register = () => {          
        let cp = document.getElementsByName("g-recaptcha-response");        
        this.username = this.refs.username.value;
        this.firstname = this.refs.firstname.value;
        this.lastname = this.refs.lastname.value;
        this.email = this.refs.email.value;
        this.password1 = this.refs.password1.value;
        this.address1 = this.refs.address1.value;
        this.address2 = this.refs.address2.value;
        this.city = this.refs.city.value;
        this.postalcode = this.refs.postalcode.value;
        this.country = this.refs.country.value;
        this.recaptcha = cp[0].value;

        if (this.checkUserData()) {
            this.refs.loader.style.display='block';
            fetch(apiConfig.registerUrl,{ 
                method: "POST", credentials: 'include',  
                body: JSON.stringify({
                    username:this.username, 
                    userfirstname:this.firstname,
                    userlastname:this.lastname,
                    useremail:this.email,
                    userpassword:this.password1,
                    useraddress1:this.address1,
                    useraddress2:this.address2,
                    usercity:this.city,
                    userpostalcode:this.postalcode,
                    usercountry:this.country,
                    recaptcha:this.recaptcha
                }),     
                headers: {
                  'Content-type':'application/json',
                  'csrf-token' : cookieHelper().getCookie('XSRF-TOKEN')            
                }
            })
            .then(this.responseHandling)              
            .then(data => {
                this.refs.loader.style.display='none';
                if (data.success) {
                    this.setState({
                        registered:true
                    })
                }
                else {this.setState({
                    cannotRegister:true
                });}
            })
        } 
        else {this.setState({
            cannotRegister:true
        });}
    }

	componentWillMount() {
		window.scrollTo(0, 0);
	}
	componentDidMount() {	
        this.observeState();        
        TrackState(this.context.store,"Register");
        this.unsubscribe = this.context.store.subscribe(this.observeState);
        let googlecaptcha = document.createElement('script');
		googlecaptcha.src = apiConfig.googlecaptcha; 
        document.head.appendChild(googlecaptcha);
        let googlecaptchaCallback = document.createElement('script');
		googlecaptchaCallback.src = "captchacallback.js";
		document.head.appendChild(googlecaptchaCallback);		
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
        let usernameSpanClasses = classNames({
            "usernameSpanFetching":this.state.fetchingUsername,
            "register-hide":this.state.usernameExists === null && !this.state.fetchingUsername,
            "usernameSpan":true,
            "usernameExistsTrue" :this.state.usernameExists && !this.state.fetchingUsername,
            "usernameExistsFalse" :!this.state.usernameExists && !this.state.fetchingUsername
        });
        let emailSpanClasses = classNames({
            "usernameSpanFetching":this.state.fetchingEmail,
            "register-hide":this.state.emailExists === null && !this.state.fetchingEmail,
            "usernameSpan":true,
            "usernameExistsTrue" :this.state.emailExists && !this.state.fetchingEmail,
            "usernameExistsFalse" :!this.state.emailExists && !this.state.fetchingEmail
        });
		return (
			<div className = {this.state.theme === "light"?"register-form-container-light register-form-container":"register-form-container-dark register-form-container"}>
                <div className = {!this.state.registered ? "register-form":"register-block"}>
                    <h1>Sign up!</h1>
                    <p>Please fill in the mandatory fields, and if you like even the optional ones.</p>
                    <div className = "register-two-sec">
                        <section className = "register-mandatory-sec">
                            <p>Username</p> 
                            <div ref = "usernamespan" className = {usernameSpanClasses}>
                                <p className = {(this.state.usernameExists && !this.state.fetchingUsername) ? "":"register-hide"}>Username already exists</p>
                            </div>
                            <input ref = "username" type="text" onBlur = {this.usernameBlur}/>
                            <p>First Name</p>
                            <input ref = "firstname" type="text"/>
                            <p>Last Name</p>
                            <input ref = "lastname" type="text"/>
                            <p>Email</p> <span className="register-invalid-email"  ref = "emailvalidator" >Invalid email</span>  
                            <div ref = "emailspan" className = {emailSpanClasses}>
                                <p className = {(this.state.emailExists && !this.state.fetchingEmail) ? "":"register-hide"}>Email already exists</p>
                            </div>
                            <input ref = "email" type="text" onChange = {this.checkEmail} onBlur = {this.emailBlur}/>                                         
                            <p>Password</p><div id = "register-password-info">i<p id = "info-popup">Password must be at least 8 characters long, must include uppercase and lowercase letters, and at least one number.</p></div>                         
                            <input ref = "password1" type="password" onChange = {this.checkPassword1}/>
                            <p>Confirm Password</p>
                            <input ref = "password2" type="password" onChange = {this.checkPassword2}/>
                            
                        </section>
                        <section className = "register-optional-sec">
                            <p>Address1</p>
                            <input ref = "address1" type="text"/>
                            <p>Address2</p>
                            <input ref = "address2" type="text"/>
                            <p>City</p>
                            <input ref = "city" type="text"/>
                            <p>Postal Code</p>
                            <input ref = "postalcode" type="text"/>
                            <p>Country</p>
                            <input ref = "country" type="text"/>
                            <span className = {this.state.cannotRegister ? "cannot-register":"register-hide"}>Cannot create user!</span>
                        </section>
                    </div>
                    <div className = "register-submit-recaptcha">
                        <div ref="captcha" className = "captcha-visible">
                            <div className="g-recaptcha" data-callback = "recaptcha_callback_register" data-sitekey="6LfdDkYUAAAAAHM-ALhAlntRCDTH4st8x376wlq0"></div>   
                        </div>    
                        <div ref = "loader" className = "register-loader"></div>                
                        <button id="registerbutton" onClick = {this.register}>Register</button>
                    </div>
                </div>
                <div className = {this.state.registered ? "register-email-confirmation":"register-block"}>
                    <div>
                        <p>Thank you for signing up!</p>
                        <p> A confirmation email has been sent to {this.email}. If you cannot find it in your inbox, please check your junk folder.</p>
                    </div>
                </div>
			</div>
		);
	}
}
export default Register;