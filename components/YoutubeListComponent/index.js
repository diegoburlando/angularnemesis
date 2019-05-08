import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import { fetchYoutubeFeeds, responseHandling } from "./apicalls";

import PropTypes from "prop-types";// To render available the state in the component
import { TrackState } from "../../state/tracker";

class YoutubeListComponent extends Component {
	static contextTypes = {store: PropTypes.object};

	constructor(props) {
		super(props);
		this.data = [];
		this.state = { dataPortion:[],error: false};
		this.detailsData = {};
		this.pageNumber = 1;
		this.pageSize = 5;  
		this.isSelected = {element: null, isSelected : false};   
	}

	  componentWillMount() { window.scrollTo(0, 0); }

  searchFeeds = (event) => {
    event.preventDefault();
    if(typeof this.refs.searchFeed.value === 'undefined') return;
    let criteria = this.refs.searchFeed.value;
    localStorage.setItem('criteria', JSON.stringify(criteria));

    if(!criteria) return;
    this.getFeeds(criteria);    
  };

  acquireFeeds = (json) => {
    if(json === 'error') {this.setState({  error: true}); return};
    this.feedsLength = json.items.length;
    this.numberOfPages = ( this.feedsLength % this.pageSize ) === 0 ? (this.feedsLength /  this.pageSize) : Math.ceil(this.feedsLength /  this.pageSize);  
    this.data= json.items;          
    this.setState({            
    dataPortion: this.data.slice((this.pageNumber - 1) * this.pageSize , this.pageSize * this.pageNumber)
    });
  }

  getFeeds = (criteria) => {
    fetchYoutubeFeeds(criteria).then(responseHandling).then( this.acquireFeeds);
  };

  componentDidMount() {
    TrackState(this.context.store,"Youtube Feeds");  
    let criteria = JSON.parse(localStorage.getItem('criteria'));  
    if(criteria)
    {
      this.refs.searchFeed.value = criteria;
      //localStorage.removeItem('criteria');
      this.getFeeds(criteria);
      return;
    }
    this.getFeeds('es6 tutorial');
  };

  componentWillUnmount() {};
  shouldComponentUpdate(nextProps,nextState) {  return true; };
  componentWillReceiveProps(nextProps) {};

  nextPage =(event) => {
    this.numberOfPages = ( this.feedsLength % this.pageSize ) === 0 ? (this.feedsLength /  this.pageSize) : Math.ceil(this.feedsLength /  this.pageSize);  
    if(this.pageNumber < this.numberOfPages)
    this.pageNumber += 1;
    this.setState({dataPortion: this.data.slice((this.pageNumber - 1) * this.pageSize , this.pageSize * this.pageNumber)});
  };

  prevPage =(event) => {
    this.numberOfPages = ( this.feedsLength % this.pageSize ) === 0 ? (this.feedsLength /  this.pageSize) : Math.ceil(this.feedsLength /  this.pageSize);  
    if(this.pageNumber === 1) return; 
    this.pageNumber -= 1; 
    this.setState({dataPortion: this.data.slice((this.pageNumber - 1) * this.pageSize , this.pageSize * this.pageNumber)});
  };

  pageChange =(event) => {
    this.pageSize = event.target.value;
    this.pageNumber = 1;
    this.numberOfPages = ( this.feedsLength % this.pageSize ) === 0 ? (this.feedsLength /  this.pageSize) : Math.ceil(this.feedsLength /  this.pageSize);  
    this.setState({dataPortion: this.data.slice((this.pageNumber - 1) * this.pageSize , this.pageSize * this.pageNumber)});
  };

  goToPage = (event) => {
    this.pageNumber = parseInt(event.target.dataset.link,10);
    this.setState({dataPortion: this.data.slice((this.pageNumber - 1) * this.pageSize , this.pageSize * this.pageNumber)});
    this.isSelected = { element:this.pageNumber, isSelected: true};
    event.preventDefault();
  };

  goToFirst = (event) => {
    this.pageNumber=1;
    this.setState({dataPortion: this.data.slice((this.pageNumber - 1) * this.pageSize , this.pageSize * this.pageNumber)});
  };

