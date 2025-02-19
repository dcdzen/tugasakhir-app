document.getElementById("login-form").addEventListener("submit", async function (event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("error-message");

  const toastBody = document.getElementById("toastBody");
  const toastTitle = document.getElementById("toastTitle");
  const toastElement = document.getElementById("login-toast");

  try {
    const response = await fetch("https://api.sheetbest.com/sheets/506f8840-a871-4430-b4c5-ff4c7926af72/tabs/Mahasiswa");
    const data = await response.json();

    const userCheck = data.find((item) => item.NPM === username && item.Password === password);

    if (userCheck) {
      // Store userCheck data in localStorage
      // Extract only the required fields
      const simplifieduserCheck = {
        NPM: userCheck.NPM,
        Nama: userCheck.Nama,
        Status: "Mahasiswa",
      };

      // Store the simplified userCheck object in localStorage
      localStorage.setItem("loggedInUser", JSON.stringify(simplifieduserCheck));

      // Show success toast message
      toastTitle.textContent = "Login Successful!";
      toastBody.textContent = "Welcome, " + userCheck.Nama;
      toastElement.classList.remove("text-bg-danger"); // Remove error color
      toastElement.classList.add("text-bg-success"); // Add success color
      showToast();

      // Redirect to the profile page after a brief delay
      setTimeout(() => {
        window.location.href = "profile.html";
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
