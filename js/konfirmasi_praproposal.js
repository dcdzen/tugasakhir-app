if (!user) {
  console.error("User is not logged in.");
  window.location.href = "login_dosen.html";
  // return;
} else if (user.Status === "Mahasiswa") {
  console.error("Hanya untuk dosen");
  window.location.href = "login.html";
}
const urlParamspra = new URLSearchParams(window.location.search);
const selectedNPMpra = urlParamspra.get("NPM");

document.addEventListener("DOMContentLoaded", async () => {
  if (!selectedNPMpra) {
    console.log("Data tidak ditemukan!");
    window.location.href = `mahasiswa.html?NPM=${selectedNPMpra}`; // Redirect if no NPM
    return;
  }

  const bidangElement = document.getElementById("edit-bidang");
  const dosbing1Dropdown = document.getElementById("edit-dosbing1");
  const dosbing2Dropdown = document.getElementById("edit-dosbing2");

  try {
    // Fetch Mahasiswa Data
    const mahasiswaResponse = await fetch("https://api.sheetbest.com/sheets/f4b8387c-6ddc-4485-b90b-6796d0b8fbf2/tabs/Praproposal");
    const mahasiswaData = await mahasiswaResponse.json();
    const editData = mahasiswaData.find((item) => item.NPM === selectedNPMpra);

    if (!editData) {
      console.log("Data tidak ditemukan!");
      // window.location.href = `mahasiswa.html?NPM=${selectedNPMpra}`;
      return;
    } else {
      // Prefill the form with editData
      document.getElementById("edit-tanggal").value = editData.Tanggal;
      document.getElementById("edit-npm").value = editData.NPM;
      document.getElementById("edit-nama").value = editData.Nama;
      document.getElementById("edit-judul").value = editData.Judul;
      document.getElementById("edit-status").value = editData.Status;

      // Fetch Dosen Data
      const dosenResponse = await fetch("https://api.sheetbest.com/sheets/f4b8387c-6ddc-4485-b90b-6796d0b8fbf2/tabs/Dosen");
      const dosenData = await dosenResponse.json();

      const validFungsional = ["Lektor", "Lektor Kepala", "Asisten Ahli"];

      // Populate Bidang Dropdown
      const bidangOptions = [...new Set(dosenData.map((d) => d.Bidang))];
      bidangOptions.forEach((bidang) => {
        const option = document.createElement("option");
        option.value = bidang;
        option.textContent = bidang;
        bidangElement.appendChild(option);
      });

      bidangElement.value = editData.Bidang;

      // Initialize Dropdowns
      initializeDropdowns();

      bidangElement.addEventListener("change", initializeDropdowns);

      function initializeDropdowns() {
        const selectedBidang = bidangElement.value;

        if (!selectedBidang) {
          console.warn("Bidang is not selected.");
          return;
        }

        const filteredDosen = dosenData.filter((d) => d.Bidang === selectedBidang && validFungsional.includes(d.Fungsional));

        populateDropdown(dosbing1Dropdown, filteredDosen, editData.Pembimbing_1);

        updateDosbing2Dropdown(filteredDosen);
      }

      function populateDropdown(dropdown, dosenList, selectedValue) {
        dropdown.innerHTML = '<option value="" disabled>Pilih Dosen</option>';
        dosenList.forEach((d) => {
          const option = document.createElement("option");
          option.value = d.Nama;
          option.textContent = `${d.Nama} (${d.Fungsional})`;
          option.selected = d.Nama === selectedValue;
          dropdown.appendChild(option);
        });
        dropdown.disabled = dosenList.length === 0;
      }

      function updateDosbing2Dropdown(dosenList) {
        const selectedDosen1 = dosbing1Dropdown.value; // Get the selected dosbing1 value
        const filteredDosen = dosenList.filter((d) => d.Nama !== selectedDosen1); // Exclude dosbing1 selection
        populateDropdown(dosbing2Dropdown, filteredDosen, editData.Pembimbing_2, "Tanpa Dosen Pembimbing 2");
      }

      function populateDropdown(dropdown, dosenList, selectedValue = "", placeholder = "Pilih Dosen") {
        dropdown.innerHTML = ""; // Clear all existing options

        // Add placeholder as the first option
        const placeholderOption = document.createElement("option");
        placeholderOption.value = "";
        // placeholderOption.disabled = true;
        placeholderOption.selected = true; // Ensure the placeholder is selected by default
        placeholderOption.textContent = placeholder;
        dropdown.appendChild(placeholderOption);

        dosenList.forEach((d) => {
          const option = document.createElement("option");
          option.value = d.Nama;
          option.textContent = `${d.Nama} (${d.Fungsional})`;

          // Mark the option as selected if it matches the value
          if (d.Nama === selectedValue) {
            option.selected = true;
          }

          dropdown.appendChild(option);
        });

        dropdown.disabled = dosenList.length === 0; // Disable dropdown if no options are available
      }

      dosbing1Dropdown.addEventListener("change", () => {
        updateDosbing2Dropdown(dosenData.filter((d) => d.Bidang === bidangElement.value));
      });
    }
  } catch (error) {
    console.error("Error:", error);
    showToast("Gagal memuat data.", "error");
  }
});

