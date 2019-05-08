const Product = class Product { 
  
  
    constructor(productId,name, price,description, imageUrl, isonoffer) {

       this.SKU = productId;
       this.Name = name;
       this.Price = price;
       this.Description = description;
       this.ImageUrl = imageUrl;
       this.IsOnOffer = isonoffer;

    }    
   
 }

 module.exports = Product