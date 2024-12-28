let allData = []; // Store all data for filtering
let deleteNPM = null;
let deleteRowIndex = null;

const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user) {
  console.error("User is not logged in.");
  window.location.href = "login.html";
  // return;
}

async function fetchData() {
  try {
    const response = await fetch("https://api.sheetbest.com/sheets/f4b8387c-6ddc-4485-b90b-6796d0b8fbf2/tabs/Dosen");
    const data = await response.json();
    const callDosen = data.filter((item) => item.Fungsional === "Lektor" || item.Fungsional === "Lektor Kepala");

    allData = callDosen;
    renderTable(callDosen);
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  // navbar
  fetch("navbar.html")
    .then((response) => response.text())
    .then((callDosen) => {
      document.getElementById("navbar").innerHTML = callDosen;

      if (user.Status === "Mahasiswa") {
        document.getElementById("cek-profile").href = "profile.html";
        document.getElementById("cek-menu").hidden = false;
      } else if (user.Status === "Dosen") {
        document.getElementById("cek-profile").href = "profile_dosen.html";
        document.getElementById("cek-menu").hidden = true;
      }
    });
}

function renderTable(callDosen) {
  const tableBody = document.getElementById("data-table-body");
  tableBody.innerHTML = "";

  callDosen.forEach((item, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td class="text-center align-content-center" style="white-space: nowrap">${item.NIP}</td>
        <td class="text-center align-content-center" style="white-space: nowrap">${item.NIDN}</td>
        <td class="align-content-center" style="white-space: nowrap">${item.Nama}</td>
        <td class="align-content-center" style="white-space: nowrap">${item.Fungsional}</td>
        <td class="align-content-center" style="white-space: nowrap">${item.Bidang}</td>
        <td class="align-content-center" style="white-space: nowrap">${item.Telepon}</td>
        <td class="align-content-center" style="white-space: nowrap">${item.Email}</td>
        <td class="text-center align-content-center" style="white-space: nowrap">${item.Slot} Mahasiswa</td>
      `;

    tableBody.appendChild(row);
  });
}

function filterTable() {
  const bidangValue = document.getElementById("filter-bidang").value;

  let filteredData = allData;

  if (bidangValue !== "All") {
    filteredData = filteredData.filter((item) => item.Bidang === bidangValue);
  }

  renderTable(filteredData);
}

document.getElementById("filter-bidang").addEventListener("change", filterTable);

window.onload = fetchData;
