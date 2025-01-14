const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user) {
  console.error("User is not logged in.");
  window.location.href = "login.html";
  // return;

  if (user.Status === "Mahasiswa") {
    document.getElementById("cek-profile").href = "profile.html";
  } else if (user.Status === "Dosen") {
    document.getElementById("cek-profile").href = "profile_dosen.html";
  }
}

// status
const statusPra = document.getElementById("pra-status");
const pengajuanPra = document.getElementById("pra-pengajuan");

const statusSempro = document.getElementById("sempro-status");
const deleteSempro = document.getElementById("sempro-delete");
const pengajuanSempro = document.getElementById("sempro-pengajuan");

const statusSemhas = document.getElementById("semhas-status");
const deleteSemhas = document.getElementById("semhas-delete");
const pengajuanSemhas = document.getElementById("semhas-pengajuan");

// Helper function to update content and manage button visibility
function updateContent(elementId, content, relatedButtonId) {
  const element = document.getElementById(elementId);
  const value = (content || "").trim();

  // Set the content or default to "data kosong"
  element.textContent = value || "data kosong";

  // Handle button visibility and profile visibility explicitly
  const relatedButton = document.getElementById(relatedButtonId);
  const profileDrive = document.getElementById("btn-link");

  pengajuanSempro.classList.add("disabled");
  pengajuanSemhas.classList.add("disabled");

  // Hide/show relatedButton
  if (relatedButton) {
    if (value === "" || value === "data kosong") {
      relatedButton.hidden = false;
      if (profileDrive) {
        profileDrive.hidden = true; // Show profile-drive if button is hidden
      }
    } else {
      relatedButton.hidden = true;
      if (profileDrive) {
        profileDrive.hidden = false; // Hide profile-drive if button is visible
      }
    }
  }

  // Apply styling for empty or default values
  if (value === "" || value === "data kosong") {
    element.classList.add("text-danger");
    element.classList.remove("text-black");
  } else {
    element.classList.add("text-black");
    element.classList.remove("text-danger");
  }

  // pra
  if (statusPra.textContent === "Diproses") {
    statusPra.classList.remove("text-black");
    statusPra.classList.add("btn", "btn-warning", "fw-bold");

    pengajuanPra.classList.add("disabled");
  } else if (statusPra.textContent === "Diterima") {
    statusPra.classList.remove("text-black");
    statusPra.classList.add("btn", "btn-success", "fw-bold");

    pengajuanPra.classList.add("disabled");

    pengajuanSempro.classList.remove("disabled");
  } else if (statusPra.textContent === "Ditolak") {
    statusPra.classList.remove("text-black");
    statusPra.classList.add("btn", "btn-danger", "fw-bold");

    pengajuanPra.classList.add("disabled");
  }
  // sempro
  if (statusSempro.textContent === "Diproses") {
    statusSempro.classList.remove("text-black");
    statusSempro.classList.add("btn", "btn-warning", "fw-bold");

    deleteSempro.hidden = true;

    pengajuanSempro.classList.add("disabled");
  } else if (statusSempro.textContent === "Diterima") {
    statusSempro.classList.remove("text-black");
    statusSempro.classList.add("btn", "btn-success", "fw-bold");

    deleteSempro.hidden = true;

    pengajuanSempro.classList.add("disabled");

    pengajuanSemhas.classList.remove("disabled");
  } else if (statusSempro.textContent === "Ditolak") {
    statusSempro.classList.remove("text-black");
    statusSempro.classList.add("btn", "btn-danger", "fw-bold");

    deleteSempro.hidden = false;

    pengajuanSempro.classList.add("disabled");
  } else {
    deleteSempro.hidden = true;
  }
  // semhas
  if (statusSemhas.textContent === "Diproses") {
    statusSemhas.classList.remove("text-black");
    statusSemhas.classList.add("btn", "btn-warning", "fw-bold");

    deleteSemhas.hidden = true;

    pengajuanSemhas.classList.add("disabled");
  } else if (statusSemhas.textContent === "Diterima") {
    statusSemhas.classList.remove("text-black");
    statusSemhas.classList.add("btn", "btn-success", "fw-bold");

    deleteSemhas.hidden = true;

    pengajuanSemhas.classList.add("disabled");
  } else if (statusSemhas.textContent === "Ditolak") {
    statusSemhas.classList.remove("text-black");
    statusSemhas.classList.add("btn", "btn-danger", "fw-bold");

    deleteSemhas.hidden = false;

    pengajuanSemhas.classList.add("disabled");
  } else {
    deleteSemhas.hidden = true;
  }
}

