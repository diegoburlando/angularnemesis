import React, { Component } from "react";// eslint-disable-line no-unused-vars
import  "./styles.css";
import PropTypes from "prop-types";// To render available the state in the component


class Journal extends Component {
	static contextTypes = {store: PropTypes.object};
    constructor(props) {
		super(props);
		this.entries =[];	
		this.state = {
			test:false		
		}
	}

	// base64 encoded ascii to ucs-2 string
	atou = (str) => {
		return decodeURIComponent(escape(window.atob(str)));
	}
	

	componentCleanupWhenRefreshed = () => {
		let history = this.props.entries.map(entry => entry.isOpen);		
		localStorage.setItem("journal_state", JSON.stringify(history.reverse()));	
		window.removeEventListener('beforeunload', this.componentCleanupWhenRefreshed);
	}

	componentWillMount() {
		window.scrollTo(0, 0);			
		let history = JSON.parse(localStorage.getItem("journal_state"));		
		if (history == null) return;
		this.props.entries.map((entry, index) => {
		 		entry.isOpen = history[index] === true ? true : false;
		 		return entry;
		}) 		
	}

	componentDidMount() {
		window.addEventListener('beforeunload', this.componentCleanupWhenRefreshed);
	}
	componentWillUnmount() {
		window.removeEventListener('beforeunload', this.componentCleanupWhenRefreshed);		
		let history = this.props.entries.map(entry => entry.isOpen);		
		localStorage.setItem("journal_state", JSON.stringify(history.reverse()) );
	}

	assignCheckedEntry = (event)=> {	
		let index = event.target.id.replace("entry-label-","");
		this.props.entries[index].isOpen = event.target.checked;		
	}
	
   	
	render() {
		this.entries = this.props.entries.reverse().map((entry, index) => {
			return (

				<div key={index} className ="single-entry-container">
					<label htmlFor = {`entry-label-${index}`} > {`${entry.entryTitle} ${entry.entryDate}`}   </label>
					<input onChange={this.assignCheckedEntry} type = "checkbox" defaultChecked = {entry.isOpen} id={`entry-label-${index}`}/>
					<div className= "entry-label-arrow"></div>
					{/* remember to encode the html using the btoa function before saving
					see fiddle at https://jsfiddle.net/s0e983qx/					
					*/}
					<div className = "single-entry-text" dangerouslySetInnerHTML = {{ __html: this.atou(entry.entryText) }}></div>
				</div>
			)
		});		

		return (
			<div>
				{this.entries}
			</div>
		)
	}
}
export default Journal;