import React, { Component } from "react";
import "./styles.css";
import apiConfig from "../../apiconfiguration/apiconfig";
import PropTypes from "prop-types";// To render available the state in the component
import { TrackState } from "../../state/tracker";

class d3Histogram extends Component {
	static contextTypes = {store: PropTypes.object};
	componentWillMount() {
		window.scrollTo(0, 0);
	}

	componentDidMount () { TrackState(this.context.store,"D3.js Histogram");};

	render() {
		return(


			<div className ="histogramContainer">
				<div>
					<h1>d3.js Custom Histogram Building</h1>
					<h3>Made in Angular 5 cli and Angular Material</h3>
					<iframe title="d3 histogram" src={apiConfig.angularSiteD3}></iframe>
				</div>				
			</div>
		)
	}

}

export default d3Histogram;