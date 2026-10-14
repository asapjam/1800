const sortTestimonials = require("../util/sort-testimonails.js");

describe("sortTestimonials function", () => {
    const unsortedTestimonials = [
        { feedback : "Incredible! And stuff!", rating : 5 },
        { feedback : "Cheap!" , rating : 3 },
        { feedback : "Badly!" , rating : 0 }
    ];
    it("sorts testimonials alphabetically", () => {
        const expectedSort = [
            { feedback : "Badly!" , rating : 0 },
            { feedback : "Cheap!" , rating : 3 },
            { feedback : "Incredible! And stuff!", rating : 5 }
        ];
        const actualSort = sortTestimonials(unsortedTestimonials, "nameAsc");
        expect(actualSort).toEqual(expectedSort);
    });
    it("sorts testimonials by descending rating", () => {
        const expectedSort = [
            { feedback : "Incredible! And stuff!", rating : 5 },
            { feedback : "Cheap!" , rating : 3 },
            { feedback : "Badly!" , rating : 0 } 
        ];
        const actualSort = sortTestimonials(unsortedTestimonials, "ratingDesc");
        expect(actualSort).toEqual(expectedSort);

    });
    it("sorts testimonials by ascending rating", () => {
        const expectedSort = [
            { feedback : "Badly!" , rating : 0 },
            { feedback : "Cheap!" , rating : 3 },
            { feedback : "Incredible! And stuff!", rating : 5 }
        ];
        const actualSort = sortTestimonials(unsortedTestimonials, "ratingAsc");
        expect(actualSort).toEqual(expectedSort);

    });
});