export function sortProducts(arrayOfProducts, sortMethod){

    const sortedArrayOfProducts = arrayOfProducts;

    switch(sortMethod){
        case "nameAscending":
            sortedArrayOfProducts.sort( (previous, current) => {
                if (previous.name.toLowerCase() < current.name.toLowerCase()){
                    return -1;
                }
                else if (previous.name.toLowerCase() > current.name.toLowerCase()){
                    return 1;
                }
                return 0;
            })
            break;
        case "priceAscending":
            sortedArrayOfProducts.sort( (previous, current) => {
                if (previous.price < current.price){
                    return -1;
                }
                else if (previous.price > current.price){
                    return 1;
                }
                return 0;
            })
            break;
        case "ratingDescending":
            sortedArrayOfProducts.sort( (previous, current) => {
                if (previous.rating > current.rating){
                    return -1;
                }
                else if (previous.rating < current.rating){
                    return 1;
                }
                return 0;
            })
            break;
    }

    return sortedArrayOfProducts;
    
};