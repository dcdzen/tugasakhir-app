const user = JSON.parse(localStorage.getItem("loggedInUser"));
console.warn(`${user.NPM}`);
const storedNPM = `${user.NPM}`;

document.addEventListener("DOMContentLoaded", async () => {
  // Retrieve NPM from localStorage

  if (!storedNPM) {
    showToast("NPM tidak ditemukan di localStorage.", "error");
    return;
  }

  // Fetch data from the API Praproposal
  try {
    const response = await fetch("https://api.sheetbest.com/sheets/506f8840-a871-4430-b4c5-ff4c7926af72/tabs/Praproposal");
    if (!response.ok) {
      throw new Error("Failed to fetch data from API.");
    }

    const data = await response.json();

    // Find a record matching the NPM
    const matchingRecord = data.find((item) => item.NPM === storedNPM);

    if (matchingRecord) {
      document.getElementById("npm").value = matchingRecord.NPM;
      document.getElementById("nama").value = matchingRecord.Nama.toUpperCase();
      document.getElementById("bidang").value = matchingRecord.Bidang;
      document.getElementById("dosbing1").value = matchingRecord.Pembimbing_1;

      // Check if Pembimbing_2 is empty or null
      if (matchingRecord.Pembimbing_2 && matchingRecord.Pembimbing_2.trim() !== "") {
        document.getElementById("dosbing2").value = matchingRecord.Pembimbing_2;
      } else {
        document.getElementById("dosbing2").value = "Tidak Ada";
      }

      document.getElementById("judul").value = matchingRecord.Judul;
    } else {
      showToast("Data not found for this NPM.", "error");
    }
  } catch (error) {
    console.error("Error:", error);
    showToast("Terjadi kesalahan saat memuat data.", "error");
  }

  // Fetch the Dosen data from the API Dosen
  try {
    const response = await fetch("https://api.sheetbest.com/sheets/506f8840-a871-4430-b4c5-ff4c7926af72/tabs/Dosen");
    if (!response.ok) {
      throw new Error("Failed to fetch data from Dosen API.");
    }

    const dosenData = await response.json();
    const bidangElement = document.getElementById("bidang");
    const dosji1Dropdown = document.getElementById("dosji1");
    const dosji2Dropdown = document.getElementById("dosji2");
    const dosbing1Value = document.getElementById("dosbing1").value; // Get the selected value of dosbing1
    const dosbing2Value = document.getElementById("dosbing2").value; // Get the selected value of dosbing2

    // Predefined valid fungsional options
    const validFungsional = ["Lektor", "Lektor Kepala", "Asisten Ahli"];

    // Ensure the "bidang" element exists and has a value
    if (!bidangElement || !bidangElement.value) {
      throw new Error("Bidang value is not available for filtering.");
    }

    const selectedBidang = bidangElement.value;

    // Populate dosji1 options, grouped under the selected Bidang
    dosji1Dropdown.innerHTML = '<option value="" disabled selected>Pilih Dosen</option>'; // Clear existing options
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
    }

    // Group dosji2 options by Bidang using <optgroup>, excluding the selected Bidang
    dosji2Dropdown.innerHTML = '<option value="" disabled selected>Pilih Dosen</option>'; // Clear existing options
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
    }
  } catch (error) {
    console.error("Error fetching Dosen data:", error);
    showToast("Gagal memuat data dosen.", "error");
  }
});

document.getElementById("judul").addEventListener("input", function () {
  this.value = this.value.toUpperCase();
});

// checker
document.addEventListener("DOMContentLoaded", () => {
  const checkbox1 = document.getElementById("flexCheckDefault1");
  const checkbox2 = document.getElementById("flexCheckDefault2");
  const checkbox3 = document.getElementById("flexCheckDefault3");
  const submitButton = document.querySelector('button[type="submit"]');

  // Initially disable the submit button
  submitButton.disabled = true;

  // Enable the submit button if both checkboxes are checked
  function toggleSubmitButton() {
    submitButton.disabled = !(checkbox1.checked && checkbox2.checked && checkbox3.checked);
  }

  // Add event listeners for both checkboxes
  checkbox1.addEventListener("change", toggleSubmitButton);
  checkbox2.addEventListener("change", toggleSubmitButton);
  checkbox3.addEventListener("change", toggleSubmitButton);
});

// submit
document.getElementById("add-data-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Set current date to the date input field in 'day month year' format
  const dateInput = document.getElementById("date");
  const currentDate = new Date();
  const options = { day: "numeric", month: "long", year: "numeric" }; // Format as '1 Januari 2024'
  const formattedDate = new Intl.DateTimeFormat("id-ID", options).format(currentDate); // Indonesian locale
  dateInput.value = formattedDate;

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  // Log the data to see the collected form data
  console.log("Form Data Submitted:", data);

  const npm = data.NPM; // Get the NPM value from form data

  // Check if NPM already exists
  try {
    const getResponse = await fetch("https://api.sheetbest.com/sheets/506f8840-a871-4430-b4c5-ff4c7926af72/tabs/Sempro");
    if (!getResponse.ok) {
      throw new Error("Failed to fetch existing data");
    }

    const existingData = await getResponse.json();
    const npmExists = existingData.some((item) => item.NPM === npm); // Check if NPM already exists

    if (npmExists) {
      showToast("NPM sudah terdaftar!", "error");
      return; // Stop further form submission
    }

    // If NPM doesn't exist, proceed with the data submission
    const postResponse = await fetch("https://api.sheetbest.com/sheets/506f8840-a871-4430-b4c5-ff4c7926af72/tabs/Sempro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (postResponse.ok) {
      showToast("Data berhasil ditambahkan!", "success", true);
      e.target.reset();
    } else {
      showToast("Gagal menambahkan data.", "error");
    }
  } catch (error) {
    console.error("Error:", error);
    showToast("Terjadi kesalahan.", "error");
  }
});

document.getElementById("nama").addEventListener("input", function () {
  this.value = this.value.toUpperCase();
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
      window.location.href = "profile.html"; // Redirect to profile.html
    }, 2000); // Adjust delay if necessary
  }
}

document.getElementById("jamMulai").addEventListener("input", function () {
  const startTime = this.value;

  if (startTime) {
    // Extract hours and minutes from the start time
    let [startHours, startMinutes] = startTime.split(":").map((num) => parseInt(num, 10));

    // Add 1 hour and 30 minutes to the start time
    startMinutes += 60;
    if (startMinutes >= 60) {
      startMinutes -= 60;
      startHours += 1;
    }

    // Format new time as HH:MM
    const endTime = `${String(startHours).padStart(2, "0")}:${String(startMinutes).padStart(2, "0")}`;

    // Set the end time field
    document.getElementById("jamSelesai").value = endTime;
  }
});
