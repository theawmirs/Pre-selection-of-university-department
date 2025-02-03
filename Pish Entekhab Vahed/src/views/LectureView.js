class LectureView {
  constructor() {
    this.detailsModal = document.getElementById("lectureDetailsModal");
    this.validationModal = document.getElementById("courseValidationModal");

    // Add event listener for the details modal close button
    const detailsModalCloseBtn = this.detailsModal.querySelector(".close");
    if (detailsModalCloseBtn) {
      detailsModalCloseBtn.addEventListener("click", () => {
        this.hideDetailsModal();
      });
    }

    // Add event listener for the validation modal close button
    const validationModalCloseBtn =
      this.validationModal.querySelector(".close");
    if (validationModalCloseBtn) {
      validationModalCloseBtn.addEventListener("click", () => {
        this.hideValidationModal();
      });
    }
  }

  showDetailsModal(lectureData) {
    const detailsContent = document.getElementById("lectureDetailsContent");
    detailsContent.innerHTML = `
            <h3>${lectureData.name}</h3>
            <p>ساعت: ${lectureData.startTime}:00 - ${lectureData.endTime}:00</p>
            <p>گروه: ${lectureData.group}</p>
            <p>کد: ${lectureData.code}</p>
            <p>استاد: ${lectureData.teacher}</p>
            <p>واحد: ${lectureData.unit}</p>
        `;
    this.detailsModal.style.display = "block";
  }

  hideDetailsModal() {
    this.detailsModal.style.display = "none";
  }

  showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;

    const container = document.getElementById("toastContainer");
    container.appendChild(toast);

    setTimeout(() => {
      container.removeChild(toast);
    }, 3000);
  }

  updateTotalUnits(total) {
    const totalUnitsSpan = document.getElementById("totalUnits");
    if (totalUnitsSpan) {
      totalUnitsSpan.textContent = total;
    }
  }

  renderLecture(cell, lectureData, numberOfSlots) {
    cell.dataset.lecture = JSON.stringify(lectureData);
    cell.innerHTML = `
        <div class="lecture-info" onclick="window.lectureController.showLectureDetails(${JSON.stringify(
          lectureData
        ).replace(/"/g, "&quot;")})">
            <button class="delete-btn" onclick="event.stopPropagation(); window.lectureController.handleDelete(this, ${numberOfSlots})">×</button>
            <strong>${lectureData.name}</strong>
            <div class="lecture-group">گروه ${lectureData.group}</div>
        </div>
    `;
    cell.style.backgroundColor = "#e3f2fd";
  }

  updateDatabaseTimestamp(timestamp) {
    const lastUpdateTime = document.getElementById("last-update-time");
    if (lastUpdateTime) {
      lastUpdateTime.textContent = timestamp;
    }
  }

  showValidationModal(validationResults) {
    const validationContent = document.getElementById(
      "courseValidationContent"
    );
    let html = '<div class="validation-results">';

    if (validationResults.timeChanges.length > 0) {
      html += "<h4>تغییرات زمانی دروس:</h4><ul>";
      validationResults.timeChanges.forEach((change) => {
        html += `<li>
          <strong>${change.name} (گروه ${change.group})</strong><br>
          زمان قبلی: ${change.oldTime}<br>
          زمان جدید: ${change.newTime}<br>
          <div class="validation-buttons">
            <button class="update-btn" onclick="window.lectureController.handleUpdateCourse('${change.code}', '${change.group}')">بروز رسانی درس</button>
            <button class="remove-btn" onclick="window.lectureController.handleRemoveCourse('${change.code}', '${change.group}')">حذف درس</button>
          </div>
        </li>`;
      });
      html += "</ul>";
    }

    if (validationResults.removedCourses.length > 0) {
      html += "<h4>دروس حذف شده:</h4><ul>";
      validationResults.removedCourses.forEach((course) => {
        html += `<li>
          <strong>${course.name} (گروه ${course.group})</strong><br>
          <button class="remove-btn" onclick="window.lectureController.handleRemoveCourse('${course.code}', '${course.group}')">حذف درس</button>
        </li>`;
      });
      html += "</ul>";
    }

    if (
      validationResults.timeChanges.length === 0 &&
      validationResults.removedCourses.length === 0
    ) {
      html += "<p>همه دروس انتخاب شده معتبر هستند.</p>";
    }

    html += "</div>";
    validationContent.innerHTML = html;
    this.validationModal.style.display = "block";
  }

  hideValidationModal() {
    this.validationModal.style.display = "none";
  }
}

export default LectureView;
