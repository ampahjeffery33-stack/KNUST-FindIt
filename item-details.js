const selectedItem = JSON.parse(
    sessionStorage.getItem("selectedItem")
);

const itemInformation = document.getElementById("itemInformation");

if (selectedItem) {

    const claimButton = document.getElementById("claimButton");

if (selectedItem.status === "found") {
    claimButton.style.display = "inline-block";
}

    itemInformation.innerHTML = `
    <div class="item-card">

        <div class="item-image">
            <img 
                src="${selectedItem.image || 'images/Capture 2.PNG'}"
                alt="${selectedItem.title}"
            />
        </div>

        <div class="item-details">

            <span class="status ${selectedItem.status}">
                ${selectedItem.status.toUpperCase()}
            </span>

            <h2>${selectedItem.title}</h2>

            <p>${selectedItem.details.join("</p><p>")}</p>

        </div>

       </div>
`;

} else {

    itemInformation.textContent = "No item selected.";

}

// Open claim form

const claimButton = document.getElementById("claimButton");

const claimForm = document.getElementById("claimForm");

claimButton.addEventListener("click", function() {

    claimForm.style.display = "block";

    claimForm.scrollIntoView({
        behavior: "smooth"
    });

});

// Submit ownership claim

const ownershipForm = document.getElementById("ownershipForm");

ownershipForm.addEventListener("submit", function(event) {

    event.preventDefault();

    if (!selectedItem) {
        alert("No item has been selected.");
        return;
    }

    const claim = {

        id: Date.now(),
        itemId: selectedItem.id,
        itemTitle: selectedItem.title,
        itemStatus: selectedItem.status,
        itemCategory: selectedItem.category,

        studentName: document.getElementById("studentName").value,
        studentId: document.getElementById("studentId").value,
        phoneNumber: document.getElementById("phoneNumber").value,
        claimReason: document.getElementById("claimReason").value,

        date: new Date().toLocaleString(),

        status: "pending"

    };

    // Get previously saved claims

    let claims = JSON.parse(localStorage.getItem("claims")) || [];

    // Add the new claim

    claims.push(claim);

    // Save claims

    localStorage.setItem("claims", JSON.stringify(claims));
    console.log("Saved claims:", claims);

    alert("Your claim has been submitted successfully! Await verification.");

    ownershipForm.reset();

    claimForm.style.display = "none";

});