// Fetch and display user profile data
function loadUserProfile() {
  // Fetch and display user data from Mahasiswa tab
  fetch(`https://api.sheetbest.com/sheets/a4e0b8ce-db68-4e5f-b0ff-d22f47fe3a0f/tabs/Mahasiswa?NPM=${user.NPM}`)
    .then((response) => response.json())
    .then((data) => {
      const userProfileData = data.find((entry) => entry.NPM === user.NPM);
      if (userProfileData) {
        updateContent("profile-npm", userProfileData.NPM);
        updateContent("profile-password", userProfileData.Password);
        updateContent("profile-nama", userProfileData.Nama);
        updateContent("profile-email", userProfileData.Email);
        updateContent("profile-telepon", userProfileData.Telepon);
        updateContent("profile-tanggal-akun", userProfileData.Tanggal);
        updateContent("profile-drive", userProfileData.Drive, "btn-drive");
        updateContent("drive-pra", userProfileData.Praproposal);

        const profileDrive = document.getElementById("profile-drive");
        // Handle "Drive" in Praproposal
        const drivePra = document.getElementById("drive-pra");
        drivePra.href = userProfileData.Praproposal; // Add the actual href value
        // Handle "Drive" in Sempro
        const driveSempro = document.getElementById("drive-sempro");
        driveSempro.href = userProfileData.Sempro; // Add the actual href value
        // Handle "Drive" in Semhas
        const driveSemhas = document.getElementById("drive-semhas");
        driveSemhas.href = userProfileData.Semhas; // Add the actual href value

        if (userProfileData.Drive && userProfileData.Drive !== "data kosong") {
          // utama
          profileDrive.href = userProfileData.Drive;
          profileDrive.textContent = "Lihat Folder"; // Set custom text
          profileDrive.classList.add("text-white", "text-decoration-none");

          // pra
          drivePra.textContent = "Lihat Folder"; // Update button text
          drivePra.classList.add("text-white", "text-decoration-none"); // Optional: add styles

          // sempro
          driveSempro.textContent = "Lihat Folder"; // Update button text
          driveSempro.classList.add("text-white", "text-decoration-none"); // Optional: add styles

          // semhas
          driveSemhas.textContent = "Lihat Folder"; // Update button text
          driveSemhas.classList.add("text-white", "text-decoration-none"); // Optional: add styles
        } else {
          profileDrive.href = "#";
          profileDrive.textContent = "Folder Drive Utama Tidak Tersedia"; // Fallback text

          pengajuanPra.classList.add("disabled");
          pengajuanSempro.classList.add("disabled");
          pengajuanSemhas.classList.add("disabled");

          drivePra.href = "#"; // No link available
          drivePra.textContent = "Drive Pra Proposal Tidak Tersedia"; // Update text when link is not available
          drivePra.classList.add("text-white", "text-decoration-none"); // Optional: add styles
          document.getElementById("btn-link-pra").disabled = true;

          driveSempro.href = "#"; // No link available
          driveSempro.textContent = "Drive Seminar Proposal Tidak Tersedia"; // Update text when link is not available
          driveSempro.classList.add("text-white", "text-decoration-none"); // Optional: add styles
          document.getElementById("btn-link-sempro").disabled = true;

          driveSemhas.href = "#"; // No link available
          driveSemhas.textContent = "Drive Seminar Hasil Tidak Tersedia"; // Update text when link is not available
          driveSemhas.classList.add("text-white", "text-decoration-none"); // Optional: add styles
          document.getElementById("btn-link-semhas").disabled = true;
        }
      } else {
        console.warn(`No matching data found for NPM: ${user.NPM}`);
        updateContent("profile-npm", "data kosong");
        updateContent("profile-password", "data kosong");
        updateContent("profile-nama", "data kosong");
        updateContent("profile-email", "data kosong");
        updateContent("profile-telepon", "data kosong");
        updateContent("profile-tanggal-akun", "data kosong");
        updateContent("profile-drive", "data kosong", "btn-drive");
      }
    })
    .catch((error) => {
      console.error("Error fetching Mahasiswa data:", error);
    });

  // Fetch and display Praproposal data
  fetch(`https://api.sheetbest.com/sheets/a4e0b8ce-db68-4e5f-b0ff-d22f47fe3a0f/tabs/Praproposal?NPM=${user.NPM}`)
    .then((response) => response.json())
    .then((data) => {
      const userSkripsiData = data.find((entry) => entry.NPM === user.NPM);
      if (userSkripsiData) {
        updateContent("pra-tanggal", userSkripsiData.Tanggal);
        updateContent("pra-bidang", userSkripsiData.Bidang);
        updateContent("pra-judul", userSkripsiData.Judul);
        updateContent("pra-dosbing1", userSkripsiData.Pembimbing_1);
        updateContent("pra-dosbing2", userSkripsiData.Pembimbing_2);
        updateContent("pra-status", userSkripsiData.Status);
      } else {
        console.warn(`No matching Praproposal data found for NPM: ${user.NPM}`);
        updateContent("pra-tanggal", "data kosong");
        updateContent("pra-bidang", "data kosong");
        updateContent("pra-judul", "data kosong");
        updateContent("pra-dosbing1", "data kosong");
        updateContent("pra-dosbing2", "data kosong");
        updateContent("pra-status", "data kosong");
      }
    })
    .catch((error) => {
      console.error("Error fetching Praproposal data:", error);
    });

  // Fetch and display Sempro data
  fetch(`https://api.sheetbest.com/sheets/a4e0b8ce-db68-4e5f-b0ff-d22f47fe3a0f/tabs/Sempro?NPM=${user.NPM}`)
    .then((response) => response.json())
    .then((data) => {
      const userDataSempro = data.find((entry) => entry.NPM === user.NPM);
      if (userDataSempro) {
        updateContent("sempro-tanggal", userDataSempro.Tanggal);
        updateContent("sempro-bidang", userDataSempro.Bidang);
        updateContent("sempro-judul", userDataSempro.Judul);
        updateContent("sempro-dosbing1", userDataSempro.Pembimbing_1);
        updateContent("sempro-dosbing2", userDataSempro.Pembimbing_2);
        updateContent("sempro-dosji1", userDataSempro.Penguji_1);
        updateContent("sempro-dosji2", userDataSempro.Penguji_2);
        updateContent("sempro-jadwal", userDataSempro.Jadwal);
        updateContent("sempro-jam", userDataSempro.Jam_Mulai + " - " + userDataSempro.Jam_Selesai + " WIB");
        updateContent("sempro-tempat", userDataSempro.Tempat);
        updateContent("sempro-status", userDataSempro.Status);
      } else {
        console.warn(`No matching Sempro data found for NPM: ${user.NPM}`);
        updateContent("sempro-tanggal", "data kosong");
        updateContent("sempro-bidang", "data kosong");
        updateContent("sempro-judul", "data kosong");
        updateContent("sempro-dosbing1", "data kosong");
        updateContent("sempro-dosbing2", "data kosong");
        updateContent("sempro-dosji1", "data kosong");
        updateContent("sempro-dosji2", "data kosong");
        updateContent("sempro-jadwal", "data kosong");
        updateContent("sempro-jam", "data kosong");
        updateContent("sempro-tempat", "data kosong");
        updateContent("sempro-status", "data kosong");
      }
    })
    .catch((error) => {
      console.error("Error fetching Praproposal data:", error);
    });

  // Fetch and display Semhas data
  fetch(`https://api.sheetbest.com/sheets/a4e0b8ce-db68-4e5f-b0ff-d22f47fe3a0f/tabs/Semhas?NPM=${user.NPM}`)
    .then((response) => response.json())
    .then((data) => {
      const userDataSemhas = data.find((entry) => entry.NPM === user.NPM);
      if (userDataSemhas) {
        updateContent("semhas-tanggal", userDataSemhas.Tanggal);
        updateContent("semhas-bidang", userDataSemhas.Bidang);
        updateContent("semhas-judul", userDataSemhas.Judul);
        updateContent("semhas-dosbing1", userDataSemhas.Pembimbing_1);
        updateContent("semhas-dosbing2", userDataSemhas.Pembimbing_2);
        updateContent("semhas-dosji1", userDataSemhas.Penguji_1);
        updateContent("semhas-dosji2", userDataSemhas.Penguji_2);
        updateContent("semhas-jadwal", userDataSemhas.Jadwal);
        updateContent("semhas-jam", userDataSemhas.Jam_Mulai + " - " + userDataSemhas.Jam_Selesai + " WIB");
        updateContent("semhas-tempat", userDataSemhas.Tempat);
        updateContent("semhas-status", userDataSemhas.Status);
      } else {
        console.warn(`No matching Semhas data found for NPM: ${user.NPM}`);
        updateContent("semhas-tanggal", "data kosong");
        updateContent("semhas-bidang", "data kosong");
        updateContent("semhas-judul", "data kosong");
        updateContent("semhas-dosbing1", "data kosong");
        updateContent("semhas-dosbing2", "data kosong");
        updateContent("semhas-dosji1", "data kosong");
        updateContent("semhas-dosji2", "data kosong");
        updateContent("semhas-jadwal", "data kosong");
        updateContent("semhas-jam", "data kosong");
        updateContent("semhas-tempat", "data kosong");
        updateContent("semhas-status", "data kosong");
      }
    })
    .catch((error) => {
      console.error("Error fetching Praproposal data:", error);
    });
}

