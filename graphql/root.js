const Product = require('./products');
var db = [];

db.push(new Product("1as","Macbook air fast",2300.50,"The new entry of the mac family. It is a product of great innovation. The new entry of the mac family. It is a product of great innovation. The new entry of the mac family. It is a product of great innovation. v The new entry of the mac family. It is a product of great innovation. The new entry of the mac family. It is a product of great innovation.","https://static1.unieuro.it/medias/sys_master/root/h70/h8a/17214606770206/GalaxyNote9-midnight-black-01-sgmConversionBaseFormat-sgmProductFormat.jpg",true));
db.push(new Product("1ac2","New Samsung Gs123",1000.30,"The best in the world","https://www.att.com/shopcms/media/att/catalog/devices/lg-v40%20thinq-aurora%20black-240x320.png",false));
db.push(new Product("2n45","Sony Experia f3131",230.60,"A new important piece","https://www.thinkgeek.com/images/products/additional/large/jukg_bff_rainbow_cloud_plush_rainbow.jpg",true));

const root = {  
    
	 
    productsOrderByIdDesc:() => {return db.sort((a, b) => b.SKU.localeCompare(a.SKU));},
    productsOrderByIdAsc:() => { return db.sort((a, b) => a.SKU.localeCompare(b.SKU));},
    setOnOffer:  ({sku}) => {
        let elementOnOffer = {};
        db = db.map((element) => {
            if (element.SKU === sku) {
                element.IsOnOffer = true;
                elementOnOffer = element;
            }
            return element;
        })
        return elementOnOffer;
    },
    createProduct:  ({product}) => { db.push(product);  return product},
    productBySKU:({sku}) => { return db.find(element => element.SKU === sku) ;},
    productIsOnOffer:() => { return db.filter(element => element.IsOnOffer === true) ;},
    productsCount:() => {return db.length;},
    productRandom:() => {return db[2];}   
       
 };

 module.exports = root;





/*  mutation {
    createProduct(product: {SKU: "dm88sku12", Name: "New web site", Price: 123.54, Description: "Very good", ImageUrl: "http://image.jpg", IsOnOffer: true}) {
     SKU
      Name
      Price
      Description
      IsOnOffer
    }
  } */












// to send a query with postman use the following address
//http://localhost:3000/graphql

// the queries
//{"query":"{user {name email}}","variables":null}
//{"query":"{names users {email} hello name email}","variables":null}
// mutation {  setMessage(message: "hhhhh") }

// mutation {
//   createUser(user: {id: "6", name: "Zebra", email: "zebra@zampa.com",isAdmin:true}) {
//     id
//     name
//     email
//     isAdmin
//   }
// }


// multiple mutations

/*mutation foo {
  m1: createUser(user: {id: "88", name: "Zebra", email: "zebra@zampa.com", isAdmin: true}) {
    id
    name
    email
    isAdmin
  }
  m2: createUser(user: {id: "996", name: "Zebra", email: "zebra@zampa.com", isAdmin: true}) {
    id
    name
    email
    isAdmin
  }
}*/


// query multiple with aliases
//{u2:  userById (id:"2")  {name id email}
//u3: userById (id:"3")  {name id email}
//u1: userById (id:"1")  {name id}}

//{userById (id:"2")  {name id email}}
 