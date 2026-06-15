const loginPanel = document.getElementById("loginPanel");
const profilePanel = document.getElementById("profilePanel");
const loginForm = document.getElementById("loginForm");
const marksForm = document.getElementById("marksForm");
const logoutButton = document.getElementById("logoutButton");
const clearMarksButton = document.getElementById("clearMarks");
const profilePhoto = document.getElementById("profilePhoto");
const defaultPhoto =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' fill='%23dfe8e5'/%3E%3Ccircle cx='80' cy='62' r='32' fill='%232f6f67'/%3E%3Cpath d='M28 145c7-34 29-52 52-52s45 18 52 52' fill='%232f6f67'/%3E%3C/svg%3E";

profilePhoto.src = defaultPhoto;

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("studentName").value.trim();
  const registrationNo = document.getElementById("registrationNo").value.trim();
  const department = document.getElementById("department").value;
  const semester = document.getElementById("semester").value;
  const photoFile = document.getElementById("studentPhoto").files[0];

  document.getElementById("profileName").textContent = name;
  document.getElementById("profileMeta").textContent =
    `${registrationNo} | ${department} | ${semester}`;

  if (photoFile) {
    const reader = new FileReader();
    reader.onload = () => {
      profilePhoto.src = reader.result;
    };
    reader.readAsDataURL(photoFile);
  } else {
    profilePhoto.src = defaultPhoto;
  }

  loginPanel.classList.add("hidden");
  profilePanel.classList.remove("hidden");
});

marksForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const markInputs = [...document.querySelectorAll(".mark-input")];
  const marks = markInputs.map((input) => Number(input.value));

  if (marks.some((mark) => Number.isNaN(mark) || mark < 0 || mark > 100)) {
    alert("Please enter valid marks between 0 and 100 for every subject.");
    return;
  }

  const total = marks.reduce((sum, mark) => sum + mark, 0);
  const percentage = total / marks.length;
  const hasFailedSubject = marks.some((mark) => mark < 35);
  const status = hasFailedSubject ? "Fail" : "Pass";
  const grade = getGrade(percentage, hasFailedSubject);

  document.getElementById("totalMarks").textContent = `${total} / ${marks.length * 100}`;
  document.getElementById("percentage").textContent = `${percentage.toFixed(2)}%`;
  document.getElementById("grade").textContent = grade;

  const statusElement = document.getElementById("status");
  statusElement.textContent = status;
  statusElement.classList.toggle("status-pass", status === "Pass");
  statusElement.classList.toggle("status-fail", status === "Fail");

  document.getElementById("resultNote").textContent =
    status === "Pass"
      ? "Congratulations. The student has passed all subjects."
      : "The student must score at least 35 marks in every subject to pass.";
});

clearMarksButton.addEventListener("click", () => {
  marksForm.reset();
  resetResult();
});

logoutButton.addEventListener("click", () => {
  loginForm.reset();
  marksForm.reset();
  resetResult();
  profilePanel.classList.add("hidden");
  loginPanel.classList.remove("hidden");
  profilePhoto.src = defaultPhoto;
});

function getGrade(percentage, failed) {
  if (failed) return "F";
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  if (percentage >= 35) return "D";
  return "F";
}

function resetResult() {
  document.getElementById("totalMarks").textContent = "--";
  document.getElementById("percentage").textContent = "--";
  document.getElementById("grade").textContent = "--";

  const statusElement = document.getElementById("status");
  statusElement.textContent = "--";
  statusElement.classList.remove("status-pass", "status-fail");

  document.getElementById("resultNote").textContent =
    "Enter all subject marks to generate the student result.";
}