// Modify deleteData to show the alert based on success or failure
// async function deleteData() {
//   try {
//     const response = await fetch(`https://api.sheetbest.com/sheets/a4e0b8ce-db68-4e5f-b0ff-d22f47fe3a0f/tabs/Sempro/NPM/${user.NPM}`, {
//       method: "DELETE",
//     });

//     if (response.ok) {
//       showAlertPopup("Data berhasil dihapus", false); // Success message
//       console.error("Berhasil!");
//     } else {
//       throw new Error("Gagal menghapus data");
//     }
//   } catch (error) {
//     console.error("Error deleting data:", error);
//     showAlertPopup("Terjadi kesalahan saat menghapus data", true); // Error message
//   }
// }

// handle delete
document.getElementById("sempro-delete").addEventListener("click", () => {
  try {
    fetch(`https://api.sheetbest.com/sheets/a4e0b8ce-db68-4e5f-b0ff-d22f47fe3a0f/tabs/Sempro/NPM/${user.NPM}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting data:", error);
    showAlertPopup("Terjadi kesalahan saat menghapus data", true); // Error message
  }
  // Hide alert after 2 seconds and refresh page
  setTimeout(() => {
    window.location.reload(); // Refresh page
  }, 1000); // 2 seconds delay
});

// PW
document.getElementById("pw-gen").addEventListener("click", () => {
  var chars = "0123456789";
  var passwordLength = 5;
  var password = "";
  for (var i = 0; i <= passwordLength; i++) {
    var randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber + 1);
  }
  document.getElementById("edit-password").value = password;
});

document.getElementById("semhas-delete").addEventListener("click", () => {
  try {
    fetch(`https://api.sheetbest.com/sheets/a4e0b8ce-db68-4e5f-b0ff-d22f47fe3a0f/tabs/Semhas/NPM/${user.NPM}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting data:", error);
    showAlertPopup("Terjadi kesalahan saat menghapus data", true); // Error message
  }
  // Hide alert after 2 seconds and refresh page
  setTimeout(() => {
    window.location.reload(); // Refresh page
  }, 1000); // 2 seconds delay
});

// Handle logout
document.getElementById("logout-button").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
});

