const { buildSchema } = require('graphql');
const schema = buildSchema(`

input InputProduct {SKU:ID, Name:String, Price:Float,Description:String,ImageUrl:String,IsOnOffer:Boolean}
type Product {SKU:ID, Name:String, Price:Float,Description:String,ImageUrl:String,IsOnOffer:Boolean}
type Mutation {
  setOnOffer(sku:String,isOnOffer: Boolean): Product,
  createProduct(product: InputProduct): Product
}

  type Query {
    productsCount:Int,
    productRandom:Product,
    productsOrderByIdDesc: [Product!]!,
    productsOrderByIdAsc: [Product!]!,   
    productBySKU(sku:String):Product,
    productIsOnOffer:[Product!]!
   
  },
`);

module.exports = schema;

