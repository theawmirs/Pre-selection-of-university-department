import { coursesData } from "../data/courses.js";

class SearchController {
  constructor() {
    this.searchModal = document.getElementById("searchModal");
    this.searchInput = document.getElementById("courseSearchInput");
    this.searchResults = document.getElementById("searchResults");
    this.courseDetails = document.getElementById("courseDetails");
    this.selectedCourse = null;

    this.initialize();
  }

  initialize() {
    document
      .getElementById("searchCourseBtn")
      .addEventListener("click", () => this.showModal());
    this.searchModal
      .querySelector(".close")
      .addEventListener("click", () => this.hideModal());
    this.searchInput.addEventListener("input", (e) => this.handleSearch(e));
  }

  showModal() {
    this.searchModal.style.display = "block";
    this.searchInput.focus();
  }

  hideModal() {
    this.searchModal.style.display = "none";
    this.clearSearch();
  }

  handleSearch(e) {
    const query = e.target.value.toLowerCase();
    if (query.length < 2) {
      this.searchResults.innerHTML = "";
      return;
    }

    const results = coursesData.courses.filter(
      (course) =>
        course.name.toLowerCase().includes(query) ||
        course.teacher.toLowerCase().includes(query)
    );

    this.displayResults(results);
  }

  displayResults(results) {
    this.searchResults.innerHTML = results
      .map(
        (course) => `
        <li onclick="window.searchController.selectCourse('${course.code}', '${course.group}')">
          ${course.name} - گروه ${course.group}
        </li>
      `
      )
      .join("");
  }

  selectCourse(code, group) {
    this.selectedCourse = coursesData.courses.find(
      (course) => course.code === code && course.group === group
    );
    this.displayCourseDetails();
  }

  displayCourseDetails() {
    if (!this.selectedCourse) return;

    // Check for conflicts
    const conflictingCourseName = window.lectureController.hasScheduleConflict(
      this.selectedCourse,
      window.lectureController.model.lectures
    );

    this.courseDetails.innerHTML = `
      <h3>${this.selectedCourse.name}</h3>
      <p>کد: ${this.selectedCourse.code}</p>
      <p>گروه: ${this.selectedCourse.group}</p>
      <p>واحد: ${this.selectedCourse.units}</p>
      <p>استاد: ${this.selectedCourse.teacher}</p>
      <p>زمان: ${this.selectedCourse.day || "N/A"} ${
      this.selectedCourse.startTime || ""
    } - ${this.selectedCourse.endTime || ""}</p>
      <button 
        onclick="window.searchController.addCourseToTable()"
        class="${conflictingCourseName ? "conflict" : "available"}"
        ${conflictingCourseName ? "disabled" : ""}
      >
        ${
          conflictingCourseName
            ? `این درس با درس ${conflictingCourseName} تداخل دارد`
            : `افزودن به جدول`
        }
      </button>
    `;
  }

  addCourseToTable() {
    if (!this.selectedCourse) return;

    // Use the existing lectureController to add the course
    const formattedCourse = {
      name: this.selectedCourse.name,
      code: this.selectedCourse.code,
      group: this.selectedCourse.group,
      teacher: this.selectedCourse.teacher,
      unit: this.selectedCourse.units,
      day: this.selectedCourse.day,
      startTime: this.selectedCourse.startTime
        ? parseInt(this.selectedCourse.startTime.split(":")[0])
        : null,
      endTime: this.selectedCourse.endTime
        ? parseInt(this.selectedCourse.endTime.split(":")[0])
        : null,
    };

    if (window.lectureController.addLectureToTable(formattedCourse)) {
      window.lectureController.view.showToast(
        `درس ${formattedCourse.name} با موفقیت اضافه شد`,
        "success"
      );
    }
    this.hideModal();
  }

  clearSearch() {
    this.searchInput.value = "";
    this.searchResults.innerHTML = "";
    this.courseDetails.innerHTML = "";
    this.selectedCourse = null;
  }
}

export default SearchController;
