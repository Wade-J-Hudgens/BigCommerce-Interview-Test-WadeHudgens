# BigCommerce Interview Test Wade Hudgens
[https://wade-hudgens6.mybigcommerce.com/special-items/](https://wade-hudgens6.mybigcommerce.com/special-items/)

No preview code

-----
I was tasked with utilizing BigCommerce's Cornerstone theme and storefront API to complet a variety of tasks. Those tasks being:
- Create a product called Special Item under a new category called Special Items
- Display the products second image when a user hovers over the product
- Add a button at the top of the category that adds the product to the cart
- Add a button next to the previous button, that only displays when there is items in the cart, that removes all items in the cart
- If a customer is logged in, display customer data at the top of the catagory page

## Create a product called Special Item under a new category called Special Items
This task was really simple. All I needed to do was use the user interface to create the product and category and then enter all of the required information.

## Display the products second image when a user hovers over the product
For this task, I needed to add to templates/products/card.html. I added a second container div under the default container div. I used handlebar to get the second image's source. I also added styling for the div and image to assts/scss/layouts/products/productGrid.scss.

## Add a button at the top of the category that adds the product to the cart
For this task, I needed to add to templates/pages/category.html and to assets/js/theme/category.js. I added a container div to hold bot the add and delete buttons. Inside of the container, I only hard coded the add button because the delete one is dynamically added later. I used an ajax call to post to the storefront API so the Special Item would be added to the cart.

## Add a button next to the previous button, that only displays when there is items in the cart, that removes all items in the cart
For this task, I needed to add to assets/js/theme/category.js. Because this button only shows when there is items in the cart. I decided the best course of action would be to dynamically add it to the container div. I added a function that uses an ajax call to the storefront API to get cart data and another function to analyze whether there is an item in the cart. If there is an item, the delete button is dynamically added to the container div and if the cart is empty, the delete button is deleted from the container. If the button is clicked, an ajax call is made to the storefront API to retrieve the cartId. With the cartId, another ajax call is made to the storefront API to delete the cart.

## If a customer is logged in, display customer data at the top of the catagory page
For this task, I needed to add to templates/pages/category.html. I used handlebars to check if a customer was logged in and to retrive customer data. Since the data can only be displayed if a customer is logged in I checked if a customer is logged in by checking ```{{#if customer}}```. If that condition is true, labels are created displaying customer data gathered from handlebars. For example, to get the customers name, I used ```{{customer.name}}```.

