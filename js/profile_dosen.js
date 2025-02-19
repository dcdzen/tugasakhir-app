const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user) {
  console.error("User is not logged in.");
  window.location.href = "login_dosen.html";
  // return;
} else if (user.Status === "Mahasiswa") {
  console.error("Hanya untuk dosen");
  window.location.href = "login_dosen.html";
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

async function renderButton() {
  const responseCallDrive = await fetch("https://api.sheetbest.com/sheets/506f8840-a871-4430-b4c5-ff4c7926af72/tabs/Drive");
  const callDriveData = await responseCallDrive.json();
  const callDrive = callDriveData.find((item) => item.Drive !== null);

  if (callDrive.Drive) {
    document.getElementById("info-create").textContent = "Folder Sudah Dibuat";
    document.getElementById("info-create").disabled = true;

    document.getElementById("link-drive").href = callDriveData.find((item) => item.No === "1").Drive;
    document.getElementById("link-drive-mahasiswa").href = callDriveData.find((item) => item.No === "2").Drive;
    document.getElementById("link-formlab").href = callDriveData.find((item) => item.No === "5").Drive;
    document.getElementById("link-st").href = callDriveData.find((item) => item.No === "6").Drive;
  } else {
    console.log("Link tidak ditemukan!");

    document.getElementById("info-drive").hidden = true;
    document.getElementById("info-create").hidden = false;
  }

  const responseCallDosen = await fetch("https://api.sheetbest.com/sheets/506f8840-a871-4430-b4c5-ff4c7926af72/tabs/Dosen");
  const callDosenData = await responseCallDosen.json();
  const callDosen = callDosenData.filter((item) => item.Fungsional === "Admin");

  // Determine admin status
  let isAdmin = false;

  for (let i = 0; i < callDosen.length; i++) {
    const dosen = callDosen[i];
    if (dosen.NIP === user.NIP) {
      isAdmin = true;
      console.log("admin");

      document.getElementById("info-drive").hidden = false;
      document.getElementById("info-drive-mahasiswa").hidden = false;

      document.getElementById("info-dosen").hidden = true;

      break; // Stop checking once admin status is confirmed
    } else {
      console.log("bukan admin");

      document.getElementById("info-drive").hidden = true;
      document.getElementById("info-drive-mahasiswa").hidden = true;

      document.getElementById("info-dosen").hidden = false;
    }
  }
}
renderButton();

// Fetch user data from local storage
function loadUserProfile() {
  // Fetch and display user data from Dosen tab
  fetch(`https://api.sheetbest.com/sheets/506f8840-a871-4430-b4c5-ff4c7926af72/tabs/Dosen?NIP=${user.NIP}`)
    .then((response) => response.json())
    .then((data) => {
      const userDosen = data.find((entry) => entry.NIP === user.NIP);
      if (userDosen) {
        // Display user data on the page
        document.getElementById("profile-nip").textContent = userDosen.NIP;
        document.getElementById("profile-nidn").textContent = userDosen.NIDN;
        document.getElementById("profile-fungsional").textContent = userDosen.Fungsional;
        document.getElementById("profile-password").textContent = userDosen.Password;
        document.getElementById("profile-nama").textContent = userDosen.Nama;
        document.getElementById("profile-email").textContent = userDosen.Email;
        document.getElementById("profile-telepon").textContent = userDosen.Telepon;
        document.getElementById("profile-slot").textContent = userDosen.Slot + " Mahasiswa";

        document.getElementById("edit-password").value = userDosen.Password;
        document.getElementById("edit-nama").value = userDosen.Nama;
        document.getElementById("edit-email").value = userDosen.Email;
        document.getElementById("edit-telepon").value = userDosen.Telepon;
        document.getElementById("edit-slot").value = userDosen.Slot;
      } else {
        console.warn(`No matching data found for NIP: ${userDosen.NIP}`);
      }
    })
    .catch((error) => {
      console.error("Error fetching Mahasiswa data:", error);
    });
}

// Handle logout
document.getElementById("logout-button").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser"); // Clear user data from local storage
  window.location.href = "login_dosen.html"; // Redirect to login page
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

// edit form
fetch(`https://api.sheetbest.com/sheets/506f8840-a871-4430-b4c5-ff4c7926af72/tabs/Dosen?NIP=${user.NIP}`)
  .then((response) => response.json())
  .then((data) => {
    const userDosen = data.find((entry) => entry.NIP === user.NIP);
    if (userDosen) {
      // Handle the profile edit form submission
      document.getElementById("profile-edit-form").addEventListener("submit", async (event) => {
        event.preventDefault();

        // Get the updated values from the form
        const updatedUser = {
          NIP: userDosen.NIP,
          NIDN: userDosen.NIDN,
          Fungsional: userDosen.Fungsional,
          Bidang: userDosen.Bidang,

          Nama: document.getElementById("edit-nama").value,
          Telepon: document.getElementById("edit-telepon").value,
          Email: document.getElementById("edit-email").value,
          Password: document.getElementById("edit-password").value,
          Slot: document.getElementById("edit-slot").value,
        };

        const simplifiedUser = {
          NIP: user.NIP,
          Nama: document.getElementById("edit-nama").value,
          Status: "Dosen",
        };

        try {
          // Make a PUT request to update the Google Sheet
          const response = await fetch(`https://api.sheetbest.com/sheets/506f8840-a871-4430-b4c5-ff4c7926af72/tabs/Dosen/NIP/${updatedUser.NIP}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUser),
          });

          if (response.ok) {
            // If the update is successful, save updated data to localStorage
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
      console.warn(`No matching data found for NIP: ${userDosen.NIP}`);
    }
  })
  .catch((error) => {
    console.error("Error fetching Mahasiswa data:", error);
  });

// Load user profile when the page is loaded
window.onload = loadUserProfile;
