document.getElementById("login-dosen").addEventListener("submit", async function (event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("error-message");

  const toastBody = document.getElementById("toastBody");
  const toastTitle = document.getElementById("toastTitle");
  const toastElement = document.getElementById("login-toast");

  try {
    const response = await fetch("https://api.sheetbest.com/sheets/506f8840-a871-4430-b4c5-ff4c7926af72/tabs/Dosen");
    const data = await response.json();

    const user = data.find((item) => item.NIP === username && item.Password === password);

    const responseCallDosen = await fetch("https://api.sheetbest.com/sheets/506f8840-a871-4430-b4c5-ff4c7926af72/tabs/Dosen");
    const callDosenData = await responseCallDosen.json();
    const callDosen = callDosenData.filter((item) => item.Fungsional === "Admin");

    var statusCheck = "Dosen";

    for (let i = 0; i < callDosen.length; i++) {
      const dosen = callDosen[i];
      if (dosen.NIP === user.NIP) {
        statusCheck = "Admin";
        console.log("admin");
        break; // Stop checking once admin status is confirmed
      } else {
        console.log("bukan admin");
      }
    }

    if (user) {
      // Store user data in localStorage
      // Extract only the required fields
      const simplifiedUser = {
        NIP: user.NIP,
        Nama: user.Nama,
        Status: statusCheck,
      };
      // Store user data in localStorage
      localStorage.setItem("loggedInUser", JSON.stringify(simplifiedUser));
      // Show success toast message
      toastTitle.textContent = "Login Successful!";
      toastBody.textContent = "Welcome, " + user.Nama;
      toastElement.classList.remove("text-bg-danger"); // Remove error color
      toastElement.classList.add("text-bg-success"); // Add success color
      showToast();

      // Redirect to the profile page after a brief delay
      setTimeout(() => {
        window.location.href = "profile_dosen.html";
      }, 2000);
    } else {
      // Show error toast message
      toastTitle.textContent = "Login Error";
      toastBody.textContent = "Username atau password salah.";
      toastElement.classList.remove("text-bg-success"); // Remove success color
      toastElement.classList.add("text-bg-danger"); // Add error color
      showToast();
    }
  } catch (error) {
    console.error("Error logging in:", error);
    // Show error toast message
    toastTitle.textContent = "Login Error";
    toastBody.textContent = "Terjadi kesalahan saat login.";
    toastElement.classList.remove("text-bg-success"); // Remove success color
    toastElement.classList.add("text-bg-danger"); // Add error color
    showToast();
  }
});

// Function to show toast
function showToast() {
  const toast = new bootstrap.Toast(document.getElementById("login-toast"));
  toast.show();
}
