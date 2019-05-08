import React, { Component } from 'react';
import StarrySky from './StarrySkyComponent/index';
import classNames from 'classnames';
import './styles.css';
import {RandomDatesGenerator} from './randomdatesgenerator';
import apiConfig from "../../apiconfiguration/apiconfig";

import PropTypes from 'prop-types';// To render available the state in the component
import { TrackState } from '../../state/tracker';

class NasaApodsComponent extends Component {
  static contextTypes = {store: PropTypes.object};

  constructor(props) {    
    super(props);
    this.timer = {};
    this.state = {
      apods:[], 
      arrayEnd: false, 
      activeIndex : undefined, 
      explIndex : undefined, 
      loading:false
    };
    this.endDate = new Date();
    this.today = new Date();
    this.rd = {};  
    //this.arrayOfDates = [];   
    this.startDate = new Date(); 
  };

  componentWillMount() {
    window.scrollTo(0, 0);
  }

  getStartDate = (endDate) => {
    this.startDate = this.rd.subDays(endDate, 14);
  };

  randomApods = () => {    
    let randomDatesGen = this.rd.randomDates();
    if (typeof randomDatesGen === 'undefined') {
      this.randomApods();      
    }
    else {
      this.startDate = randomDatesGen.startDate;
      this.endDate = randomDatesGen.endDate;      
      this.fetchData();
    }
  };

  prevApods = () => {
    this.endDate = this.rd.subDays(this.startDate, 1);
    this.getStartDate(this.endDate); 
    this.fetchData();
  };

  nextApods = () => {    
    this.startDate = this.rd.addDays(this.endDate,1);    
    this.endDate = this.rd.addDays(this.startDate,14);    
    this.fetchData();
  };

  todayApods = () => {
    this.endDate = this.today;
    this.getStartDate(this.endDate); 
    this.fetchData();
  };

  componentDidMount() {
    TrackState(this.context.store,"Nasa Apods");    
    this.rd = new RandomDatesGenerator(1996,2018);       
    this.getStartDate(this.endDate);    
    this.fetchData();    
  };

  fetchData = () => {  

    this.setState({loading:true});     
    let encode = encodeURIComponent;
    let key = {
      api_key:'IDEmxsrJV481UMuno4ML82JwUcgmjkZPf45nW6rC',
      start_date:this.startDate.toISOString().substring(0, 10),
      end_date:this.endDate.toISOString().substring(0, 10),
    };     
    let query = `?${Object.keys(key).map(k => `${encode(k)}=${encode(key[k])}`).join('&')}`; 
    let status = {};
    fetch(apiConfig.nasaApods.concat(query), { method: "GET" })
    .then(response => {
      if (response.status >= 400) {
        status = response.status;
        console.log(response.status);        
      }
      return response.json();
    })
    .then(apods => {
      if(status !== 500) {
        this.setState({ apods: apods, loading:false});
      }         
      else {
        this.randomApods();
      }
    });        
    
  };
  handleClick = (index) => {
    this.setState({activeIndex : index});    
  };

  setUndefined = (undef) => {
    this.setState({activeIndex : undef, explIndex: undef});
  };

  explClick = (index) => {
    if (typeof this.state.explIndex === 'undefined') this.setState({explIndex : index});
    else this.setState({explIndex : undefined})
  }

  render() {
    let nextTodayButtonClasses = classNames({
      "ap-pagButton": true,
      "ap-hideButton": (this.endDate.getTime() >= this.today.getTime()),        
      });

    let prevButtonClasses = classNames({
      "ap-pagButton": true,
      "ap-hideButton": (this.endDate.getTime() <= new Date('1996-01-16')),        
      });

    

    let apods = this.state.apods.map((apod, index) => {
      let apodsClasses = classNames({
        "ap-item": true,
        "ap-clicked": this.state.activeIndex === index,
        "ap-itemLarge": (index === 3 || index === 5),
        "ap-itemMedium": ((index % 3) === 0),
        "ap-itemFull": (index === 6),
      });    
      let explClasses = classNames({
      "ap-apodExplanation": true,
      "ap-largeExplanation": this.state.explIndex === index,        
    });        

      if (apod.media_type === 'video') {

        return (

          <div key = {index} onClick = {this.handleClick.bind(this, index)} className= {apodsClasses}>
            
            <div onClick = {this.explClick.bind(this, index)} className = {explClasses}>
              
              <p>{apod.date}</p>
              <p>{apod.explanation}</p>
            </div> 
            <iframe title = {apod.title} width= "100%" height="90%" src = {apod.url}/>
            
          </div>
        )
      }

      else {

      return (
        <div key = {index} onClick = {this.handleClick.bind(this, index)} className= {apodsClasses}  style= {{backgroundImage:'url(' + apod.url + ')'}}>
          
          <p>{apod.title}</p>  
          <div onClick = {this.explClick.bind(this, index)} className = {explClasses}>
            <p>{apod.date}</p>
            <p>{apod.explanation}</p>
          </div> 
        </div>
      );}
    });

    return (
      <div className="ap-apodContainer">
        <StarrySky  />
        <div ref="loader" className = {this.state.loading ? "ap-loader" : "ap-hideButton"}>
          <div></div>
        </div>
        <div onClick = {this.setUndefined.bind(this, undefined)} className = {typeof this.state.activeIndex !== 'undefined' ? "ap-darkVeil" : "ap-hideVeil"}></div>
        <div className = {this.state.loading ? "ap-hideButton" : "ap-show"} >
        <div className = "ap-headerTitle">
          <p>{this.startDate.toISOString().substring(0, 10)}</p>
          <h1 className="ap-apodTitle">Apods from Nasa</h1>
          <p>{this.endDate.toISOString().substring(0, 10)}</p>
        </div>
        <div className = "ap-pagination">
        
        <button onClick = {this.prevApods} className = {prevButtonClasses}><i className="fa fa-chevron-circle-left fa-fw" aria-hidden="true"></i> Previous</button>
        <button onClick = {this.nextApods} className = {nextTodayButtonClasses}>Next<i className="fa fa-chevron-circle-right fa-fw" aria-hidden="true"></i></button>
        <button onClick = {this.randomApods} className = "ap-pagButton">Random <i className="fa fa-random fa-fw" aria-hidden="true"></i></button>
        <button onClick = {this.todayApods} className = {nextTodayButtonClasses}>Today <i className="fa fa-clock-o fa-fw" aria-hidden="true"></i> </button>
        </div>
        <div className = "ap-gridcontainer">
          {apods.reverse()}
        </div>
        </div>
        
      </div>      
    );
  }
}

export default NasaApodsComponent;
