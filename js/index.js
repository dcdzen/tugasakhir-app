function navbar() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  // navbar
  fetch("navbar.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("navbar").innerHTML = data;

      if (!user) {
        console.log("User is not logged in.");

        document.getElementById("login").hidden = false;
        document.getElementById("login-dosen").hidden = false;

        document.getElementById("login-welcome").hidden = true;
        document.getElementById("login-nama").hidden = true;

        document.getElementById("cek-profile").href = "login.html";
      } else {
        document.getElementById("login").hidden = true;
        document.getElementById("login-dosen").hidden = true;

        document.getElementById("login-welcome").hidden = false;
        document.getElementById("login-nama").hidden = false;

        document.getElementById("login-npm").textContent = user.NPM;
        document.getElementById("login-nama").textContent = user.Nama;

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
      }
    });
}

window.onload = navbar;
