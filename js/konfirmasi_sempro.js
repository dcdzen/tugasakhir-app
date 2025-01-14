if (!user) {
  console.error("User is not logged in.");
  window.location.href = "login_dosen.html";
  // return;
} else if (user.Status === "Mahasiswa") {
  console.error("Hanya untuk dosen");
  window.location.href = "login.html";
}

const urlParamssempro = new URLSearchParams(window.location.search);
const selectedNPMsempro = urlParamssempro.get("NPM");

document.addEventListener("DOMContentLoaded", async () => {
  if (!selectedNPMsempro) {
    console.log("Data tidak ditemukan!");
    window.location.href = `mahasiswa.html?NPM=${selectedNPMsempro}`; // Redirect if no NPM
    return;
  }

  try {
    // Fetch Mahasiswa Data
    const mahasiswaResponse = await fetch("https://api.sheetbest.com/sheets/a4e0b8ce-db68-4e5f-b0ff-d22f47fe3a0f/tabs/Sempro");
    const mahasiswaData = await mahasiswaResponse.json();
    const editData = mahasiswaData.find((item) => item.NPM === selectedNPMsempro);

    if (!editData) {
      console.log("Data tidak ditemukan!");
      // window.location.href = `mahasiswa.html?NPM=${selectedNPMsempro}`;
      return;
    } else {
      // date ===============================================================================
      const inputFormattedDate = editData.Jadwal; // Example input date in 'dd month name yyyy' format

      // Function to convert '30 Desember 2024' to '2024-12-30'
      function convertReadableDateToISO(inputDate) {
        const monthMap = {
          Januari: "01",
          Februari: "02",
          Maret: "03",
          April: "04",
          Mei: "05",
          Juni: "06",
          Juli: "07",
          Agustus: "08",
          September: "09",
          Oktober: "10",
          November: "11",
          Desember: "12",
        };

        // Split the input date into day, month, and year
        const [day, monthName, year] = inputDate.split(" ");

        // Convert month name to numerical format using the monthMap
        const month = monthMap[monthName];

        // Return formatted date in 'yyyy-MM-dd' format
        return `${year}-${month}-${day.padStart(2, "0")}`; // Ensure day is always two digits
      }

      // Usage
      const isoDate = convertReadableDateToISO(inputFormattedDate);

      // time ========================================================================
      // Convert "7:00" to "07:00"
      function convertTo24HourFormat(inputTime) {
        const [time, modifier] = inputTime.split(" ");

        let [hours, minutes] = time.split(":");

        // Convert hours to 24-hour format
        if (modifier === "PM" && hours !== "12") {
          hours = parseInt(hours, 10) + 12;
        } else if (modifier === "AM" && hours === "12") {
          hours = "00";
        }

        // Ensure hours and minutes are always two digits
        hours = hours.toString().padStart(2, "0");
        minutes = minutes.toString().padStart(2, "0");

        return `${hours}:${minutes}`;
      }

      // Example usage
      const inputJamMulai = editData.Jam_Mulai; // Example input
      const formattedJamMulai = convertTo24HourFormat(inputJamMulai);

      const inputJamSelesai = editData.Jam_Selesai; // Example input
      const formattedJamSelesai = convertTo24HourFormat(inputJamSelesai);

      // Prefill the form with editData
      document.getElementById("edit-tanggal-sempro").value = editData.Tanggal;
      document.getElementById("edit-npm-sempro").value = editData.NPM;
      document.getElementById("edit-nama-sempro").value = editData.Nama;
      document.getElementById("edit-bidang-sempro").value = editData.Bidang;
      document.getElementById("edit-judul-sempro").value = editData.Judul;
      document.getElementById("edit-dosbing1-sempro").value = editData.Pembimbing_1;
      document.getElementById("edit-dosbing2-sempro").value = editData.Pembimbing_2;

      document.getElementById("edit-dosji1-sempro").value = editData.Penguji_1;
      document.getElementById("edit-dosji2-sempro").value = editData.Penguji_2;

      document.getElementById("edit-jadwal-sempro").value = isoDate;
      document.getElementById("edit-jam-mulai-sempro").value = formattedJamMulai;
      document.getElementById("edit-jam-selesai-sempro").value = formattedJamSelesai;
      document.getElementById("edit-tempat-sempro").value = editData.Tempat;
      document.getElementById("edit-status-sempro").value = editData.Status;

      // Fetch Dosen Data
      const response = await fetch("https://api.sheetbest.com/sheets/a4e0b8ce-db68-4e5f-b0ff-d22f47fe3a0f/tabs/Dosen");
      if (!response.ok) {
        throw new Error("Failed to fetch data from Dosen API.");
      }

      const dosenData = await response.json();
      const bidangElement = document.getElementById("edit-bidang-sempro");
      const dosji1Dropdown = document.getElementById("edit-dosji1-sempro");
      const dosji2Dropdown = document.getElementById("edit-dosji2-sempro");
      const dosbing1Value = document.getElementById("edit-dosbing1-sempro").value; // Get the selected value of dosbing1
      const dosbing2Value = document.getElementById("edit-dosbing2-sempro").value; // Get the selected value of dosbing2

      // Predefined valid fungsional options
      const validFungsional = ["Lektor", "Lektor Kepala", "Asisten Ahli"];

      // Ensure the "bidang" element exists and has a value
      if (!bidangElement || !bidangElement.value) {
        throw new Error("Bidang value is not available for filtering.");
      }

      const selectedBidang = bidangElement.value;

      // Populate dosji1 options, grouped under the selected Bidang
      // dosji1Dropdown.innerHTML = '<option value="" disabled selected>Pilih Dosen</option>'; // Clear existing options
      const filteredDosenForDosji1 = dosenData.filter(
        (dosen) =>
          dosen.Bidang === selectedBidang &&
          validFungsional.includes(dosen.Fungsional) &&
          parseInt(dosen.Slot, 10) !== 13 &&
          dosen.Nama !== dosbing1Value && // Exclude Dosen already in dosbing1
          dosen.Nama !== dosbing2Value // Exclude Dosen already in dosbing2
      );

      if (filteredDosenForDosji1.length === 0) {
        dosji1Dropdown.disabled = true;
        console.warn(`No Dosen found for Bidang: ${selectedBidang}`);
      } else {
        const optgroup = document.createElement("optgroup");
        optgroup.label = selectedBidang; // Set the optgroup label to the selected Bidang
        filteredDosenForDosji1.forEach((dosen) => {
          const option = document.createElement("option");
          option.value = dosen.Nama; // Set dosen name as the value
          option.textContent = `${dosen.Nama} (${dosen.Fungsional})`; // Display dosen details
          optgroup.appendChild(option);
        });
        dosji1Dropdown.appendChild(optgroup); // Add the optgroup to the dropdown
        dosji1Dropdown.disabled = false;
        dosji1Dropdown.value = editData.Penguji_1;
      }

      // Group dosji2 options by Bidang using <optgroup>, excluding the selected Bidang
      const groupedDosenForDosji2 = dosenData.reduce((groups, dosen) => {
        if (
          validFungsional.includes(dosen.Fungsional) &&
          dosen.Nama !== dosbing1Value && // Exclude Dosen already in dosbing1
          dosen.Nama !== dosbing2Value && // Exclude Dosen already in dosbing2
          dosen.Bidang !== selectedBidang // Exclude Dosen with the same Bidang as input bidang
        ) {
          if (!groups[dosen.Bidang]) {
            groups[dosen.Bidang] = [];
          }
          groups[dosen.Bidang].push(dosen);
        }
        return groups;
      }, {});

      if (Object.keys(groupedDosenForDosji2).length === 0) {
        dosji2Dropdown.disabled = true;
        console.warn("No Dosen found matching valid criteria for dosji2.");
      } else {
        Object.entries(groupedDosenForDosji2).forEach(([bidang, dosenList]) => {
          const optgroup = document.createElement("optgroup");
          optgroup.label = bidang;
          dosenList.forEach((dosen) => {
            const option = document.createElement("option");
            option.value = dosen.Nama; // Set dosen name as the value
            option.textContent = `${dosen.Nama} (${dosen.Fungsional})`; // Display dosen details
            optgroup.appendChild(option);
          });
          dosji2Dropdown.appendChild(optgroup);
        });
        dosji2Dropdown.disabled = false;

        dosji2Dropdown.value = editData.Penguji_2;
      }
    }
  } catch (error) {
    console.error("Error:", error);
    showToast("Gagal memuat data.", "error");
  }
});

