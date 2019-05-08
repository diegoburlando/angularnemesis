import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Layout from "./layouttemplates/layout";// eslint-disable-line no-unused-vars
import registerServiceWorker from "./registerServiceWorker";
import store from "./state/store";
import {Provider} from "react-redux";// eslint-disable-line no-unused-vars



ReactDOM.render(<Provider store={store}><Layout/></Provider>, document.getElementById("root"));


registerServiceWorker();