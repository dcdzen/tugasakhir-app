const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user) {
  console.error("User is not logged in.");
  window.location.href = "login.html";
  // return;
}

document.addEventListener("DOMContentLoaded", async () => {
  // Retrieve NPM from localStorage

  // Fetch data from the API Mahasiswa
  try {
    const response = await fetch("https://api.sheetbest.com/sheets/506f8840-a871-4430-b4c5-ff4c7926af72/tabs/Mahasiswa");
    if (!response.ok) {
      throw new Error("Failed to fetch data from API.");
    }

    const data = await response.json();

    // Find a record matching the NPM
    const matchingRecord = data.find((item) => item.NPM === user.NPM);

    if (matchingRecord) {
      // Populate NPM and Nama fields
      document.getElementById("npm").value = user.NPM;
      document.getElementById("nama").value = user.Nama;
    } else {
      showToast("Data dengan NPM ini tidak ditemukan.", "error");
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
    const bidangSet = new Set(); // To store unique bidang values
    const bidangDropdown = document.getElementById("bidang");
    const dosenDropdown = document.getElementById("dosbing");

    // Predefined valid fungsional options
    const validFungsional = ["Lektor", "Lektor Kepala", "Asisten Ahli"];

    // Extract unique bidang values
    dosenData.forEach((item) => {
      if (item.Bidang) {
        bidangSet.add(item.Bidang);
      }
    });

    // Populate the bidang dropdown
    bidangSet.forEach((bidang) => {
      const option = document.createElement("option");
      option.value = bidang;
      option.textContent = bidang;
      bidangDropdown.appendChild(option);
    });

    // Add event listener for bidang selection
    bidangDropdown.addEventListener("change", () => {
      const selectedBidang = bidangDropdown.value;
      dosenDropdown.innerHTML = '<option value="" disabled selected>Pilih Dosen</option>'; // Clear existing options

      // Filter and populate dosen options based on selected bidang, valid fungsional, and slot value
      dosenData
        .filter(
          (dosen) => dosen.Bidang === selectedBidang && validFungsional.includes(dosen.Fungsional) && parseInt(dosen.Slot, 10) !== 13 // Exclude dosen with Slot equal to 13
        )
        .forEach((dosen) => {
          const option = document.createElement("option");
          option.value = dosen.Nama; // Store dosen name in the option value
          option.textContent = `${dosen.Nama} (${dosen.Slot} Slot)`;
          dosenDropdown.appendChild(option);
        });

      // Enable the dosen dropdown when options are available
      dosenDropdown.disabled = dosenDropdown.options.length <= 1;
    });

    // Initially disable dosen dropdown until bidang is selected
    dosenDropdown.disabled = true;
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
  const checkbox1 = document.getElementById("flexCheckDefault");
  const checkbox2 = document.getElementById("flexCheckPrivacy");
  const submitButton = document.querySelector('button[type="submit"]');

  // Initially disable the submit button
  submitButton.disabled = true;

  // Enable the submit button if both checkboxes are checked
  function toggleSubmitButton() {
    submitButton.disabled = !(checkbox1.checked && checkbox2.checked);
  }

  // Add event listeners for both checkboxes
  checkbox1.addEventListener("change", toggleSubmitButton);
  checkbox2.addEventListener("change", toggleSubmitButton);
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
    const getResponse = await fetch("https://api.sheetbest.com/sheets/506f8840-a871-4430-b4c5-ff4c7926af72/tabs/Praproposal");
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
    const postResponse = await fetch("https://api.sheetbest.com/sheets/506f8840-a871-4430-b4c5-ff4c7926af72/tabs/Praproposal", {
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
