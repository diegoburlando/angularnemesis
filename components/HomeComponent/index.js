import React, { Component } from "react";
import "./styles.css";
import Carousel from "./CarouselComponent/index";
import ES567 from "./ES567Component/index";
import Microservices from "./MicroservicesComponent/index";
import Specialties from "./SpecialtiesComponent/index";
import logo from "./images/home-windRose.png";
import lighthouse from "./images/lighthouse.png";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";// To render available the state in the component
import { TrackState } from "../../state/tracker";
import titles from "../../appData/titlesAndQuotes";


class Home extends Component {
	static contextTypes = {store: PropTypes.object}; 
	constructor (props) {
		super(props);		
		this.state = {width:null, theme:""};
		this.title = React.createRef();
		this.boatdesc = React.createRef();
		this.lightdesc = React.createRef();
		this.lightdesc2 = React.createRef();
		this.titles = titles.titles;
		this.titleInterval = null;
		this.titleTimeout = null;
		this.counter = 1;
		this.unsubscribe = null;
	};

	chooseRandomTitle = () => {	
		this.title.current.style.opacity="0";	
		this.titleTimeout = setTimeout(()=>{ 
			if (this.counter === this.titles.length) this.counter = 0;	
			this.title.current.innerHTML = this.titles[this.counter];
			this.counter++;
			this.title.current.style.opacity="1";
		}, 800);
	}

	componentWillUpdate() {
		clearInterval(this.titleInterval);
	}
	componentDidUpdate() {
		this.titleInterval = setInterval(this.chooseRandomTitle, 5000);
	}
		
	componentWillMount() {
		window.scrollTo(0, 0);
	}

	observeState = () => {
		this.setState({			
			theme:this.context.store.getState().theme
		}); 
	}

	componentDidMount() {
		
		this.unsubscribe  = this.context.store.subscribe(this.observeState);
		this.titleInterval = setInterval(this.chooseRandomTitle, 5000);
		TrackState(this.context.store,"Home");
		this.handleScroll();
		window.addEventListener("scroll", this.handleScroll);

	}

	handleScroll =  (event)=> {
		//let scrolled = window.pageYOffset; 
		//Paragraph next to the boat appears 

		let desc = this.boatdesc.current;     
		if ((desc.getBoundingClientRect().top + 100) <= window.innerHeight)   {
			desc.style.opacity = "1";
			desc.style.marginTop = "0";
		}

		let light = this.lightdesc.current;
		if ((light.getBoundingClientRect().top + 100) <= window.innerHeight)   {
			light.style.opacity = "1";
			light.style.marginTop = "0";
		}

		let light2 = this.lightdesc2.current;
		if ((light2.getBoundingClientRect().top + 100) <= window.innerHeight)   {
			light2.style.opacity = "1";
			light2.style.marginTop = "0";
		}
	}

	

	componentWillUnmount() {
		window.removeEventListener("scroll", this.handleScroll);
		clearInterval(this.titleInterval);
		clearTimeout(this.titleTimeout);
		this.unsubscribe();		
	}
  
