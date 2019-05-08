import React, { Component } from "react";// eslint-disable-line no-unused-vars
import  "./styles.css";
import apiConfig from "../../apiconfiguration/apiconfig";
import PropTypes from "prop-types";// To render available the state in the component
import { TrackState } from "../../state/tracker";
import {loggedIn, notlogged, addLoginClaims} from "../../state/actions";
import cookieHelper from "../../apiconfiguration/cookiehelper";

class Login extends Component {
	static contextTypes = {store: PropTypes.object};
    constructor(props) {
        super(props);
        this.usernameemail = "";
        this.state = {
            theme:""
        }
    }

    componentDidMount() {
        //this.observeState();
        this.setState({			
			theme:this.context.store.getState().theme			
        }); 	        
        TrackState(this.context.store,"Login");
        this.unsubscribe = this.context.store.subscribe(this.observeState);        
    }

    componentWillUnmount() {
		this.unsubscribe();		
	}

    observeState = () => {      
        localStorage.setItem('jwt_diegomary', this.context.store.getState().profileClaims.Claims.userToken);
        localStorage.setItem('userclaims_diegomary', JSON.stringify(this.context.store.getState().profileClaims.Claims.userClaims));
        localStorage.setItem('authenticated', this.context.store.getState().authenticated);
	}

    logIn = (event) => {
        event.preventDefault();
        this.refs.invalidcred.style.visibility = 'hidden';
        this.usernameemail = this.refs.usernameemail.value;
        this.userpassword = this.refs.userpassword.value;
        if (typeof this.usernameemail !== 'undefined' && typeof this.userpassword !== 'undefined') {
            this.refs.loader.style.display = 'block';    
            fetch(apiConfig.loginUrl,{ 
                method: "POST", credentials: 'include', 
                body: JSON.stringify({usernameemail:this.usernameemail, userpassword:this.userpassword}),     
                headers: {
                  'Content-type':'application/json',
                  'csrf-token' : cookieHelper().getCookie('XSRF-TOKEN')

                }
            })
            .then(response => {
                if (response.status >= 400) { 
                  console.log(response.status);
                  return;                   
                } 


                return response.json();
            })              
            .then(data => {               

                this.refs.loader.style.display='none';                
                if (data.success) {
                    this.context.store.dispatch(loggedIn());
                    this.context.store.dispatch(addLoginClaims(data.claim, data.token));            
                    this.props.history.push('/profile');                    
                }
                else {
                    this.refs.invalidcred.style.visibility = 'visible';
                    this.context.store.dispatch(notlogged());
                }
            })
        }
    }

	componentWillMount() {
		window.scrollTo(0, 0);
    }
    
    inputOnFocus = () => {
        this.refs.invalidcred.style.visibility = 'hidden';
    }
	
	render() {
		return (
            <form onSubmit = {this.logIn} >
			<div className = {this.state.theme === "light" ? "login-form-container login-form-container-light":"login-form-container login-form-container-dark"}>
                <div className = "login-form">
                <h1>Login</h1>
				<p>Username or email</p>
                <input ref = "usernameemail" type="text" onFocus = {this.inputOnFocus}/>
                <p>Password</p>
                <input ref = "userpassword" type="password" onFocus = {this.inputOnFocus}/>
                
                <div className = "login-button-loader">
                    <div ref="loader"></div>
                    <button className = {this.state.theme === "light" ? "login-form-button-light login-form-button" : "login-form-button login-form-button-dark"} onClick = {this.logIn}>Login</button>
                </div>
                <p ref="invalidcred">Invalid credentials</p>
                </div>
			</div>
            </form>
		);
	}
}
export default Login;