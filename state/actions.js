export const increment = (delta) => ({  
	type: "INCREMENT",
	howMuch:delta 
});
  
export const decrement = (delta) => ({  
	type: "DECREMENT",
	howLess:delta 
});
  
export const write = (newitem) => {
	return {type: "WRITE",newItem: newitem};
};

export const acquire = (newitem) => {
	return {type: "ACQUIRE",newItem: newitem};
};
  
export const erase = (newitem) => {
	return {type: "ERASE",itemToRemove: newitem };
};

export const addCredential = (stepName, credentials) => {
	return {type: "ADD-CREDENTIAL", stepName:stepName, entityCredentials: credentials};
};

export const addLoginClaims = (claims, token) => {
	return {type: "ADD-LOGIN-CLAIMS", claims: claims, token:token};
};

export const removeLoginClaims = () => {
	return {type: "REMOVE-LOGIN-CLAIMS"};
}


export const light = () => {
	return {type: "LIGHT" };
};

export const dark = () => {
	return {type: "DARK" };
};

export const loggedIn = () => {
	return {type: "LOGGEDIN" };
};

export const notlogged = () => {
	return {type: "NOTLOGGED" };
};