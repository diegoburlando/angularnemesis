import apiConfig from '../../apiconfiguration/apiconfig';

const fetchYoutubeFeeds = (criteria) => {
	let esc = encodeURIComponent;	
	let qsData = {
		q:criteria,
		maxResults: "50",
		part: "snippet",                                      
		key:"AIzaSyDyeIzeoHyUiNMiFnhMNuBVhKUXj2mklYQ" };     
	let query = `?${Object.keys(qsData).map(k => `${esc(k)}=${esc(qsData[k])}`).join("&")}`;
	return fetch(apiConfig.youtubeSearch.concat(query),{ method: "GET" });
};

const responseHandling = (response) => {
	if (response.status >= 400)  return "error";
	return response.json(); 
};

export { fetchYoutubeFeeds, responseHandling };