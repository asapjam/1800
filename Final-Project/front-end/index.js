// const getResponse = await fetch("http://localhost:5167/testimonials");
// const testimonialsJson = await getResponse.json();
// console.log("testimonialsJson");
// console.log(testimonialsJson);

// const testimonialsList = document.querySelector('ul[name = "testimonials_list"]');

// testimonialsJson.forEach(testimonial => {
//     const newLi = document.createElement("li");
//     newLi.innerText = `Feedback: ${testimonial.feedback}, Rating: ${testimonial.rating}`;

//     testimonialsList.appendChild(newLi);
// });


// const form = document.querySelector("form");
// form.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const formData = new FormData(form);

//     const caseCorrectedBody = {
//         Feedback: formData.get("feedback"),
//         Rating: formData.get("rating")
//     }

//     await fetch("http://localhost:5167/testimonials", {
//         method: "post",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(caseCorrectedBody)
//     });
//     location.reload();
// });