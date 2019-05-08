import React, {Component } from "react";// eslint-disable-line no-unused-vars
import  "./styles.css";
import Likes from "./likes"; // eslint-disable-line no-unused-vars

class VideoDetail extends Component {

	render() {

		return (

			<div className="singlemainContainer">
				<div className = "singlefeedcontainer">
					<h1 className="singlefeedtitle">{this.props.memory.snippet.title}</h1>
					<div className="singlevideocontainer">
						<div className="singlevideowrapper">
							<iframe allowFullScreen title = "feedvideo" width="420" height="315" src={"https://www.youtube.com/embed/" + this.props.memory.id.videoId}></iframe>
						</div>
					</div>
					<div className="singlefeedtext">
						<p className="singlefeeddate">Published on {this.props.memory.snippet.publishedAt}</p>
						<p>{this.props.memory.snippet.description}</p>
						<p>{this.props.memory.statistics.viewCount}</p>
						<Likes likes={this.props.memory.statistics.likeCount} dislikes={this.props.memory.statistics.dislikeCount}/>     
					</div>     
				</div>				
			</div>
		);
	}
}

export default VideoDetail;