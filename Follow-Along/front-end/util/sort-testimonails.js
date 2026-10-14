function sortTestimonials(testimonials, sortType) {
    const sortedTestimonials = testimonials;

    switch(sortType) {
        case "nameAsc":
            sortedTestimonials.sort( (previous, current) => {
                if (previous.feedback < current.feedback){
                    return -1;
                }
                else if (previous.feedback > current.feedback){
                    return 1;
                }
                return 0;
            })
            break;
        case "ratingDesc":
            sortedTestimonials.sort( (previous, current) => {
                if (previous.rating > current.rating){
                    return -1;
                }
                else if (previous.rating < current.rating){
                    return 1;
                }
                return 0;
            })
            break;
        case "ratingAsc":
            sortedTestimonials.sort( (previous, current) => {
                if (previous.rating < current.rating){
                    return -1;
                }
                else if (previous.rating > current.rating){
                    return 1;
                }
                return 0;
            })
            break;
    };

    return sortedTestimonials;
};

module.exports = sortTestimonials;