const user = JSON.parse(localStorage.getItem("loggedInUser"));

const urlParams = new URLSearchParams(window.location.search);
const selectedNPM = urlParams.get("NPM");

if (!user) {
  console.error("User is not logged in.");
  window.location.href = "login_dosen.html";
  // return;
} else if (user.Status === "Mahasiswa") {
  console.error("Hanya untuk dosen");
  window.location.href = "login.html";
}

// Helper function to update content and manage button visibility
function updateContent(elementId, content, relatedButtonId) {
  const element = document.getElementById(elementId);
  const value = (content || "").trim();

  // Set the content or default to "data kosong"
  element.textContent = value || "data kosong";

  // Handle button visibility and profile visibility explicitly
  const relatedButton = document.getElementById(relatedButtonId);
  const profileDrive = document.getElementById("btn-link");

  // status
  const statusPra = document.getElementById("pra-status");
  const pengajuanPra = document.getElementById("pra-pengajuan");

  const statusSempro = document.getElementById("sempro-status");
  const pengajuanSempro = document.getElementById("sempro-pengajuan");

  const statusSemhas = document.getElementById("semhas-status");
  const pengajuanSemhas = document.getElementById("semhas-pengajuan");

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
  } else if (statusPra.textContent === "Diterima") {
    statusPra.classList.remove("text-black");
    statusPra.classList.add("btn", "btn-success", "fw-bold");
  } else if (statusPra.textContent === "Ditolak") {
    statusPra.classList.remove("text-black");
    statusPra.classList.add("btn", "btn-danger", "fw-bold");
  }
  // sempro
  if (statusSempro.textContent === "Diproses") {
    statusSempro.classList.remove("text-black");
    statusSempro.classList.add("btn", "btn-warning", "fw-bold");
  } else if (statusSempro.textContent === "Diterima") {
    statusSempro.classList.remove("text-black");
    statusSempro.classList.add("btn", "btn-success", "fw-bold");
  } else if (statusSempro.textContent === "Ditolak") {
    statusSempro.classList.remove("text-black");
    statusSempro.classList.add("btn", "btn-danger", "fw-bold");
  }
  // semhas
  if (statusSemhas.textContent === "Diproses") {
    statusSemhas.classList.remove("text-black");
    statusSemhas.classList.add("btn", "btn-warning", "fw-bold");
  } else if (statusSemhas.textContent === "Diterima") {
    statusSemhas.classList.remove("text-black");
    statusSemhas.classList.add("btn", "btn-success", "fw-bold");
  } else if (statusSemhas.textContent === "Ditolak") {
    statusSemhas.classList.remove("text-black");
    statusSemhas.classList.add("btn", "btn-danger", "fw-bold");
  }
}

// Fetch and display user profile data
function loadUserProfile() {
  // Fetch and display user data from Mahasiswa tab
  fetch(`https://api.sheetbest.com/sheets/a4e0b8ce-db68-4e5f-b0ff-d22f47fe3a0f/tabs/Mahasiswa?NPM=${selectedNPM}`)
    .then((response) => response.json())
    .then((data) => {
      const userProfileData = data.find((entry) => entry.NPM === selectedNPM);
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
          profileDrive.classList.add("text-white", "text-decoration-none"); // Optional: add styles
          document.getElementById("btn-link").disabled = true;

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
        console.warn(`No matching data found for NPM: ${selectedNPM}`);
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
  fetch(`https://api.sheetbest.com/sheets/a4e0b8ce-db68-4e5f-b0ff-d22f47fe3a0f/tabs/Praproposal?NPM=${selectedNPM}`)
    .then((response) => response.json())
    .then((data) => {
      const userSkripsiData = data.find((entry) => entry.NPM === selectedNPM);
      if (userSkripsiData) {
        updateContent("pra-tanggal", userSkripsiData.Tanggal);
        updateContent("pra-bidang", userSkripsiData.Bidang);
        updateContent("pra-judul", userSkripsiData.Judul);
        updateContent("pra-dosbing1", userSkripsiData.Pembimbing_1);
        updateContent("pra-dosbing2", userSkripsiData.Pembimbing_2);
        updateContent("pra-status", userSkripsiData.Status);
      } else {
        console.warn(`No matching Praproposal data found for NPM: ${selectedNPM}`);
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
  fetch(`https://api.sheetbest.com/sheets/a4e0b8ce-db68-4e5f-b0ff-d22f47fe3a0f/tabs/Sempro?NPM=${selectedNPM}`)
    .then((response) => response.json())
    .then((data) => {
      const userDataSempro = data.find((entry) => entry.NPM === selectedNPM);
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
  fetch(`https://api.sheetbest.com/sheets/a4e0b8ce-db68-4e5f-b0ff-d22f47fe3a0f/tabs/Semhas?NPM=${selectedNPM}`)
    .then((response) => response.json())
    .then((data) => {
      const userDataSemhas = data.find((entry) => entry.NPM === selectedNPM);
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
