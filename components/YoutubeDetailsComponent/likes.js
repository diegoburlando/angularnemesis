import React, {Component } from "react";// eslint-disable-line no-unused-vars
import "./styles.css";

class Likes extends Component {
	constructor(props) {
		super(props);		 
		this.likes = parseInt(this.props.likes, 10);		  
		this.dislikes= parseInt(this.props.dislikes, 10);
		this.total = this.likes + this.dislikes;
		this.divLikes = {
			backgroundColor:"green",
			width: `${(this.likes*100)/this.total}px`
		};
	}

	render () {		
		return(
			<div className = "dislikes">
				<div style={this.divLikes}></div>
			</div>
		);
	}

}

export default Likes;