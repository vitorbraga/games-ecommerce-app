# Games Ecommerce App
This repository is part of a long-term project of mine, called *Games Ecommerce*.
As the name says, it is an e-commerce focused on Games, to sell physical games and consoles.
All the products and transactions are fake, so in case of a user making order, this user won't be charged and also won't receive the product.

This repository is the frontend for the Games Ecommerce Store. It is responsible for all the interactions a user can make, such as register, login, view products and make an order.

There are other two repositories that complement *games-ecommerce-app*:

- [games-ecommerce-server](https://github.com/vitorbraga/games-ecommerce-server): backend of the whole project, which handles the database access and all the requests users can make
- [games-ecommerce-admin](https://github.com/vitorbraga/games-ecommerce-admin): Admin Portal, so administrators can handle the management of products, orders and users.

The project is in an MVP state. It has a basic ecommerce functionality. It still has lot of features and improvements to make and I plan to implement them over time.



## Current State

The project is in an MVP state. It has a basic e-commerce functionality. I still have a lot of features and improvements to make and I plan to implement them over time.
There are no tests implemented yet. I focused on features, like it is in a real-world company. Stakeholders want features, especially in the early stages when we are building a MVP. As this project is still a MVP, I decided to focus on fast delivering of the core features first.



## Live demo

You can find a live demo of this project hosted in Heroku:

https://games-ecommerce-app.herokuapp.com/

You can create an account and simulate orders. Feel free to explore it 😉

OBS: As this is hosted in a Free Plan in Heroku, the machine where this project is hosted can be idle. So, if you see to response, give it a couple of minutes and the machine will be active again.



## Stack

- **React.Js**: The UI Framework I'm most familiar with. I think it's a very complete tool and it has a good backup in it's community.
- **Next.Js**: It's a nice tool to provide a better SEO for this website, once Ecommerces need to be well positioned in search engines. Also, it's easier to handle page routes with Next.js.
- **Typescript**: I like it because it prevents lots of errors at compile time
- **Redux:** Global state library. There are other libraries I could choose, but I went with Redux as this is the one I'm most familiar with
- **React Bootstrap**: Simple pack of UI elements, easy to use and to customize.
- **Formik + Yup:** great combo for handling forms and validation



## Current features

- [x] Authentication
  - [x] Registration, Login, Password recovery
- [x] Products
  - [x] Featured products (products in the main page)
  - [x] Product details
  - [x] Searching, filtering, and sorting products
- [x] User address handling
  - [x] Create address, remove address, and set main address
- [x] Shopping cart handling
- [x] Orders
  - [x] Make order
  - [x] My orders page
- [x] About page



## Next features in the backlog

- [ ] Layout Responsiveness
- [ ] Product Reviews
- [ ] Product pagination
- [ ] My Orders pagination
- [ ] Checkout Page: set main address and create new address
- [ ] Update address
- [ ] Products with Discount
- [ ] Coupons
- [ ] SEO
  - [ ] Adjust titles, meta tags and use best practices for it
- [ ] Unit tests



## Running the project

Steps to run this project:

##### First things first:

Run `npm i` command to install the dependencies.

##### Running development

1. Run `npm run start:dev` command to start development environment and you are good to go
2. The server will start at `http://localhost:3000`

##### Running production

1. Run `npm run build` to generate JS files in the `/.next` folder
2. Run `npm run start` to run the server.
3. If you don't have a *PORT* environment variable set, the server will start at `http://localhost:3000`

***IMPORTANT***: to run the project correctly, you'll need to setup the proper environment variables for the desired environment. Please check the table below to know more about the necessary environment variables.



## Environment variables

This application is complex, then we have lots of configuration to do. As this configuration is either confidential data or is environment-based, we need to make environment variables out of them, so we are more protected and the application can run properly.
All custom environment variables should have the prefix `NEXT_PUBLIC_` in order to be correctly loaded by Next.js.

| Variable                               | Expected values                                              |
| -------------------------------------- | ------------------------------------------------------------ |
| NODE_ENV                               | Environment: *development* or *production*                   |
| NEXT_PUBLIC_SERVER_BASE_URL            | Base URL for the backend<br />Example for development:  http://localhost:4000<br />Example for production: https://games-ecommerce-server.herokuapp.com/ |
| NEXT_PUBLIC_APP_BASE_URL               | Base URL for the Store.<br />Example for development:  http://localhost:3000<br />Example for production: https://games-ecommerce-app.herokuapp.com/ |
| NEXT_PUBLIC_S3_BUCKET_PRODUCT_PICTURES | Name of the AWS S3 bucket where the product pictures are stored. |