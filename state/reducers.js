import {combineReducers} from "redux";

const counter = (state = 0, action) => {  
	switch (action.type) {
	case "INCREMENT":
		return state + action.howMuch;
	case "DECREMENT":
		return state - action.howLess;
	default:
		return state;
	}
};

const changer = (state = {}, action) => {  
 
	switch (action.type) {
	case "WRITE":  
		return action.newItem;   
	case "ERASE": 
		break;     
	default:
		return state;
	}
};

const pageVisited = (state = {}, action) => {  
	//const newState = [...state]; // Es6 array cloning
	switch (action.type) {
	case "ACQUIRE":	
		//newState.push(action.newItem);
		return action.newItem;   
	case "ERASE": 
		break;   
		//let index = newState.indexOf(action.itemToRemove);      
		//if (index > -1) { newState.splice(index, 1); return newState} else return state;
	default:
		return state;
	}
};


const jwtcredentials = (state ={}, action) => {
	const newState = {Claims:state.Claims};
	switch (action.type) {
	case "ADD-CREDENTIAL" : 
		Object.defineProperty(newState.Claims, action.stepName, {value:action.entityCredentials});
		return newState;
	default :
		return state;
	}
};

const profileClaims = (state={}, action) => {
	let newState = {Claims:state.Claims};
	switch (action.type) {
	case "ADD-LOGIN-CLAIMS":
		Object.defineProperty(newState.Claims, 'userClaims',{value:action.claims});
		Object.defineProperty(newState.Claims, 'userToken',{value:action.token});

		return newState;
	case "REMOVE-LOGIN-CLAIMS":
		newState = {Claims:{}};
		return newState;
	default:
		return state;
	}
}

const theme = (state = "", action) => {
	switch (action.type) {
	case "LIGHT" :
		return "light";
	case "DARK":
		return "dark";
	default:
		return state;
	}
};

const authenticated = (state = false, action) => {
	switch (action.type) {
	case "LOGGEDIN" :
		return true;
	case "NOTLOGGED":
		return false;
	default:
		return state;
	}
}

const reducers = combineReducers({
	counter:counter,
	changer:changer,
	pageVisited:pageVisited,
	jwtcredentials:jwtcredentials,
	theme:theme,
	authenticated:authenticated,
	profileClaims:profileClaims
});



export default reducers;