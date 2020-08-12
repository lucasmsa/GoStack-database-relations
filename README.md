# GoStack Challenges 📃
> GoStack is an 8-week Bootcamp from [RocketSeat](https://rocketseat.com.br/) that is mainly focused on teaching NodeJS, ReactJS, React-Native and 
 Typescript
 
 * Challenge description: https://git.io/JJSUI
 * Test Results on `Jest_results.png`
 
<br>

## Challenge

- [x]  `Post / costumers` route will receive the user's `email` and `name`, returning this new user at the end.
    - [x]  If a client with the same `email` already exists throw an error
    - [x]  `customers` table on the db must have `name`, `email`, `created_at` and `update_at`
- [x]  `Post / products` route will receive the user's `name`,`price` and `quantity`
    - [x]  If a product with the same `name` already exists throw an error
    - [x]  `products` table on the db must have `name`, `price`, `quantity`, `created_at` and `update_at`
        - [x]  To add `price` to the db use the `type` as `decimal`, also passing the properties `precision` and `scale`
- [x]  `Post / orders` route will receive `costumer_id` and an array of products, containing the `id` and the `quantity` you want to add to a new order
    - [x]  Add to the `order` table a new order related to the `costumer_id`, while also containing the fields `created_at` and `updated_at`
    - [x]  Inside the `orders_products` table store the `product_id`, `order_id`, `price`, `quantity`, `created_at` and `updated_at`
        - [x]  Create a relationship N:N between `orders` and `products`
- [x]  `GET /orders/:id` route returns info about a specific `order`
