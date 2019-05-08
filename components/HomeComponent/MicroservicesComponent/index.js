import React, { Component } from "react";
import  "./styles.css";
import PropTypes from "prop-types";

class Microservices extends Component {
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
            <div className = {this.state.theme === "light"?"microservices-container microservices-container-light":"microservices-container microservices-container-dark"}>
                <div className = "es67-description">
                    <h2>"Microservice Architecture is our first choice"</h2>
                    <p>Our proficiency in Microservice Architecture is well founded. Our applications 
                        follow best practices when it comes to hosting services in cloud environments
                        such as AWS, Azure and Google Cloud.
                    </p>
                </div>
                
                <div className = "microservices-drawing">
                    <div className = "microservices-pictures microservices-db db1"></div>
                    <div className = "microservices-pictures microservices-db db2"></div>
                    <div className = "microservices-pictures microservices-db db3"></div>
                    <div className = "microservices-pictures microservices-server server1"></div>
                    <div className = "microservices-pictures microservices-server server2"></div>
                    <div className = "microservices-pictures microservices-server server3"></div>
                    <div className = "microservices-pictures microservices-client"></div>

                    <div className = "dots-container">
                        <div className="microservices-dot dot1">
                            <div className = "microservices-innerdot innerdot1"></div>  
                        </div>
                        <div className="microservices-dot dot2">
                            <div className = "microservices-innerdot innerdot2"></div>  
                        </div>
                        <div className="microservices-dot dot3">
                            <div className = "microservices-innerdot innerdot3"></div>  
                        </div>
                    </div>                
                </div>
                <div className = "microservices-mobile"></div>
            </div>
		);
	}
}
export default Microservices;