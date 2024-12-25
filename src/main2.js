let students = []; // Change const to let for reassignment
const linkdat = "https://script.google.com/macros/s/AKfycbxbVvGzYK_0ye-hlQjGx6ijd7Evi5AtRAS3bjQYXFHVNZEb8vpjwnUWP-j3_BJRD2eM_A/exec";

// Function to fetch the data
function fetchData() {
  return fetch(linkdat)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

// Function to process the data and assign it to the students variable
function processData(data) {
  if (data && data.data && data.data.length > 0) {
    students = data.data.map((item) => ({
      NPM: item.NPM,
      Nama: item.Nama,
      Password: item.Password,
    }));
    console.log("Students data processed: ", students);
  } else {
    console.log("No data found");
  }
}

// Function that accesses and uses the students data
function useStudentsData() {
  console.log("Using students data in another function: ", students);

  const sec = document.getElementById("dashboard-data");

  // Clear the existing table rows
  sec.innerHTML = "";

  // Loop through each student and create a new row
  students.forEach((student) => {
    const row = document.createElement("tr");

    // Create table cells for NPM, Nama, and Password
    const npmCell = document.createElement("td");
    npmCell.textContent = student.NPM;

    const namaCell = document.createElement("td");
    namaCell.textContent = student.Nama;

    const pwCell = document.createElement("td");
    pwCell.textContent = student.Password;

    // Append the cells to the row
    row.appendChild(npmCell);
    row.appendChild(namaCell);
    row.appendChild(pwCell);

    // Append the row to the table body
    sec.appendChild(row);
  });
}

// Main function to execute when the page loads
function main() {
  // Call fetchData and process the result before rendering
  fetchData().then((data) => {
    processData(data); // Populate the students array
    useStudentsData(); // Populate the table with the data
  });
}

main(); // Call the main function to start the process
