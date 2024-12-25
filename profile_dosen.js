const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user) {
  console.error("User is not logged in.");
  window.location.href = "login_dosen.html";
  // return;
} else if (user.Status === "Mahasiswa") {
  console.error("Hanya untuk dosen");
  window.location.href = "login.html";
}

// navbar
fetch("navbar.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("navbar").innerHTML = data;

    if (user.Status === "Mahasiswa") {
      document.getElementById("cek-profile").href = "profile.html";
    } else if (user.Status === "Dosen") {
      document.getElementById("cek-profile").href = "profile_dosen.html";
    }
  });

// Fetch user data from local storage
function loadUserProfile() {
  // Fetch and display user data from Dosen tab
  fetch(`https://api.sheetbest.com/sheets/f4b8387c-6ddc-4485-b90b-6796d0b8fbf2/tabs/Dosen?NIP=${user.NIP}`)
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
fetch(`https://api.sheetbest.com/sheets/f4b8387c-6ddc-4485-b90b-6796d0b8fbf2/tabs/Dosen?NIP=${user.NIP}`)
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
          const response = await fetch(`https://api.sheetbest.com/sheets/f4b8387c-6ddc-4485-b90b-6796d0b8fbf2/tabs/Dosen/NIP/${updatedUser.NIP}`, {
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
