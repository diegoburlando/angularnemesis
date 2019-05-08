import React, { Component } from "react";
import "./styles.css";
import apiConfig from "../../apiconfiguration/apiconfig";
import PropTypes from "prop-types";// To render available the state in the component
import { TrackState } from "../../state/tracker";

class About extends Component {
	
	static contextTypes = {store: PropTypes.object};	 
	componentWillMount() {
		window.scrollTo(0, 0);
	}
	
	componentDidMount () { TrackState(this.context.store,"About");};
	
	render() {
		return (
			<div className="aboutContainer">				
				<h1 className = "nav-component-heading">The team</h1>
				<hr className = "nav-component-hr"/>
				<div className = "peopleContainer">
					<section className = "diegoContainer">
						<h2>Diego Aldo Burlando</h2>						
						<div className = "flame">					
							<div></div>
							<div></div>
						</div>
						<p>Tech Lead</p>
						
						<a  className = "cont-diego-resume cont-resume" title = "Download Diego's CV"  href={apiConfig.diegoCv} > 
						<button>Diego's CV from Google Drive</button>
						</a>					
						<blockquote><p><i>Having me on board for an organization means to hire a passionate
							executive highly versatile with multiple layered skills. As a
							developer with more than 30 years of seniority and a lead architect
							with numerous experiences of business transformation, I can direct
							the IT department with immediate returns of income. A tech lead who
							never contents himself enough to improve the quality of delivery
							of his teams. Outstanding communicator, team mentor efficiently
							hands on code with passionate determination, capable to alternate 
							coding mentoring or sprint sessions
							with the team to dialogues and efficient exposure to business executives,
							PO’s, and Members of the board to sharpen the correct trajectory
							for productivity and customer support...</i></p></blockquote>
						<p> I strongly believe in the power
							of self-discipline and integrity and I work well with juniors and young
							people because I can discover, nurture, and enhance their true potential
							for the benefit of the business and themselves. While looking for my next 
							role I am Studying and training on React, 
							Angular and Full stack coding in general. I invest time in attending 
							forums where best practices in development are followed and implemented.
							 My passion for being hands on code is what makes me so excited to study 
							 and improve.</p>
						<div className="hobbies-for-mobile"> 										
						<h3>Interests & hobbies</h3>
						<ul>
							<li>classic guitar playing</li>
							<li>DIY</li>
							<li>Health</li>
						</ul>							
					</div>			
					</section>
					<section className = "mariaContainer">
						<h2>Maria Valentina Burlando</h2>
						<div className = "flame">					
							<div></div>
							<div></div>
						</div>						
						<p>Web Developer and Designer</p>
						<a className = "cont-maria-resume cont-resume" title = "Download Maria's CV" href={apiConfig.mariaCv}> 
							<button>Maria's CV on Google Drive</button>
						</a>		
						<blockquote><p><i>As a web developer, I need to always be up to date
							That is why my preference is to constantly work
							with the newest cutting edge technologies in order
							to bring to stakeholders the best results possible
							when it comes to developing new Web Applications.
							I’m specialised in Frontend development with an
							ongoing study of Backend technologies as well.
							I’m a keen observer and very oriented towards
							the artistic side of design if required. Expert
							in data visualisation and CSS3 design using generated
							content and the best techniques for responsive
							web development...</i></p> </blockquote>
						<p>I have been under the direct tutelage of senior scrum masters
							 and tech leads who have guided me towards the best ways to develop my code,
							  and towards the improvement of my way of assimilating knowledge, directing
							   me to always follow best practices. Great fan of continuous integration 
							   employing GitHub and BitBucket, using Webhooks to deploy directly to OpenShift
							    and Azure, and a keen follower of SOLID principles.</p>
									
					</section>					
				</div>	

				<div className = "hobbies-align-bottom">
					<div> 										
						<h3>Interests & hobbies</h3>
						<ul>
							<li>classic guitar playing</li>
							<li>DIY</li>
							<li>Health</li>
						</ul>							
					</div>	

					<div>						
						<h3>Interests & hobbies</h3>
						<ul>
							<li>flute playing</li>
							<li>writing stories</li>
							<li>drawing and designing</li>
						</ul>							
					</div>		
				</div>
			</div>
		);
	}
}
export default About;