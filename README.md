# Desafios_Backend
This folder contains all the challenges for the Backend course @Coderhouse.

## Confidenza - Ecommerce: Final project for the Backend course @[CoderHouse](https://www.coderhouse.com) (class #39685)
## Student: Martín Suarez
### Path to the final project: [/Desafios_Backend/final](https://github.com/martin086/Desafios_Backend/tree/master/final)
  

Backend for an e-commerce site

### API endpoints:
- /api/products
	- GET '/': Returns all the existing products with pagination. Query params = {limit, page, category, stock, sort} Eg.: "?sort=ASC" filters products by ascending price.
	- GET '/`product_id`': Searches a product based on product_id.
	- POST '/': Adds products to the DB using body in JSON format.
	- PUT '/`product_id`': Modifies a product from the DB based on product_id. Information is sent by body in JSON format.

- /api/carts
	- GET '/`cart_id`': Returns a cart with all the products that contains based on cart_id.
	- POST '/': Creates an empty cart. //Deprecated. Carts are now created when user registers.
	- POST '/`cart_id`/products/`product_id`': Adds a product based on product_id to a specific cart based on cart_id.
	- POST '/`cart_id`/purchase': Creates a purchase ticket, based on existing products in cart and updates the current products stock according to subtracted quantities. Uses cart_id.
	- PUT '/`cart_id`': Replaces the whole content of cart products with the ones sent by body using product_id(s) in JSON format.
	- PUT '/`cart_id`/products/`product_id`': Modifies the specified quantity of a product using body. Eg.: {"quantity": 2}.
	- DELETE '/`cart_id`/products/`product_id`': Deletes a specified product completely from the specified cart.
	- DELETE '/`cart_id`': Empties the specified cart.

- /api/session
	- POST '/`login`': Logs a user if it exists in DB using body in JSON format. (first_name, last_name, email, password)
	- GET '/`logout`': Logs a user out the session.

- /api/user
	- GET '/': Gets all existing users from the DB.
	- POST '/`register`': Creates a new user in the DB using body in JSON format. (first_name, last_name, email, password)

- /api/chat
	- GET '/': Gets all messages from the DB.
	- POST '/': Creates a new message in the DB using body in JSON format. (message)
  
## Main Dependencies:

- [express.js](https://expressjs.com/es/)
`npm i express --save`
- [express session](https://www.npmjs.com/package/express-session)
`npm i express-session`
- [express-handlebars](https://handlebarsjs.com/)
`npm i express-handlebars`
- [dotenv](https://www.npmjs.com/package/dotenv/)
`npm i dotenv`
- [connect-mongo](https://www.npmjs.com/package/connect-mongo)
`npm i connect-mongo`
- [mongoose](https://mongoosejs.com/)
`npm i mongoose`
- [mongoose-paginate-v2](https://www.npmjs.com/package/mongoose-paginate-v2)
`npm i mongoose-paginate-v2`
- [bcrypt](https://www.npmjs.com/package/bcrypt)
`npm i bcrypt`
- [cookie-parser](https://www.npmjs.com/package/cookie-parser)
`npm i cookie-parser`
- [passport](https://www.npmjs.com/package/passport)
`npm i passport`
	- also used: "passport-github2", "passport-jwt", "passport-local",
- [multer](https://www.npmjs.com/package/multer)
`npm i multer`
- [socket.io](https://socket.io/)
`npm i socket.io`
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
`npm i jsonwebtoken`
- [nodemon](https://nodemon.io/)
`npm i nodemon -D`
- [nodemailer](https://www.npmjs.com/package/nodemailer)
`npm i nodemailer`

