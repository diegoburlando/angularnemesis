import apiConfig from '../../../apiconfiguration/apiconfig';


const fetchGithubInfo = (criteria) => {
  
	let gitName = criteria;
	return fetch(apiConfig.githubCards.concat(gitName),{ method: "GET" });       
};

const responseHandling = (response) => {
	if (response.status >= 400) return "error"; 
	return response.json() 
};


export { fetchGithubInfo, responseHandling };