  goToLast = (event) => {
    this.pageNumber = this.numberOfPages;
    this.setState({dataPortion: this.data.slice((this.pageNumber - 1) * this.pageSize , this.pageSize * this.pageNumber)});
  };

	render() {

		if (this.state.error)
			return (
				<div className="App">   
					<h2>An error prevented to read the feeds properly</h2>  
				</div>
			);

		let pages =[];
		for(let i = 1; i <= this.numberOfPages; i++)
		{
			pages.push((()=>{       
				let linkCss = (this.pageNumber === i) ? "linkStyleSelected" : "linkStyle";      
				return (          
					< button onClick= {this.goToPage} className = {linkCss} data-link={i}  key={i}>{i}</button>        
				);
			})());
		}
		let feeds = this.state.dataPortion.map((item)=> {  

			let newdate = item.snippet.publishedAt.slice(0,10);
			let [,year, month, day] = /^(\d{4})-(\d{2})-(\d{2})$/.exec(newdate);           
			let dt  = (new Date(year, (month-1).toString(), day)).toDateString();
              
   
			this.detailsData = {pathname: `/youtube/details/${encodeURIComponent(item.etag.replace(/'?'/g, "%3F"))}`,itemData:item };
			if (item.snippet.title === "Deleted video")
				return (
					<h2 key = {item.etag}>THE VIDEO DOESN'T EXIST ANYMORE</h2>
				);

			if (item.id.playlistId) {
				return (       
					<section className="feedcontainer" key = {item.etag}>
						<Link  to = {this.detailsData}> 
							<div className = "playlist">Playlist</div>        
							<img alt="not found" src = {item.snippet.thumbnails.medium.url} className="feedimg"/>
						</Link>
						<div className="feedtext">
							<Link style={{textDecoration:"none", color:"#393939"}} to = {this.detailsData}>         
								<h2 className="feedtitle">{item.snippet.title}</h2>
							</Link>
							<p className="feeddate">{`Published on ${dt}`}</p>
							<p className="feeddescription"> {item.snippet.description}</p>          
						</div>
					</section>        
				); 
			}
			return (       
				<section className="feedcontainer" key = {item.etag}>
					<Link  to = {this.detailsData}>         
						<img alt="not found" src = {item.snippet.thumbnails.medium.url} className="feedimg"/>
					</Link>
					<div className="feedtext">
						<Link style={{textDecoration:"none", color:"#393939"}} to = {this.detailsData}>         
							<h2 className="feedtitle">{item.snippet.title}</h2>
						</Link>
						<p className="feeddate">{`Published on ${dt}`}</p>
						<p className="feeddescription"> {item.snippet.description}</p>          
					</div>
				</section>        
			); 

		});


		return (    
			<div className = "feedsMain"> 

				<div className = "feedsDiv"> 
					<form onSubmit = {this.searchFeeds} >
						<p><i className="fa fa-youtube-play" aria-hidden="true"></i> Youtube data fetch</p>
						<input placeholder="Search..."type="text" ref="searchFeed"/>               
						<input type="button" value="Search" onClick={this.searchFeeds}/>
					</form>
        
					{feeds}
        
					<div className="pagination">
						<div>
							<button className = "pageButton" onClick= {this.goToFirst}><i className="fa fa-angle-double-left" aria-hidden="true"></i></button>
							<button className = "pageButton" onClick= {this.prevPage}><i className="fa fa-angle-left" aria-hidden="true"></i></button>  
							{pages} 
							<span className = "pagesForMobile">{this.pageNumber} of {this.numberOfPages}</span>
							<button className = "pageButton" onClick= {this.nextPage}><i className="fa fa-angle-right" aria-hidden="true"></i></button>
							<button className = "pageButton" onClick= {this.goToLast}><i className="fa fa-angle-double-right" aria-hidden="true"></i></button>
						</div>
						<div>
							<span className="resPerPage">Results per page: </span>
							<select className = "selectStyle" onChange={this.pageChange} ref = 'test'>
          
								<option value="5">5</option>
								<option value="10">10</option>
								<option value="25">25</option>
								<option value="50">50</option>
							</select> 
						</div>  
					</div>
				</div>
			
			</div>
		);
	}
}

export default YoutubeListComponent;