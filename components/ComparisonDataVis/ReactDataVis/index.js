import React, { Component } from "react";
import "./styles.css";
import apiConfig from "../../../apiconfiguration/apiconfig";

class ReactDataVis extends Component {
	constructor(props) {
		super(props);
		this.state = { flowers: [] };
		this.pageSize = 5;
		this.pageNumber = 1;
		this.flowers = [];		
	}
	
  getDataPage = flowers => {
    return flowers.slice(
      (this.pageNumber - 1) * this.pageSize,
      this.pageSize * this.pageNumber
    );
  };

  nextPage = () => {
    let remainder = this.flowers.length % this.pageSize;
    let pages = Math.floor(this.flowers.length / this.pageSize);
    if (remainder > 0) {
      pages++;
    }
    if (this.pageNumber === pages) return;
    this.pageNumber += 1;
    this.setState({ flowers: this.getDataPage(this.flowers) });
  };

  firstPage = () => {
    this.pageNumber = 1;
    this.setState({ flowers: this.getDataPage(this.flowers) });
  };

  lastPage = () => {
    let remainder = this.flowers.length % this.pageSize;
    let pages = Math.floor(this.flowers.length / this.pageSize);
    if (remainder > 0) {
      pages++;
    }
    this.pageNumber = pages;
    this.setState({ flowers: this.getDataPage(this.flowers) });
  };

  prevPage = () => {
    if (this.pageNumber === 1) return;
    this.pageNumber -= 1;
    this.setState({ flowers: this.getDataPage(this.flowers) });
  };

	componentDidMount() {
		this.refs.loader.style.display="block";
		fetch(apiConfig.bachflowers, { method: "GET" })
			.then(response => {
				if (response.status >= 400) {
					throw new Error("Bad response from server");
				}
				return response.json();
			})
			.then(flowers => {
				try
				{
					this.refs.loader.style.display="none";
					this.refs.paginator.style.display= "block";
					this.flowers = flowers;
					this.setState({ flowers: this.getDataPage(flowers) });
				}
				catch(err) {}


			});
	}

	render() {
		let flowers = this.state.flowers.map((flower, index) => {
			return (
				<div key = {index + "flower"} className="row-comp">
					<p>{flower.Name}</p>          
					<div className ="description-comp">
						<p>{flower.Description}</p>
						<div>
							<img src={flower.ImagePath} width="100%" alt="" />
						</div>
					</div>
				</div>
			);
		});
		return (
      
			<div className="container-comp">
			<div ref="loader" hidden className="comp-loader" >
          <div></div>
        </div>
				<div ref = "paginator" hidden className="paginator-comp">
					<button title="Go to first page" onClick={this.firstPage}>
						<i className="fa fa-angle-double-left" aria-hidden="true" />
					</button>
					<button title="Go to previous page" onClick={this.prevPage}>
						<i className="fa fa-angle-left" aria-hidden="true" />
					</button>
					<button title="Go to next page" onClick={this.nextPage}>
						<i className="fa fa-angle-right" aria-hidden="true" />
					</button>
					<button title="Go to last page" onClick={this.lastPage}>
						<i className="fa fa-angle-double-right" aria-hidden="true" />
					</button>
				</div>
				{flowers}
			</div>
      
		);
	}
}

export default ReactDataVis;