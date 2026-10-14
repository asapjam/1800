const sortProducts = require("../util/sortProducts.js");

describe("sortProducts function works as expected", () => {
    const testData = [ 
        { name: "Shovel", price: 10, inventory: 20, rating: 5 }, 
        { name: "Gloves", price: 6, inventory: 40, rating: 3 }, 
        { name: "Ski Mask", price: 12, inventory: 30, rating: 4 }
    ];
    it("sorts products by Name (ascending)", () => {
        const expectedSort = [
            { name: "Gloves", price: 6, inventory: 40, rating: 3 }, 
            { name: "Shovel", price: 10, inventory: 20, rating: 5 }, 
            { name: "Ski Mask", price: 12, inventory: 30, rating: 4 }
        ];
        const actualSort = sortProducts(testData, "nameAscending");
        expect(actualSort).toEqual(expectedSort);
    });
    it("sorts products by Price (ascending)", () => {
        const expectedSort = [
            { name: "Gloves", price: 6, inventory: 40, rating: 3 }, 
            { name: "Shovel", price: 10, inventory: 20, rating: 5 }, 
            { name: "Ski Mask", price: 12, inventory: 30, rating: 4 }
        ];
        const actualSort = sortProducts(testData, "priceAscending");
        expect(actualSort).toEqual(expectedSort);
    });
    it("sorts products by Rating (descending)", () => {
        const expectedSort = [
            { name: "Shovel", price: 10, inventory: 20, rating: 5 }, 
            { name: "Ski Mask", price: 12, inventory: 30, rating: 4 },
            { name: "Gloves", price: 6, inventory: 40, rating: 3 }    
        ];
        const actualSort = sortProducts(testData, "ratingDescending");
        expect(actualSort).toEqual(expectedSort);
    });
});