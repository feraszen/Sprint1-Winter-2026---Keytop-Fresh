// ===============================
// Customer Reviews Data
// ===============================

const reviews = [
    {
        text: "It's good value for money. Taste of ice creams are OK but having good serving size in the price they offer.",
        author: "Feras Zen."
    },
    {
        text: "Absolutely the freshest juice I've ever had! The mango blend is incredible.",
        author: "Emily R."
    },
    {
        text: "I love the fruit salads here. Everything tastes natural and high quality.",
        author: "Daniel K."
    },
    {
        text: "The pistachio sauce on the ice cream is amazing. Highly recommended!",
        author: "Sophia L."
    },
    {
        text: "Great atmosphere and very friendly staff. My go-to place every weekend!",
        author: "Michael T."
    }
];

// ===============================
// Reviews Slider
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    const textElement = document.getElementById("review-text");
    const authorElement = document.getElementById("review-author");

    if (!textElement || !authorElement) return;

    let currentIndex = 0;

    function showReview(index) {
        textElement.textContent = `"${reviews[index].text}"`;
        authorElement.textContent = `- ${reviews[index].author}`;
    }

    function nextReview() {
        currentIndex = (currentIndex + 1) % reviews.length;
        showReview(currentIndex);
    }

    showReview(currentIndex);
    setInterval(nextReview, 4000);
});