document.getElementById("add-data-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  if (data.Status === "Diterima") {
    console.log(data.Status);
  }

  try {
    const response = await fetch(`https://api.sheetbest.com/sheets/f4b8387c-6ddc-4485-b90b-6796d0b8fbf2/tabs/Praproposal/NPM/${data.NPM}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseCallDosen = await fetch("https://api.sheetbest.com/sheets/f4b8387c-6ddc-4485-b90b-6796d0b8fbf2/tabs/Dosen");
    const callDosenData = await responseCallDosen.json();
    const callDosen = callDosenData.find((item) => item.NIP === user.NIP);

    callDosen.Slot = parseInt(callDosen.Slot, 10); // or use `+callDosen.Slot`
    const plusSlot = callDosen.Slot + 1;

    // Get the updated values from the form
    const updatedSlotDosen = {
      NIP: callDosen.NIP,
      NIDN: callDosen.NIDN,
      Nama: callDosen.Nama,
      Fungsional: callDosen.Fungsional,
      Bidang: callDosen.Bidang,
      Telepon: callDosen.Telepon,
      Email: callDosen.Email,
      Password: callDosen.Password,
      Slot: plusSlot,
    };

    const responseDosen = await fetch(`https://api.sheetbest.com/sheets/f4b8387c-6ddc-4485-b90b-6796d0b8fbf2/tabs/Dosen/NIP/${user.NIP}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedSlotDosen),
    });

    if (response.ok) {
      showToast("Data berhasil diperbarui!", "success", true);
    } else {
      showToast("Gagal memperbarui data.", "error");
    }
  } catch (error) {
    console.error("Error updating data:", error);
    showToast("Terjadi kesalahan.", "error");
  }
});

function showToast(message, type, redirect = false) {
  const toastMessage = document.getElementById("toastMessage");
  const toastTitle = document.getElementById("toastTitle");
  const toastBody = document.getElementById("toastBody");

  toastBody.textContent = message;
  toastTitle.textContent = type === "success" ? "Berhasil" : "Error";

  if (type === "success") {
    toastMessage.classList.remove("text-bg-danger");
    toastMessage.classList.add("text-bg-success");
  } else {
    toastMessage.classList.remove("text-bg-success");
    toastMessage.classList.add("text-bg-danger");
  }

  const toast = new bootstrap.Toast(toastMessage);
  toast.show();

  // Redirect to login.html page on success if 'redirect' is true
  if (redirect) {
    setTimeout(() => {
      window.location.href = `mahasiswa.html?NPM=${selectedNPMpra}`; // Redirect to profile.html
    }, 2000); // Adjust delay if necessary
  }
}
