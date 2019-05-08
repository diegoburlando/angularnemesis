import apiConfig from '../../apiconfiguration/apiconfig';

const fetchVideoStatistics = (criteria) => {
	//https://www.googleapis.com/youtube/v3/videos?part=statistics&id=NliYy7iqh-U&key=AIzaSyDyeIzeoHyUiNMiFnhMNuBVhKUXj2mklYQ
	let esc = encodeURIComponent;
	let qsData = {
		id:criteria,          
		part: "statistics",                                      
		key:"AIzaSyDyeIzeoHyUiNMiFnhMNuBVhKUXj2mklYQ" };    
	let query = `?${Object.keys(qsData).map(k => `${esc(k)}=${esc(qsData[k])}`).join("&")}`;	
	return fetch(apiConfig.youtubeVideoStatistics.concat(query),{ method: "GET" }); 
};


const responseHandling = (response) => {
	if (response.status >= 400) return "error"; 
	return response.json(); 
};


//https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&playlistId=PLAC325451207E3105&part=snippet&key=AIzaSyDyeIzeoHyUiNMiFnhMNuBVhKUXj2mklYQ

const fetchPlaylistVideos = (criteria) => {
	let esc = encodeURIComponent;	
	let qsData = {
		playlistId:criteria,          
		part: "snippet",
		maxResults: "50",                                      
		key:"AIzaSyDyeIzeoHyUiNMiFnhMNuBVhKUXj2mklYQ" };    
	let query = `?${Object.keys(qsData).map(k => `${esc(k)}=${esc(qsData[k])}`).join("&")}`;
	return fetch(apiConfig.youtubePlaylistVideos.concat(query),{ method: "GET" });
};


export { fetchVideoStatistics, responseHandling, fetchPlaylistVideos };