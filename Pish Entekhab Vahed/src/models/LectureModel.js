import { coursesData } from "../data/courses.js";

class LectureModel {
  constructor() {
    this.lectures = this.loadLectures();
  }

  loadLectures() {
    const savedLectures = localStorage.getItem("lectures");
    return savedLectures ? JSON.parse(savedLectures) : [];
  }

  saveLectures(lectures) {
    localStorage.setItem("lectures", JSON.stringify(lectures));
  }

  saveTotalUnits(totalUnits) {
    localStorage.setItem("totalUnits", totalUnits);
  }

  loadTotalUnits() {
    return localStorage.getItem("totalUnits") || "0";
  }

  addLecture(lectureData) {
    this.lectures.push(lectureData);
    this.saveLectures(this.lectures);
  }

  deleteLecture(lectureData) {
    this.lectures = this.lectures.filter(
      (lecture) =>
        lecture.name !== lectureData.name ||
        lecture.startTime !== lectureData.startTime ||
        lecture.day !== lectureData.day
    );
    this.saveLectures(this.lectures);
  }

  calculateTimeSlots(start, end) {
    return end - start;
  }

  async findLectureByCode(code, group) {
    try {
      const searchCode = code.toString().trim();
      const searchGroup = group.toString().trim();

      const lectures = coursesData.courses.filter(
        (course) =>
          course.code.toString().trim() === searchCode &&
          course.group.toString().trim() === searchGroup
      );

      console.log("Searching for code:", searchCode, "group:", searchGroup);
      console.log("Found lectures:", lectures);

      return lectures.length > 0 ? lectures : null;
    } catch (error) {
      console.error("Error finding lecture:", error);
      return null;
    }
  }
}

export default LectureModel;
