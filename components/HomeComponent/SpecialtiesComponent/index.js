import React, { Component } from "react";
import  "./styles.css";
import PropTypes from "prop-types";

class Specialties extends Component {
	static contextTypes = {store: PropTypes.object};
    constructor(props) {
        super(props); 
        this.unsubscribe=null;
        this.state = {
            theme:""
        }       
    }

    componentDidMount() {  
        this.observeState();
        this.unsubscribe  = this.context.store.subscribe(this.observeState);           
    }

    observeState = () => {
        this.setState({
            theme:this.context.store.getState().theme
        })
    }

    componentWillUnmount() {
        this.unsubscribe();		
	} 	
    
	
	render() {
		return (
            <div className = {this.state.theme === "light"?"specialties-container specialties-container-light":"specialties-container specialties-container-dark"}>
                <div className="es67-description">
                    <h2>The Development Lifecycle</h2>
                    <p>We  easily cover the development lifecycle of an application thanks to our proficiency in 
                        all fields of software design. From frontend prototyping to database management we are 
                        proud to display an array of different skills that ensure quality and success.</p>
                </div>
                <div className = "specialties-grid">
                    <div className = "specialties-frontend">
                        <h3>Frontend</h3> 
                        <ul>
                            <li>React.js</li>
                            <li>Angular</li>
                            <li>ES6/7</li>
                            <li>HTML5</li>
                            <li>CSS3</li>
                            <li>Redux</li>
                            <li>Meteor.js</li>                            
                            <li>TypeScript</li>
                        </ul>
                    </div>
                    <div className = "specialties-backend">
                        <h3>Backend</h3>  
                        <ul>
                            <li>Node.js</li>
                            <li>C#</li>
                            <li>ASP.Net/ASP.Net Core</li>
                            <li>.Net/.Net Core</li>
                            <li>Java</li>                            
                        </ul>                    
                    </div>
                    <div className = "specialties-cloud">                        
                        <h3>Cloud and Platforms</h3> 
                        <ul>
                            <li>AWS</li>
                            <li>Azure</li>
                            <li>Google Cloud</li>
                            <li>OpenShift</li>
                            <li>Cloud9</li>
                            <li>Heroku</li>   
                            <li>GitHub</li>  
                            <li>BitBucket</li>                           
                        </ul>
                    </div>
                    <div className = "specialties-db">
                        <h3>Database</h3>                          
                        
                        <ul>
                            <li>SQL Server</li>
                            <li>MySQL</li>
                            <li>MongoDB</li>
                            <li>RedisDB</li>
                            <li>RDS</li>
                            <li>DynamoDB</li>   
                            <li>Oracle</li>                                                      
                        </ul>
                    </div>
                </div>

            </div>
		);
	}
}
export default Specialties;