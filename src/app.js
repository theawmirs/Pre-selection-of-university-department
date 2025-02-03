import LectureModel from "./models/LectureModel.js";
import LectureView from "./views/LectureView.js";
import LectureController from "./controllers/LectureController.js";
import SearchController from "./controllers/SearchController.js";
import { coursesData } from "./data/courses.js";
import {
  updateChangeLogDisplay,
  getLatestUpdateTime,
  loadMoreLogs,
} from "./data/changelog.js";

// Theme handling
function initializeTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeToggle(savedTheme);
}

function updateThemeToggle(theme) {
  const themeToggle = document.getElementById("themeToggle");
  if (theme === "dark") {
    themeToggle.innerHTML = '<i class="ri-moon-line"></i> حالت تاریک';
  } else {
    themeToggle.innerHTML = '<i class="ri-sun-line"></i> حالت روشن';
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeToggle(newTheme);
}

document.addEventListener("DOMContentLoaded", () => {
  // Initialize theme
  initializeTheme();

  // Add theme toggle event listener
  const themeToggle = document.getElementById("themeToggle");
  themeToggle.addEventListener("click", toggleTheme);

  // Make courses data available globally
  window.coursesData = coursesData;

  const model = new LectureModel();
  const view = new LectureView();
  window.lectureController = new LectureController(model, view);
  window.searchController = new SearchController();

  // Initialize changelog display
  updateChangeLogDisplay();

  // Update the database timestamp with the latest changelog entry
  const lastUpdateTime = getLatestUpdateTime();
  document.getElementById("last-update-time").textContent = lastUpdateTime;

  // Add event listener for show more button
  const showMoreButton = document.querySelector(".show-more-logs");
  if (showMoreButton) {
    showMoreButton.addEventListener("click", loadMoreLogs);
  }
});
