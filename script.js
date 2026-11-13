// 1. Load initial data from data.json if localStorage is empty
async function initData() {
  if (!localStorage.getItem("libraryLoans")) {
    try {
      const response = await fetch("data.json");
      const jsonData = await response.json();
      localStorage.setItem("libraryLoans", JSON.stringify(jsonData));
    } catch (error) {
      localStorage.setItem("libraryLoans", JSON.stringify([]));
    }
  }
  renderTable();
}

// Helper to get and save loans
function getLoans() {
  return JSON.parse(localStorage.getItem("libraryLoans")) || [];
}

function saveLoans(loans) {
  localStorage.setItem("libraryLoans", JSON.stringify(loans));
}

// 2. LOGIN PAGE LOGIC
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const role = document.getElementById("role").value;
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username !== "" && password !== "") {
      if (role === "librarian") {
        window.location.href = "librarian.html";
      } else {
        window.location.href = "borrower.html";
      }
    }
  });
}

// 3. BORROWER PAGE LOGIC
const borrowForm = document.getElementById("borrowForm");
if (borrowForm) {
  borrowForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("userName").value.trim();
    const id = document.getElementById("userId").value.trim();
    const book = document.getElementById("bookSelect").value;
    const days = Number(document.getElementById("daysSelect").value);
    const price = days === 5 ? 7 : 10;

    const loans = getLoans();
    loans.push({
      id: id,
      name: name,
      book: book,
      days: days,
      price: price,
      returned: false
    });
    saveLoans(loans);

    const feedbackMsg = document.getElementById("feedbackMsg");
    feedbackMsg.style.display = "block";
    feedbackMsg.textContent = `Success! ${name} (ID: ${id}) borrowed "${book}" for ${days} days. Total paid: $${price}.`;

    borrowForm.reset();
  });
}

// 4. LIBRARIAN PAGE LOGIC
function renderTable() {
  const tableBody = document.getElementById("loansTableBody");
  if (!tableBody) return;

  const loans = getLoans();
  tableBody.innerHTML = "";

  loans.forEach(function (loan, index) {
    const row = document.createElement("tr");

    const statusText = loan.returned ? "Returned" : "Not Returned";
    const statusClass = loan.returned ? "btn-returned" : "btn-not-returned";

    row.innerHTML = `
      <td>${loan.id}</td>
      <td>${loan.name}</td>
      <td>${loan.book}</td>
      <td>${loan.days} Days</td>
      <td>$${loan.price}</td>
      <td>
        <button type="button" class="status-btn ${statusClass}" onclick="toggleReturn(${index})">
          ${statusText}
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function toggleReturn(index) {
  const loans = getLoans();
  loans[index].returned = !loans[index].returned;
  saveLoans(loans);
  renderTable();
}

// Start app
initData();
