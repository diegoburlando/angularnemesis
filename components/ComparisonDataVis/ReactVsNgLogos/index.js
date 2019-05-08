import React, { Component } from "react";
import "./styles.css";
import reactLogo from "../images/reactlogo.png";
import ngLogo from "../images/angularlogo.png";


class ReactVsNgLogos extends Component {
	

	render() {
		return(
			<div className = "ng-reactVsNgTitle" style = {{color:this.props.color}}>
				<div className ="ng-logos"><img alt="" src={reactLogo}></img><p>React 16</p></div>
				<p>VS</p>
				<div className = "ng-logos"><img alt="" src={ngLogo}></img><p>Angular 5</p></div>
			</div>
		);
	}
}

export default ReactVsNgLogos;