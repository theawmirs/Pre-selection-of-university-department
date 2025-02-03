class LectureController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // Load and render saved lectures when the page loads
    this.loadSavedLectures();

    // Load and display total units
    const totalUnits = this.model.loadTotalUnits();
    this.view.updateTotalUnits(totalUnits);

    this.initializeEventListeners();

    // Add event listener for validate courses button
    const validateBtn = document.getElementById("validateCoursesBtn");
    if (validateBtn) {
      validateBtn.addEventListener("click", () => this.validateCourses());
    }
  }

  initializeEventListeners() {
    window.onclick = (event) => {
      if (event.target === this.view.detailsModal) {
        this.view.hideDetailsModal();
      }
    };
  }

  handleFormSubmit(e) {
    e.preventDefault();

    const formData = this.getFormData();
    if (formData.endTime <= formData.startTime) {
      this.view.showToast("End time must be after start time", "error");
      return;
    }

    // Only show success toast if lecture was successfully added
    if (this.addLectureToTable(formData)) {
      this.view.showToast(`درس ${formData.name} با موفقیت اضافه شد`, "success");
      this.view.hideModal();
      this.view.form.reset();
    }
  }

  getFormData() {
    return {
      name: document.getElementById("lectureName").value,
      group: document.getElementById("lectureGroup").value,
      code: document.getElementById("lectureCode").value,
      teacher: document.getElementById("lectureTeacher").value,
      unit: document.getElementById("lectureUnit").value,
      day: document.getElementById("dayOfWeek").value,
      startTime: parseInt(document.getElementById("startTime").value),
      endTime: parseInt(document.getElementById("endTime").value),
    };
  }

  addLectureToTable(lectureData) {
    const timeSlots = this.model.calculateTimeSlots(
      lectureData.startTime,
      lectureData.endTime
    );
    const dayRows = {
      شنبه: 0,
      یکشنبه: 1,
      دوشنبه: 2,
      سه‌شنبه: 3,
      چهارشنبه: 4,
      پنجشنبه: 5,
    };

    const rowIndex = dayRows[lectureData.day];
    const row = document.querySelector("tbody").children[rowIndex];
    const startColumn = lectureData.startTime - 7; // Adjusting for 8am start (column 1)

    // Check for time slot conflicts
    for (let i = 0; i < timeSlots; i++) {
      const cell = row.children[startColumn + i];
      if (cell.dataset.lecture) {
        const conflictingLecture = JSON.parse(cell.dataset.lecture);
        this.view.showToast(
          `این درس با درس ${conflictingLecture.name} تداخل دارد`,
          "error"
        );
        return false;
      }
    }

    // Add lecture to model
    this.model.addLecture(lectureData);

    // Render lecture in the first cell
    const firstCell = row.children[startColumn];
    this.view.renderLecture(firstCell, lectureData, timeSlots);

    // Merge subsequent cells
    for (let i = 1; i < timeSlots; i++) {
      const cell = row.children[startColumn + i];
      cell.style.display = "none";
    }
    firstCell.colSpan = timeSlots;

    // Update total units
    this.updateTotalUnits();
    return true;
  }

  updateTotalUnits() {
    const total = this.model.lectures.reduce((sum, lecture) => {
      // Convert unit to number, handling both string and number formats
      const unitValue =
        typeof lecture.unit === "string"
          ? parseFloat(lecture.unit)
          : typeof lecture.units === "number"
          ? lecture.units
          : lecture.unit;
      return sum + unitValue;
    }, 0);
    this.model.saveTotalUnits(total);
    this.view.updateTotalUnits(total);
  }

  handleDelete(button, numberOfCells) {
    const cell = button.closest("td");
    const lectureData = JSON.parse(cell.dataset.lecture);
    this.model.deleteLecture(lectureData);
    this.restoreCells(cell, numberOfCells);
    this.updateTotalUnits();
    this.view.showToast("درس با موفقیت حذف شد", "error");
  }

  restoreCells(cell, numberOfCells) {
    const row = cell.parentElement;
    cell.colSpan = 1;
    cell.style.backgroundColor = "";
    cell.innerHTML = "";
    cell.removeAttribute("data-lecture");

    // Show hidden cells
    const startIndex = Array.from(row.children).indexOf(cell);
    for (let i = 1; i < numberOfCells; i++) {
      const hiddenCell = row.children[startIndex + i];
      if (hiddenCell) {
        hiddenCell.style.display = "";
      }
    }
  }

  showLectureDetails(lectureData) {
    this.view.showDetailsModal(lectureData);
  }

  loadSavedLectures() {
    const savedLectures = this.model.lectures;
    savedLectures.forEach((lectureData) => {
      const timeSlots = this.model.calculateTimeSlots(
        lectureData.startTime,
        lectureData.endTime
      );
      const dayRows = {
        شنبه: 0,
        یکشنبه: 1,
        دوشنبه: 2,
        سه‌شنبه: 3,
        چهارشنبه: 4,
        پنجشنبه: 5,
      };

      const rowIndex = dayRows[lectureData.day];
      const row = document.querySelector("tbody").children[rowIndex];
      const startColumn = lectureData.startTime - 7;

      // Render lecture in the first cell
      const firstCell = row.children[startColumn];
      this.view.renderLecture(firstCell, lectureData, timeSlots);

      // Merge subsequent cells
      for (let i = 1; i < timeSlots; i++) {
        const cell = row.children[startColumn + i];
        cell.style.display = "none";
      }
      firstCell.colSpan = timeSlots;
    });
  }

  hasScheduleConflict(newCourse, existingCourses) {
    for (const existingCourse of existingCourses) {
      // If either course has no day/time, no conflict
      if (!newCourse.day || !existingCourse.day) continue;

      // Check if same day
      if (newCourse.day === existingCourse.day) {
        // Handle both string and number formats for start/end times
        const newStart =
          typeof newCourse.startTime === "string"
            ? parseInt(newCourse.startTime.split(":")[0])
            : newCourse.startTime;
        const newEnd =
          typeof newCourse.endTime === "string"
            ? parseInt(newCourse.endTime.split(":")[0])
            : newCourse.endTime;
        const existingStart =
          typeof existingCourse.startTime === "string"
            ? parseInt(existingCourse.startTime.split(":")[0])
            : existingCourse.startTime;
        const existingEnd =
          typeof existingCourse.endTime === "string"
            ? parseInt(existingCourse.endTime.split(":")[0])
            : existingCourse.endTime;

        // Check for time overlap
        if (newStart < existingEnd && newEnd > existingStart) {
          return existingCourse.name; // Return the name of the conflicting course
        }
      }
    }
    return null; // No conflict
  }

  validateCourses() {
    const savedCourses = this.model.lectures;
    const coursesDatabase = window.coursesData.courses;

    const validationResults = {
      timeChanges: [],
      removedCourses: [],
    };

    savedCourses.forEach((savedCourse) => {
      // Find matching course in database
      const dbCourse = coursesDatabase.find(
        (c) => c.code === savedCourse.code && c.group === savedCourse.group
      );

      if (!dbCourse) {
        // Course no longer exists in database
        validationResults.removedCourses.push(savedCourse);
      } else {
        // Convert database time format to match saved format
        const dbStartTime = parseInt(dbCourse.startTime.split(":")[0]);
        const dbEndTime = parseInt(dbCourse.endTime.split(":")[0]);

        // Check if time or day has changed
        if (
          savedCourse.startTime !== dbStartTime ||
          savedCourse.endTime !== dbEndTime ||
          savedCourse.day !== dbCourse.day
        ) {
          validationResults.timeChanges.push({
            ...savedCourse,
            oldTime: `${savedCourse.startTime}:00 - ${savedCourse.endTime}:00`,
            newTime: `${dbCourse.startTime} - ${dbCourse.endTime}`,
            dbCourse: dbCourse, // Add the database course data for updating
          });
        }
      }
    });

    this.view.showValidationModal(validationResults);
  }

  handleUpdateCourse(code, group) {
    const savedCourses = this.model.lectures;
    const coursesDatabase = window.coursesData.courses;

    // Find the old course in saved courses
    const oldCourse = savedCourses.find(
      (course) => course.code === code && course.group === group
    );

    // Find the new course data in database
    const newCourse = coursesDatabase.find(
      (course) => course.code === code && course.group === group
    );

    if (oldCourse && newCourse) {
      // First remove the old course
      const timeSlots = this.model.calculateTimeSlots(
        oldCourse.startTime,
        oldCourse.endTime
      );

      const dayRows = {
        شنبه: 0,
        یکشنبه: 1,
        دوشنبه: 2,
        سه‌شنبه: 3,
        چهارشنبه: 4,
        پنجشنبه: 5,
      };

      const rowIndex = dayRows[oldCourse.day];
      const row = document.querySelector("tbody").children[rowIndex];
      const startColumn = oldCourse.startTime - 7;
      const cell = row.children[startColumn];

      // Remove old course
      this.model.deleteLecture(oldCourse);
      this.restoreCells(cell, timeSlots);

      // Prepare new course data
      const updatedCourse = {
        ...newCourse,
        startTime: parseInt(newCourse.startTime.split(":")[0]),
        endTime: parseInt(newCourse.endTime.split(":")[0]),
      };

      // Add the updated course
      if (this.addLectureToTable(updatedCourse)) {
        this.view.showToast(
          `درس ${updatedCourse.name} با موفقیت بروز رسانی شد`,
          "success"
        );
        this.view.hideValidationModal();
      } else {
        // If adding the updated course fails (e.g., due to conflicts), add back the old course
        this.addLectureToTable(oldCourse);
        this.view.showToast(
          "بروز رسانی درس به دلیل تداخل زمانی امکان پذیر نیست",
          "error"
        );
      }
    }
  }

  handleRemoveCourse(code, group) {
    const courseToRemove = this.model.lectures.find(
      (lecture) => lecture.code === code && lecture.group === group
    );

    if (courseToRemove) {
      const timeSlots = this.model.calculateTimeSlots(
        courseToRemove.startTime,
        courseToRemove.endTime
      );

      const dayRows = {
        شنبه: 0,
        یکشنبه: 1,
        دوشنبه: 2,
        سه‌شنبه: 3,
        چهارشنبه: 4,
        پنجشنبه: 5,
      };

      const rowIndex = dayRows[courseToRemove.day];
      const row = document.querySelector("tbody").children[rowIndex];
      const startColumn = courseToRemove.startTime - 7;
      const cell = row.children[startColumn];

      this.model.deleteLecture(courseToRemove);
      this.restoreCells(cell, timeSlots);
      this.updateTotalUnits();
      this.view.showToast(
        `درس ${courseToRemove.name} با موفقیت حذف شد`,
        "success"
      );
      this.view.hideValidationModal();
    }
  }
}

export default LectureController;
