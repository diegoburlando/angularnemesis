import React, {Component } from "react";
import { fetchVideoStatistics, responseHandling, fetchPlaylistVideos } from "./statisticsapi";
import VideoDetail from "./videodetail";
import PlaylistDetail from "./playlistdetail";
import PropTypes from "prop-types";// To render available the state in the component
import { TrackState } from "../../state/tracker";

class YoutubeDetailsComponent extends Component {
static contextTypes = {store: PropTypes.object};    
	constructor(props) {
		super(props);
		this.state = { error: false, stats:false, playlist:false};
		this.item = {};    
		this.stats = {};
		this.memory = {};
		this.playlist = [];
	}

	componentWillMount() { window.scrollTo(0, 0); }

	acquireStats = (json) => {

    if(json === 'error') {this.setState({  error: true}); return};
        this.memory.statistics = json.items[0].statistics;
        localStorage.setItem('memory', JSON.stringify(this.memory));
        this.setState({stats:true});  

};

acquirePlaylist = (json) => {
    if(json === 'error') {this.setState({  error: true}); return}; 
        this.playlist = json.items;  
        localStorage.setItem('playlist', JSON.stringify(this.playlist));      
        this.setState({playlist:true});  
}

	componentDidMount() {
		TrackState(this.context.store,"Youtube Feeds Detail");  
		this.memory = this.props.location.itemData;
		if(typeof this.memory === "undefined") this.memory = JSON.parse(localStorage.getItem("memory"));
		if (typeof this.memory.id.videoId !== "undefined" ){
			fetchVideoStatistics(this.memory.id.videoId).then(responseHandling).then(this.acquireStats);
			return;
		}

		//https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&playlistId=PLAC325451207E3105&part=snippet&key=AIzaSyDyeIzeoHyUiNMiFnhMNuBVhKUXj2mklYQ&pageToken=CDIQAA
    
		fetchPlaylistVideos(this.memory.id.playlistId).then(responseHandling).then(this.acquirePlaylist)
    
	}


	render() {    
    
		if (!this.state.playlist) {
			if(!this.state.stats) return (null);
			if(typeof this.memory === "undefined") this.memory = JSON.parse(localStorage.getItem("memory"));
			return ( <VideoDetail memory = {this.memory}/> );
		}
		return(<PlaylistDetail playlistTitle = {this.memory.snippet.title} playlistVideos = {this.playlist} />)
	}
}
export default  YoutubeDetailsComponent;
