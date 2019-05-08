import React, { Component } from "react";
import "./styles.css";

class Star extends Component {
  
	constructor(props) {
		super(props);    
		this.state= {
			hover:true,test:0      
		};
	}    

	componentDidMount() {}

	render() {      
		return (
			<svg width="20" height="20">
				<g>
					<title>Layer 1</title>
					<polygon className= "st-starComponent st-svgstyle" stroke="#000000" id="svg_7" fill="#ff7f00" points="10.016265422402057,0.11346621811389923 12.456279615463927,7.51365327835083 19.88632494521312,7.673274993896484 13.96428980482574,12.406464576721191 16.116301382806114,19.905298233032227 10.016265422402057,15.430386543273926 3.9162337617424328,19.905298233032227 6.068243906474663,12.406464576721191 0.14620721340179443,7.673274993896484 7.576254095836475,7.51365327835083 10.016265422402057,0.11346621811389923 12.456279615463927,7.51365327835083 " strokeWidth="5" strokeOpacity="0"/>
				</g>
          Sorry, your browser does not support inline SVG.
			</svg>
		);
	}
}
  
export default Star;