document.getElementById("konfirmasi-sempro").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(`https://api.sheetbest.com/sheets/a4e0b8ce-db68-4e5f-b0ff-d22f47fe3a0f/tabs/Sempro/NPM/${data.NPM}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      showToast("Data berhasil diperbarui!", "success", true);
    } else {
      showToast("Gagal memperbarui data.", "error");
    }
  } catch (error) {
    console.error("Error updating data:", error);
    showToast("Terjadi kesalahan.", "error");
  }
});

function showToast(message, type, redirect = false) {
  const toastMessage = document.getElementById("toastMessage");
  const toastTitle = document.getElementById("toastTitle");
  const toastBody = document.getElementById("toastBody");

  toastBody.textContent = message;
  toastTitle.textContent = type === "success" ? "Berhasil" : "Error";

  if (type === "success") {
    toastMessage.classList.remove("text-bg-danger");
    toastMessage.classList.add("text-bg-success");
  } else {
    toastMessage.classList.remove("text-bg-success");
    toastMessage.classList.add("text-bg-danger");
  }

  const toast = new bootstrap.Toast(toastMessage);
  toast.show();

  // Redirect to login.html page on success if 'redirect' is true
  if (redirect) {
    setTimeout(() => {
      window.location.href = `mahasiswa.html?NPM=${selectedNPMsempro}`; // Redirect to profile.html
    }, 2000); // Adjust delay if necessary
  }
}
