// Get saved reports

let reports = JSON.parse(localStorage.getItem("reports")) || [];

// Get dashboard elements

const totalReports = document.getElementById("totalReports");
const lostReports = document.getElementById("lostReports");
const foundReports = document.getElementById("foundReports");
const returnedReports = document.getElementById("returnedReports");

const reportsTable = document.getElementById("reportsTable");

// Update dashboard statistics

function updateStatistics() {

    totalReports.textContent = reports.length;

    lostReports.textContent = reports.filter(
        report => report.status === "lost"
    ).length;

    foundReports.textContent = reports.filter(
        report => report.status === "found"
    ).length;

    returnedReports.textContent = reports.filter(
        report => report.status === "returned"
    ).length;

}

// Display reports in the table

function displayReports() {

    reportsTable.innerHTML = "";

    reports.forEach(function(report) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${report.title}</td>
            <td>${report.category}</td>
            <td>
                <span class="status ${report.status}">
                    ${report.status.toUpperCase()}
                </span>
            </td>
            <td>${report.location}</td>
            <td>
                <button class="delete-btn" data-id="${report.id}">
                    Delete
                </button>
            </td>
        `;

        reportsTable.appendChild(row);

    });

}

// Delete reports

reportsTable.addEventListener("click", function(event) {

    if (event.target.classList.contains("delete-btn")) {

        const reportId = Number(event.target.dataset.id);

        const confirmation = confirm(
            "Are you sure you want to delete this report?"
        );

        if (confirmation) {

            reports = reports.filter(
                report => report.id !== reportId
            );

            localStorage.setItem("reports", JSON.stringify(reports));

            displayReports();
            updateStatistics();

            alert("Report deleted successfully!");

        }

    }

});

// Run dashboard functions

displayReports();
updateStatistics();

// Get saved ownership claims

let claims = JSON.parse(localStorage.getItem("claims")) || [];

// Get claims table

const claimsTable = document.getElementById("claimsTable");

// Display ownership claims

function displayClaims() {

    claimsTable.innerHTML = "";

    claims.forEach(function(claim) {

        const row = document.createElement("tr");

        const itemCell = document.createElement("td");
        itemCell.textContent = claim.itemTitle;

        const nameCell = document.createElement("td");
        nameCell.textContent = claim.studentName;

        const idCell = document.createElement("td");
        idCell.textContent = claim.studentId;

        const phoneCell = document.createElement("td");
        phoneCell.textContent = claim.phoneNumber;

        const reasonCell = document.createElement("td");
        reasonCell.textContent = claim.claimReason;

        const dateCell = document.createElement("td");
        dateCell.textContent = claim.date;

        const statusCell = document.createElement("td");
        statusCell.textContent = claim.status.toUpperCase();

        // Create Actions cell
const actionsCell = document.createElement("td");

// Approve button
const approveButton = document.createElement("button");
approveButton.textContent = "Approve";
approveButton.classList.add("approve-btn");

approveButton.addEventListener("click", function() {
    updateClaimStatus(claim.id, "approved");
});

// Reject button
const rejectButton = document.createElement("button");
rejectButton.textContent = "Reject";
rejectButton.classList.add("reject-btn");

rejectButton.addEventListener("click", function() {
    updateClaimStatus(claim.id, "rejected");
});

// Add buttons to Actions cell
actionsCell.append(approveButton, rejectButton);

// Mark as Returned button
if (claim.status === "approved") {

    const returnedButton = document.createElement("button");

    returnedButton.textContent = "Mark as Returned";
    returnedButton.classList.add("returned-btn");

    returnedButton.addEventListener("click", function() {
        updateClaimStatus(claim.id, "returned");
    });

    actionsCell.appendChild(returnedButton);
}

        row.append(
    itemCell,
    nameCell,
    idCell,
    phoneCell,
    reasonCell,
    dateCell,
    statusCell,
    actionsCell
);

        claimsTable.appendChild(row);

    });

}

// Display claims when the admin page loads

displayClaims();

// Update ownership claim status
function updateClaimStatus(claimId, newStatus) {

    claims = claims.map(function(claim) {

        if (claim.id === claimId) {
            return {
                ...claim,
                status: newStatus
            };
        }

        return claim;
    });

    localStorage.setItem("claims", JSON.stringify(claims));

// Update the original item report when returned
if (newStatus === "returned") {

    let reports = JSON.parse(localStorage.getItem("reports")) || [];

    const returnedClaim = claims.find(function(claim) {
        return claim.id === claimId;
    });

    reports = reports.map(function(report) {

        if (String(report.id) === String(returnedClaim.itemId)) {
            return {
                ...report,
                status: "returned"
            };
        }

        return report;
    });

    localStorage.setItem("reports", JSON.stringify(reports));
}

displayClaims();
displayReports();
updateStatistics();
}

// Automatically refresh dashboard when data changes in another tab

window.addEventListener("storage", function(event) {

    if (event.key === "reports" || event.key === "claims") {

        displayReports();
        displayClaims();
        updateStatistics();

    }

});