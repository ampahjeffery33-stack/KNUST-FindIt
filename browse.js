
// Get search and filter elements

const browseSearch = document.getElementById("browseSearch");
const browseSearchButton = document.getElementById("browseSearchButton");

const statusFilter = document.getElementById("statusFilter");
const categoryFilter = document.getElementById("categoryFilter");

// Load saved reports

const savedReports = JSON.parse(localStorage.getItem("reports")) || [];

const browseContainer = document.querySelector(".browse-items-container");

// Display saved reports

savedReports.forEach(function(report) {

    const card = document.createElement("div");
    card.classList.add("item-card");
    card.dataset.id = report.id;

    card.dataset.status = report.status;
    card.dataset.category = report.category;

    const image = document.createElement("div");
image.classList.add("item-image");

const itemPhoto = document.createElement("img");

if (report.image) {
    itemPhoto.src = report.image;
} 
else {
    const itemName = (report.title + " " + report.category).toLowerCase();

    if (itemName.includes("bag")) {
        itemPhoto.src = "images/Capture.PNG";
    } 
    else if (itemName.includes("phone")) {
        itemPhoto.src = "images/Capture 1.PNG";
    } 
    else if (itemName.includes("calculator")) {
        itemPhoto.src = "images/Capture 2.PNG";
    } 
    else {
        itemPhoto.src = "images/Capture.PNG";
    }
}

itemPhoto.alt = report.title;
image.appendChild(itemPhoto);

    const details = document.createElement("div");
    details.classList.add("item-details");

    const status = document.createElement("span");
    status.classList.add("status", report.status);
    status.textContent = report.status.toUpperCase();

    const title = document.createElement("h3");
    title.textContent = report.title;

    const category = document.createElement("p");
    category.textContent = "Category: " + report.category;

    const location = document.createElement("p");
    location.textContent = "Location: " + report.location;

    const description = document.createElement("p");
    description.textContent = report.description;

    const button = document.createElement("button");
    button.classList.add("view-details-btn");
    button.textContent = "View Details";

    details.append(status, title, category, location, description, button);

    card.append(image, details);

    browseContainer.prepend(card);

});

// Get search term from homepage

const urlParams = new URLSearchParams(window.location.search);
const homepageSearch = urlParams.get("search");

if (homepageSearch) {
    browseSearch.value = homepageSearch;
}

// Search and filter functionality

function filterItems() {

    const searchValue = browseSearch.value.toLowerCase().trim();
    const selectedStatus = statusFilter.value;
    const selectedCategory = categoryFilter.value;

    const itemCards = document.querySelectorAll(
        ".browse-items-container .item-card"
    );

    itemCards.forEach(function(item) {

        const itemText = item.innerText.toLowerCase();

        const itemStatus = item.dataset.status;
        const itemCategory = item.dataset.category;

        const matchesSearch = itemText.includes(searchValue);

        const matchesStatus =
            selectedStatus === "all" || itemStatus === selectedStatus;

        const matchesCategory =
            selectedCategory === "all" || itemCategory === selectedCategory;

        item.style.display =
            matchesSearch && matchesStatus && matchesCategory
                ? "block"
                : "none";

    });

}

// Search button

browseSearchButton.addEventListener("click", filterItems);

// Live search
browseSearch.addEventListener("input", filterItems);

// Search using Enter

browseSearch.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        filterItems();
    }

});

// Search while typing

browseSearch.addEventListener("input", filterItems);

// Filter by status

statusFilter.addEventListener("change", filterItems);

// Filter by category

categoryFilter.addEventListener("change", filterItems);

// View item details

browseContainer.addEventListener("click", function(event) {

    if (event.target.classList.contains("view-details-btn")) {

        const card = event.target.closest(".item-card");

        const item = {
            id: card.dataset.id,
            image: card.querySelector(".item-image img")?.getAttribute("src") || "",
            status: card.dataset.status,
            category: card.dataset.category,
            title: card.querySelector("h3").textContent,

            details: Array.from(
                card.querySelectorAll(".item-details p")
            ).map(function(paragraph) {
                return paragraph.textContent;
            })

        };

        sessionStorage.setItem("selectedItem", JSON.stringify(item));

        window.location.href = "item-details.html";

    }

});

// Automatically filter when arriving from homepage

if (homepageSearch) {
    filterItems();
}