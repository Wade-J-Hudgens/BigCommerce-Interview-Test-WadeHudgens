
    addToCart = async() => {
        const response = await fetch('https://api.bigcommerce.com/stores/ddvil0tzjn/v3/catalog/products', {
            method: 'GET',
            body: myBody,
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': 'l5offvloy2f4v315hjxn6ag08ykffxm'
            }
        });
        const myJson = await response.json();
        console.log(myJson);
    }
//https://api.bigcommerce.com/stores/ddvil0tzjn/v3/catalog/products