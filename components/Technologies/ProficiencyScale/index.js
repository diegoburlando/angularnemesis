import React, { Component } from 'react';
import  './styles.css';
import Star from './Star/index'

class ProficiencyScale extends Component {
  
  constructor(props) {
    super(props);
    this.widthStars= {width: this.props.widthStars};
    this.stars = [];
    this.interEnter = {};
    this.interExit ={};    
    this.counter=0;
    this.unmounted=false;
    this.num = this.props.number;
    this.state= {
      hover:false,test:0      
    }
  };


componentWillUnmount() {
  this.unmounted=true;
}
 
componentDidMount() {}
 

hideStars = (event) => {
  if(!this.unmounted){
event.stopPropagation(true);
clearInterval(this.interEnter);
this.interExit = setInterval(()=> {
 if(!this.unmounted){  
      if(--this.counter === 0) { clearInterval(this.interExit); }        
        this.stars.pop();
       this.setState({test:this.counter})  }   
    },50);
    this.setState({ hover:false}); 

    }   
  };



  displayStars = (event) => {  
  if(!this.unmounted){  
    event.stopPropagation(true);
    this.stars=[];
    this.counter = 0;
    clearInterval(this.interExit);

    if (this.stars.length === this.props.numberOfStars) return; 
    this.setState({ hover:true});    
    this.interEnter = setInterval(()=> {
      if(!this.unmounted){
      if(++this.counter === this.props.numberOfStars) { clearInterval(this.interEnter); }        
        this.stars.push((()=>{
        return ( <Star key ={this.counter}/> )
        })())

       this.setState({test:this.counter})   }  
    },100); 
  }
  };



  render() {      
      return (

        <div onMouseEnter ={this.displayStars} onMouseLeave = {this.hideStars}  className= "pr-hoverPopUp">
            <p>{this.props.tecName}  <i className="fa fa-angle-down" aria-hidden="true"></i></p>
            <div className="pr-popUp">
                <p>Our proficiency level:</p>
                <div style= {this.widthStars} className="pr-starsContainer" >{this.stars}</div>
                <p>Years of experience:</p>
                <h2>{this.props.experienceYears}</h2>
            </div>
          </div>
      
      )
    }
  }


export default ProficiencyScale;
