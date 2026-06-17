const updatedElement = document.getElementById("last-updated");

if (updatedElement) {
  const today = new Date();
  updatedElement.textContent = today.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

console.log("Cloud Operations Sprint portfolio loaded.");
