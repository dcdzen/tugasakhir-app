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

  const npm = data.NPM; // Get the NPM value from form data

  // Check if NPM already exists
  try {
    const getResponse = await fetch("https://api.sheetbest.com/sheets/a4e0b8ce-db68-4e5f-b0ff-d22f47fe3a0f/tabs/Mahasiswa");
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
    const postResponse = await fetch("https://api.sheetbest.com/sheets/a4e0b8ce-db68-4e5f-b0ff-d22f47fe3a0f/tabs/Mahasiswa", {
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
      window.location.href = "login.html"; // Redirect to login page after 2 seconds (adjust time as needed)
    }, 2000); // Adjust delay if necessary
  }
}
