// Get the search elements
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

// Search functionality
searchButton.addEventListener("click", function() {

    const searchValue = searchInput.value.toLowerCase().trim();

    if (searchValue === "") {
        alert("Please enter an item to search for.");
        return;
    }

    window.location.href = "browse.html?search=" + encodeURIComponent(searchValue);

});

// Get the report elements
const lostButton = document.getElementById("lostButton");
const foundButton = document.getElementById("foundButton");
const reportSection = document.getElementById("reportSection");
const reportHeading = document.querySelector(".report-section h2");
const reportForm = document.getElementById("reportForm");

// Store report type
let reportType = "";

// Function to display the report form
function showReportForm(type) {
    reportType = type;
    reportSection.style.display = "block";

    if (type === "lost") {
        reportHeading.textContent = "Report a Lost Item";
    } else {
        reportHeading.textContent = "Report a Found Item";
    }

    reportSection.scrollIntoView({
        behavior: "smooth"
    });
}

// Lost button
lostButton.addEventListener("click", function() {
    showReportForm("lost");
});

// Found button
foundButton.addEventListener("click", function() {
    showReportForm("found");
});

// Open the correct form through navigation

const urlParams = new URLSearchParams(window.location.search);
const selectedType = urlParams.get("type");

if (selectedType === "lost" || selectedType === "found") {

    showReportForm(selectedType);

    setTimeout(function() {
        reportSection.scrollIntoView({
            behavior: "smooth"
        });
    }, 200);

}

// Submit and save report

reportForm.addEventListener("submit", function(event) {
    event.preventDefault();

    if (reportType !== "lost" && reportType !== "found") {
        alert("Please select whether you are reporting a lost or found item.");
        return;
    }

    const imageInput = document.getElementById("itemImage");
    const imageFile = imageInput.files[0];

    if (imageFile && !imageFile.type.startsWith("image/")) {
        alert("Please select a valid image.");
        return;
    }

    if (imageFile && imageFile.size > 2 * 1024 * 1024) {
        alert("Please choose an image smaller than 2 MB.");
        return;
    }

    const report = {
        id: Date.now(),
        title: document.getElementById("itemTitle").value,
        category: document.getElementById("itemCategory").value.toLowerCase(),
        location: document.getElementById("itemLocation").value,
        description: document.getElementById("itemDescription").value,
        status: reportType,
        date: new Date().toLocaleDateString(),
        image: ""
    };

    function saveReport() {
        let reports = JSON.parse(localStorage.getItem("reports")) || [];

        reports.push(report);

        localStorage.setItem("reports", JSON.stringify(reports));

        alert("Your report has been submitted successfully!");

        reportForm.reset();
        reportSection.style.display = "none";
    }

    if (imageFile) {
        const reader = new FileReader();

        reader.onload = function() {
            report.image = reader.result;
            saveReport();
        };

        reader.onerror = function() {
            alert("Unable to read the selected image. Please try again.");
        };

        reader.readAsDataURL(imageFile);
    } else {
        saveReport();
    }
});

  

  
// Homepage View Details functionality

const homeDetailButtons = document.querySelectorAll(
    ".recent-items .view-details-btn"
);

homeDetailButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const card = button.closest(".item-card");

        const item = {
            status: card.dataset.status,
            category: card.dataset.category,

            title: card.querySelector("h3").textContent,
            image: card.querySelector(".item-image img").src,

            details: Array.from(
                card.querySelectorAll(".item-details p")
            ).map(function(paragraph) {
                return paragraph.textContent;
            })
        };

        sessionStorage.setItem(
            "selectedItem",
            JSON.stringify(item)
        );

        window.location.href = "item-details.html";

    });

});