// Fetch and display edit data
fetch(`https://api.sheetbest.com/sheets/a4e0b8ce-db68-4e5f-b0ff-d22f47fe3a0f/tabs/Mahasiswa?NPM=${user.NPM}`)
  .then((response) => response.json())
  .then((data) => {
    const userDataMahasiswa = data.find((entry) => entry.NPM === user.NPM);
    if (userDataMahasiswa) {
      // Pre-fill the edit form with current user data
      document.getElementById("edit-password").value = userDataMahasiswa.Password;
      document.getElementById("edit-nama").value = userDataMahasiswa.Nama;
      document.getElementById("edit-email").value = userDataMahasiswa.Email;
      document.getElementById("edit-telepon").value = userDataMahasiswa.Telepon;

      // Handle the profile edit form submission
      document.getElementById("profile-edit-form").addEventListener("submit", async (event) => {
        event.preventDefault();

        // Get the updated values from the form
        const updatedUser = {
          Tanggal: userDataMahasiswa.Tanggal,
          NPM: userDataMahasiswa.NPM,
          Nama: document.getElementById("edit-nama").value,
          Email: document.getElementById("edit-email").value,
          Telepon: document.getElementById("edit-telepon").value,
          Password: document.getElementById("edit-password").value,
          Drive: userDataMahasiswa.Drive,
          Praproposal: userDataMahasiswa.Praproposal,
          Sempro: userDataMahasiswa.Sempro,
          Semhas: userDataMahasiswa.Semhas,
        };

        try {
          // Make a PUT request to update the Google Sheet
          const response = await fetch(`https://api.sheetbest.com/sheets/a4e0b8ce-db68-4e5f-b0ff-d22f47fe3a0f/tabs/Mahasiswa/NPM/${user.NPM}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUser),
          });

          if (response.ok) {
            // Extract only the required fields
            const simplifiedUser = {
              NPM: userDataMahasiswa.NPM,
              Nama: document.getElementById("edit-nama").value,
              Status: "Mahasiswa",
            };

            // Store the simplified user object in localStorage
            localStorage.setItem("loggedInUser", JSON.stringify(simplifiedUser));

            // Update the displayed profile info with the new data
            loadUserProfile();
          } else {
            alert("Gagal mengupdate data di Google Sheets.");
          }
        } catch (error) {
          console.error("Error updating data:", error);
          alert("Terjadi kesalahan saat mengupdate data.");
        }
      });
    } else {
      console.warn(`No matching Mahasiswa data found for NPM: ${user.NPM}`);
    }
  })
  .catch((error) => {
    console.error("Error fetching Mahasiswa data:", error);
  });

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

// Load user profile when the page is loaded
window.onload = loadUserProfile;
