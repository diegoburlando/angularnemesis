let importAll = () => {	
			
	let r = require.context("./images", false, /\.(png|jpe?g|svg)$/);
	let images = {}; 
	r.keys().map((item) => {return images[item.replace("./", "")] = r(item);

	}); 
	return images; 
}; 
const images = importAll(); 

export {images};