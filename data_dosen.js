let allData = []; // Store all data for filtering
let deleteNPM = null;
let deleteRowIndex = null;

async function fetchData() {
  try {
    const response = await fetch("https://api.sheetbest.com/sheets/f4b8387c-6ddc-4485-b90b-6796d0b8fbf2/tabs/Dosen");
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
        <td>${item.NIP}</td>
        <td>${item.NIDN}</td>
        <td>${item.Nama}</td>
        <td>${item.Fungsional}</td>
        <td>${item.Bidang}</td>
        <td>${item.Telepon}</td>
        <td>${item.Email}</td>
        <td>${item.Password}</td>
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
