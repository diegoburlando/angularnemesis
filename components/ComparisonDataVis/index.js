import React, { Component } from "react";
import "./styles.css";
import ReactDataVis from "./ReactDataVis/index";
import apiConfig from "../../apiconfiguration/apiconfig";
import ReactVsNgLogos from "./ReactVsNgLogos/index";
import {connect} from "react-redux"; 
import PropTypes from "prop-types";
import { TrackState } from "../../state/tracker";

class ComparisonDataVis extends Component {
	static contextTypes = {store: PropTypes.object};
	componentDidMount () { 
		TrackState(this.context.store,"Angular React Comparison");
		
	}
	componentWillMount() {
		window.scrollTo(0, 0);
	}
	
	render() {
		return (
			<div className = "comparisonContainer">
				<h1>Performance comparison</h1>
				<ReactVsNgLogos color = "#101010" /> 
				<p className = "comparisonNotSupported">Not supported on mobile</p>       
				<section className = "reactVsNg">
					<ReactDataVis/>
					<section className = "separatorc"></section>
					<div className = "ngContainer">
						<iframe title="Angular5 example"  src ={apiConfig.angularSite}/>
					</div>					
				</section>  
				   
			</div>
		);
	}
}

function mapStateToProps(state) { return { state: state }; }
export default connect(mapStateToProps)(ComparisonDataVis);