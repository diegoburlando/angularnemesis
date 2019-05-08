import apiConfig from "../../apiconfiguration/apiconfig";


const genericAuth = () => ({

	checkValidToken : (candidateToken) => {
		return fetch(apiConfig.loginWithTokenUrl, { 
			method: "POST", credentials: 'include', 
			body: JSON.stringify({token:candidateToken}),     
			headers: {
				'Content-type':'application/json'
			           
			}
		})		
	},
	
	fetchJournal : (token, useremail) => {
		return fetch(apiConfig.fetchJournal, { 
			method: "POST", credentials: 'include', 
			body: JSON.stringify({token:token, useremail:useremail}),     
			headers: {
			  'Content-type':'application/json'   
			       
			}
		})
	},

	addJournalEntry : (token, useremail, entrytitle, entrycontent, entrydate) => {
		return fetch(apiConfig.addEntry, { 
			method: "POST", credentials: 'include', 
			body: JSON.stringify({
				token:token, 
				useremail:useremail, 
				entrytitle:entrytitle, 
				entrycontent:entrycontent, 
				entrydate:entrydate
			}),     
			headers: {
			  'Content-type':'application/json'
			            
			}
		})
	},

	authCheck : () => {
		return fetch(apiConfig.authToken, { 
	    method: "GET", credentials: 'include',      
	    headers: {
	        'Content-type':'application/json'

	      	}
	  	})
	},

	getCSRFToken : () => {
		return fetch(apiConfig.csrf, { 
			method: "GET",	credentials: 'include', 		    
			headers: {
				'Content-type':'application/json'				             
			}
		})		
	},

});

export default genericAuth;