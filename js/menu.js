function navbar() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
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

  if (!user) {
    console.error("User is not logged in.");
    window.location.href = "login.html";
    // return;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  // Fetch Mahasiswa Data
  const driveResp = await fetch("https://api.sheetbest.com/sheets/506f8840-a871-4430-b4c5-ff4c7926af72/tabs/Drive");
  const driveData = await driveResp.json();

  const fileForm = driveData.find((item) => item.No === "3");
  const contoh = driveData.find((item) => item.No === "4");
  const formLabDosen = driveData.find((item) => item.No === "5");
  const suratTugas = driveData.find((item) => item.No === "6");
  const pendukungSempro = driveData.find((item) => item.No === "7");
  const undanganSempro = driveData.find((item) => item.No === "8");
  const dokSempro = driveData.find((item) => item.No === "9");
  const beritaAcara = driveData.find((item) => item.No === "10");
  const undanganSemhas = driveData.find((item) => item.No === "11");
  const dokSemhas = driveData.find((item) => item.No === "12");

  document.getElementById("link-fileform").href = fileForm.Drive;
  document.getElementById("link-contoh").href = contoh.Drive;
  document.getElementById("link-formlab").href = formLabDosen.Drive;
  document.getElementById("link-st").href = suratTugas.Drive;
  document.getElementById("link-pendukung-sempro").href = pendukungSempro.Drive;
  document.getElementById("link-undangan-sempro").href = undanganSempro.Drive;
  document.getElementById("link-dok-sempro").href = dokSempro.Drive;
  document.getElementById("link-berita").href = beritaAcara.Drive;
  document.getElementById("link-undangan-semhas").href = undanganSemhas.Drive;
  document.getElementById("link-dok-semhas").href = dokSemhas.Drive;
});

window.onload = navbar;
