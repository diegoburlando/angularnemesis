import React, {Component } from "react";
import "./playliststyles.css";

class PlaylistDetail extends Component {

	constructor(props) {
		super(props);
		this.title = this.props.playlistTitle;
		this.videos = this.props.playlistVideos;
		this.state = {
			videoNumber: 0,
			shuffled: false
		};
	}

    nextVideo = (event) => {
        let videoNumber = this.state.videoNumber;
        if (videoNumber >= (this.videos.length - 1)) return; 
        videoNumber += 1;               
        this.setState({ videoNumber:videoNumber});     
    };

    previousVideo = (event) => {
        let videoNumber = this.state.videoNumber;        
        if (videoNumber === 0) return;   
        videoNumber -= 1;     
        this.setState({videoNumber:videoNumber});         
    };

    selectVideo = item => {
        this.setState({videoNumber:item});
    };

    shuffleArray = () => { 
        this.setState({shuffled:false});
        for (let i = this.videos.length - 1; i > 0; i--) { 
            let j = Math.floor(Math.random() * (i + 1)); 
            [this.videos[i], this.videos[j]] = [this.videos[j], this.videos[i]];             
        }

        for ( let i = 0; i<this.videos.length; i++) {
            this.videos[i].snippet.position = i;
        } 
        this.setState({shuffled:true});
    } 

	render() { 

		let thumbnails = this.videos.map((item)=> {
			return(
				<div key = {item.etag} onClick = {e => this.selectVideo(item.snippet.position)} className = "thumbnails">
					<div className ="number"><p>{(item.snippet.position+1)}</p></div>
					<img alt = {item.snippet.title}   src = {item.snippet.thumbnails.default.url}/>
					<p>{item.snippet.title}</p>
				</div>
			);
		});        

		return(
			<div className = "playlistContainer">
				<h1 className="playlistfeedtitle">{this.videos[this.state.videoNumber].snippet.title}</h1>
				<div className = "playlistVideo">
					<div>
						<div className="playlistvideowrapper">
							<iframe allowFullScreen title = "feedvideo" width="420" height="315" src={"https://www.youtube.com/embed/" + this.videos[this.state.videoNumber].snippet.resourceId.videoId}></iframe>
						</div>
					</div>
					<section>
						<div className = "playlistTitle">
							<button onClick={this.previousVideo}><i className="fa fa-step-backward" aria-hidden="true"></i></button>   
							<div> 
								<p>{this.title}</p>                           
								<button onClick= {this.shuffleArray}><i className="fa fa-random" aria-hidden="true"></i></button>
							</div>
							<button onClick={this.nextVideo}><i className="fa fa-step-forward" aria-hidden="true"></i></button>
						</div>                        
						<div className = "thumbnailsContainer">                         
							{thumbnails}
						</div>
					</section>
				</div>
				<div className = "playlistfeeddescription">
					<p>Published on {this.videos[this.state.videoNumber].snippet.publishedAt}</p>
					<p>{this.videos[this.state.videoNumber].snippet.description}</p>                       
				</div>		
			</div>  
		);	
	}
}

export default PlaylistDetail;