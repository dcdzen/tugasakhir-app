function navbar() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
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

  if (!user) {
    console.error("User is not logged in.");
    window.location.href = "login.html";
    // return;
  }
}

window.onload = navbar;
