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

document.addEventListener("DOMContentLoaded", async () => {
  // Fetch Mahasiswa Data
  const driveResp = await fetch("https://api.sheetbest.com/sheets/f4b8387c-6ddc-4485-b90b-6796d0b8fbf2/tabs/Drive");
  const driveData = await driveResp.json();

  const formLabDosen = driveData.find((item) => item.No === "2");
  const suratTugas = driveData.find((item) => item.No === "3");
  const undanganSempro = driveData.find((item) => item.No === "5");
  const dokSempro = driveData.find((item) => item.No === "6");
  const undanganSemhas = driveData.find((item) => item.No === "7");
  const dokSemhas = driveData.find((item) => item.No === "8");

  document.getElementById("link-formlab").href = formLabDosen.Drive;
  document.getElementById("link-st").href = suratTugas.Drive;
  document.getElementById("link-undangan-sempro").href = undanganSempro.Drive;
  document.getElementById("link-dok-sempro").href = dokSempro.Drive;
  document.getElementById("link-undangan-semhas").href = undanganSemhas.Drive;
  document.getElementById("link-dok-semhas").href = dokSemhas.Drive;
});

window.onload = navbar;
