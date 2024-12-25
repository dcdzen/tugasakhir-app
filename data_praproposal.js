let allData = []; // Store all data for filtering
let deleteNPM = null;
let deleteRowIndex = null;

async function fetchData() {
  try {
    const response = await fetch("https://api.sheetbest.com/sheets/f4b8387c-6ddc-4485-b90b-6796d0b8fbf2");
    const data = await response.json();
    allData = data;
    renderTable(data);
    populateDosenFilter();
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  // navbar
  fetch("navbar.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("navbar").innerHTML = data;
    });
}

function renderTable(data) {
  const tableBody = document.getElementById("data-table-body");
  tableBody.innerHTML = "";

  data.forEach((item, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
  <td>${item.NPM}</td>
  <td>${item.Password}</td>
  <td>${item.Nama}</td>
  <td>${item.Email}</td>
  <td>${item.Telepon}</td>
  <td>${item.Bidang}</td>
  <td>${item.Judul}</td>
  <td>${item.Dosen}</td>
  <td>
    <button class="edit-button" onclick="showEditPage(${index})">Edit</button>
    <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#delete-popup" onclick="deletePopup('${item.NPM}', ${index})">Hapus</button>
  </td>
`;

    tableBody.appendChild(row);
  });
}

function populateDosenFilter() {
  const dosenFilter = document.getElementById("filter-dosen");
  const uniqueNames = [...new Set(allData.map((item) => item.Dosen))];
  dosenFilter.innerHTML = '<option value="All">Semua Dosen</option>';

  uniqueNames.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    dosenFilter.appendChild(option);
  });
}

function filterTable() {
  const bidangValue = document.getElementById("filter-bidang").value;
  const dosenValue = document.getElementById("filter-dosen").value;

  let filteredData = allData;

  if (bidangValue !== "All") {
    filteredData = filteredData.filter((item) => item.Bidang === bidangValue);
  }

  if (dosenValue !== "All") {
    filteredData = filteredData.filter((item) => item.Dosen === dosenValue);
  }

  renderTable(filteredData);
}

document.getElementById("filter-bidang").addEventListener("change", filterTable);
document.getElementById("filter-dosen").addEventListener("change", filterTable);

function showEditPage(index) {
  const editData = allData[index];
  const editUrl = `edit_data.html?NPM=${encodeURIComponent(editData.NPM)}`;
  window.location.href = editUrl;
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
    const response = await fetch(`https://api.sheetbest.com/sheets/f4b8387c-6ddc-4485-b90b-6796d0b8fbf2/NPM/${deleteNPM}`, {
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
