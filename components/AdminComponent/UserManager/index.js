import React, { Component } from "react";
import "./styles.css";
import PropTypes from "prop-types";// To render available the state in the component

class UserManager extends Component {
	static contextTypes = {store: PropTypes.object}; 
	 constructor(props) {
		super(props);
		this.users = {};
    } 
    
    render() {
        return (
            <p>User management</p>
        )
    }
}

export default UserManager;