let allData = []; // Store all data for filtering
let deleteNPM = null;
let deleteRowIndex = null;

const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user) {
  console.error("User is not logged in.");
  window.location.href = "login_dosen.html";
  // return;
} else if (user.Status === "Mahasiswa") {
  console.error("Hanya untuk dosen");
  window.location.href = "login.html";
}

async function fetchData() {
  // navbar
  fetch("navbar.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("navbar").innerHTML = data;

      if (user.Status === "Mahasiswa") {
        document.getElementById("cek-profile").href = "profile.html";
        document.getElementById("cek-menu").hidden = false;
      } else if (user.Status === "Dosen") {
        document.getElementById("cek-profile").href = "profile_dosen.html";
        document.getElementById("cek-menu").hidden = true;
      } else if (user.Status === "Admin") {
        document.getElementById("cek-profile").href = "profile_dosen.html";
        document.getElementById("cek-menu").hidden = false;
      }
    });
  try {
    const response = await fetch(`https://api.sheetbest.com/sheets/506f8840-a871-4430-b4c5-ff4c7926af72/tabs/Praproposal?NPM=${user.NPM}`);
    const data = await response.json();
    allData = data;
    renderTable(data);
    populateDosenFilter();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function renderTable(data) {
  const responseCallDosen = await fetch("https://api.sheetbest.com/sheets/506f8840-a871-4430-b4c5-ff4c7926af72/tabs/Dosen");
  const callDosenData = await responseCallDosen.json();
  const callDosen = callDosenData.filter((item) => item.Fungsional === "Admin");

  const tableBody = document.getElementById("data-table-body");
  tableBody.innerHTML = ""; // Clear any existing rows

  // Determine admin status
  let isAdmin = false;

  for (let i = 0; i < callDosen.length; i++) {
    const dosen = callDosen[i];
    if (dosen.NIP === user.NIP) {
      isAdmin = true;
      console.log("admin");
      break; // Stop checking once admin status is confirmed
    } else {
      console.log("bukan admin");
    }
  }

  // Generate table rows
  data.forEach((item, index) => {
    const row = document.createElement("tr");

    // Conditional hidden attribute for the delete button
    const deleteButtonHTML = isAdmin ? `<button type="button" id="del-mahasiswa" class="btn btn-danger fw-bold" data-bs-toggle="modal" data-bs-target="#delete-popup" onclick="deletePopup('${item.NPM}', ${index})">Hapus</button>` : "";

    row.innerHTML = `
    <td class="text-center align-content-center" style="white-space: nowrap">${index + 1}</td>
    <td class="text-center align-content-center" style="white-space: nowrap">${item.NPM}</td>
    <td class="align-content-center" style="white-space: nowrap">${item.Nama}</td>
    <td class="align-content-center" style="white-space: nowrap">${item.Email}</td>
    <td class="align-content-center" style="white-space: nowrap">${item.Telepon}</td>
    <td class="align-content-center" style="white-space: nowrap">${item.Bidang}</td>
    <td class="align-content-center" style="white-space: nowrap">${item.Pembimbing_1}</td>
    <td class="align-content-center" style="white-space: nowrap">${item.Pembimbing_2}</td>
    <td class="text-center d-flex justify-content-between gap-2">
      <button class="btn btn-primary fw-bold" onclick="selectedMahasiswa(${index})">Periksa</button>
      ${deleteButtonHTML}
    </td>
  `;

    tableBody.appendChild(row);
  });
}

// filter dosen
function populateDosenFilter(selectedBidang) {
  const dosenFilter = document.getElementById("filter-dosen");

  // Filter data based on the selected "Bidang"
  const filteredNames = selectedBidang === "All" ? allData.map((item) => item.Pembimbing_1) : allData.filter((item) => item.Bidang === selectedBidang).map((item) => item.Pembimbing_1);

  // Get unique names
  const uniqueNames = [...new Set(filteredNames)];

  // Populate dropdown
  dosenFilter.innerHTML = '<option value="All">Semua Dosen</option>';
  uniqueNames.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    dosenFilter.appendChild(option);
  });
}

// filter tabel
function filterTable(event) {
  event.preventDefault(); // Prevent form submission from refreshing the page

  const bidangValue = document.getElementById("filter-bidang").value;
  const dosenValue = document.getElementById("filter-dosen").value;

  // Filter table data
  let filteredData = allData;

  if (bidangValue !== "All") {
    filteredData = filteredData.filter((item) => item.Bidang === bidangValue);
  }

  if (dosenValue !== "All") {
    filteredData = filteredData.filter((item) => item.Pembimbing_1 === dosenValue);
  }

  renderTable(filteredData);
}

// Initialize the filters on "Bidang" change
document.getElementById("filter-bidang").addEventListener("change", (event) => {
  const bidangValue = event.target.value;
  populateDosenFilter(bidangValue);
});

// Add a submit button for filtering
document.getElementById("filter-form").addEventListener("submit", filterTable);

function selectedMahasiswa(index) {
  const selectedData = allData[index];
  const selectedUrl = `mahasiswa.html?NPM=${encodeURIComponent(selectedData.NPM)}`;
  window.location.href = selectedUrl;
  // console.log("Redirecting to:", editUrl);
}

function deletePopup(npm, rowIndex) {
  deleteNPM = npm;
  deleteRowIndex = rowIndex;
}

const toastTrigger = document.getElementById("confirm-delete");
const toastLiveExample = document.getElementById("liveToast");

if (toastTrigger) {
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
  toastTrigger.addEventListener("click", () => {
    toastBootstrap.show();
    showAlertPopup("Data berhasil dihapus", false); // Success message
  });
}

// Show success or error alert popup
function showAlertPopup(message, isError = false) {
  const alertPopup = document.getElementById("alert-popup");
  const alertMessage = document.getElementById("alert-message");

  alertMessage.textContent = message;

  // If error, add error class for red background
  if (isError) {
    alertPopup.classList.add("error");
  } else {
    alertPopup.classList.remove("error");
  }

  // Hide alert after 2 seconds and refresh page
  setTimeout(() => {
    alertPopup.style.display = "none";
    window.location.reload(); // Refresh page
  }, 2000); // 2 seconds delay
}

// Modify deleteData to show the alert based on success or failure
async function deleteData() {
  try {
    const response = await fetch(`https://api.sheetbest.com/sheets/506f8840-a871-4430-b4c5-ff4c7926af72/tabs/Praproposal/NPM/${deleteNPM}`, {
      method: "DELETE",
    });

    if (response.ok) {
      showAlertPopup("Data berhasil dihapus", false); // Success message
      console.error("Berhasil!");
    } else {
      throw new Error("Gagal menghapus data");
    }
  } catch (error) {
    console.error("Error deleting data:", error);
    showAlertPopup("Terjadi kesalahan saat menghapus data", true); // Error message
  }
}

document.getElementById("confirm-delete").onclick = deleteData;

window.onload = fetchData;
