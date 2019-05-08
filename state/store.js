import {createStore,applyMiddleware, compose}   from "redux";
import reducers from "./reducers";
import thunk from "redux-thunk";
//import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";

const initialState =  {
	counter:0,
	changer:{initialState:0},
	pageVisited:{site:"https://diegomary.github.io", pageNumber:0, pageNames:[] },
	jwtcredentials:{Claims:{}},
	profileClaims: localStorage.getItem('jwt_diegomary') ? {Claims:{ userToken:localStorage.getItem('jwt_diegomary'), userClaims: JSON.parse(localStorage.getItem('userclaims_diegomary')) }}: {Claims:{}},
	authenticated: localStorage.getItem('authenticated') ? localStorage.getItem('authenticated') : false,	
	theme: localStorage.getItem('theme_diegomary') ? localStorage.getItem('theme_diegomary') : "light"
};
export default createStore(reducers, initialState, compose(applyMiddleware(thunk)));