	render() {
		return (
			<div  className = "container" >				
				<div className = {this.state.theme === "light" ? "firstDiv div1-light": "firstDiv div1-dark"}>
					<div><Carousel /></div>
					<div className = "edge-logo">
						<img alt="logo" src={logo} className = "edgeRose"/>
					</div> 
					<div>
						<h1 style={{transition:"all 0.8s linear"}} ref={this.title} >Innovating the IT</h1>
						<blockquote>
						<p>&ldquo;<i> Constant refinement of the former self is relentless; there is no limit to how much one can improve through ceaseless study. </i>&rdquo;</p>
						<footer style = {{textAlign:"right"}}>- DiegoMary, 2018</footer>
					</blockquote>
					</div>
				</div>        
				<div className={this.state.theme === "light"?"secondDiv div2-light": "secondDiv div2-dark"}>
					<div className="boatimg"></div>
						<div ref={this.boatdesc} className="boatdesc">
						<h1>A cutting edge team</h1>
						<hr/>
						<p>Deploying the latest technologies</p>
						<p>We are fully Agile and XP, delivering projects of extreme high quality following best practices and SOLID principles. 
							Our favourite technologies are the cutting edge ones capable of providing new solutions
							to former problems, and render simpler what was once complex. </p>
						<Link className = {this.state.theme==="light" ? "orange-button home-btn-light":"home-btn-dark"} to="/work"><button>Development</button></Link>

					</div>
					<div className={this.state.theme === "light"?"sun":"moon"}></div>
					<div className="skyscrapers"></div>
					<div className="fish fish1anim"></div>
					<div className="fish fish2anim"></div>
					<div className="fish fish3anim"></div>
					<div className="fish fish4anim"></div>
				</div>
				<div className={this.state.theme === "light"?"thirdDiv thirdDiv-light": "thirdDiv thirdDiv-dark"} >
					<blockquote>
						<p><b><i>A proficient action that can be tackled against
							Software fragility is to dedicate one or more
							members of a team to efficient refactoring.
							Sprints can be partially dedicated to anti
							fragility measures. The people committed 
							to work on such an important task should be specialists in
							design patterns and master SOLID principles, and, if in pair,
							work together to address fragility, needless
							complexity, unwanted repetition, opacity, and 
							promote code reusability.</i></b></p>
						<footer style = {{textAlign:"right"}}>- Diego, 2016</footer>
					</blockquote>
				</div>

				<ES567/>
				<Specialties/>
				<Microservices/>
				<div className={this.state.theme === "light"?"longDesc longDesc-light": "longDesc longDesc-dark"} >
					<p>Our initial passion for Microsoft and Linux has left room to new technologies
						 like Responsive Web Design using new frontend MVVM tools, React.js, Angular up to version 7,
						  and Isomorphic React.js with an always-open eye on what is new. On the backend 
						  side we can be trusted on our long experience with C# and Node.js. </p>
					<hr></hr>
					<div className = "longDesc-columns"><p>We are mastering all the steps of Continuous Integration on many different cloud
						 hosting providers: Azure, AWS, ServiceNow, Appharbor, Heroku, OpenShift. Also worked with IOC
						  containers like Structure Map, Castle Windsor, Ninject following best practices
						   of dependency injection in very TDD oriented environments; examples include
						    Mocking frameworks like Moq and Node.js tools for Visual Studio up to 2017. 
							In terms of cloud computing our offerings are authoritative experience on 
							Amazon AWS web services and in particular EC2, RDS, S3, SNS, ElasticSearch, 
							and The AWS administration tools for security role and membership through policing. </p>
					<p>Our appetite for design patterns and DDD have given huge positive impact on our
						 presentations, whether in C# or Javascript. There is also a very good
						  inclination for managing small to medium teams of developers in agile environment.
						   A potential Scrum manager role could be enhanced by being hands on code. 
						   What motivates us the most is to be given responsibility, and trust and apply what
						    we have learned so far to improve or implement new features. Always highly efficient
							 and subtle interacting with stakeholders. Domain driven development is always at the
							  top of our priorities, and through its analysis our choices become expendable.</p>
					</div>
      

				</div>
          
        
				<div className={this.state.theme === "light"?"fourthDivText div4-light": "fourthDivText div4-dark"}> 

					<div ref={this.lightdesc} className="lightdesc lightdesc1">
						<h1>A cooperative environment</h1>
						<hr/>
						<p>fully Agile Software development team</p>

						<p>We are passionate developers and our expertise is the result of more than 25 years of work, self study, courses and completion of great projects on the Microsoft and UNIX stack</p>
         
						<Link className = {this.state.theme==="light" ? "orange-button home-btn-light":"home-btn-dark"} to="/about"><button>About us</button></Link>
					</div>

					<div className = "lightcontainer"><img src={lighthouse} className = "lighthouse" alt= "lighthouse" />
					</div>
					<div ref={this.lightdesc2} className="lightdesc lightdescgreen">
						<h1>Accomplishments and productivity</h1>
						<hr/>
						<p>Tenacity and love for details are our main driving forces</p>
						<p>It is good to fully devote ourselves to getting the best results when we can use our experience to build or update a new environment</p>
          
						<Link className = {this.state.theme==="light" ? "orange-button home-btn-light":"home-btn-dark"} to="/contacts"><button>Contacts</button></Link>
					</div>
            
           
				</div>
			
			</div>
		);
	}
}

export default Home;
