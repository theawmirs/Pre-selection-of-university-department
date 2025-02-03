# Course Pre-Registration Scheduler (پیش انتخاب واحد)

A web application for university students to plan and validate their course schedules before the official registration period.

## Features

### 1. Course Management

- Add courses to your schedule by searching through available courses
- View course details including:
  - Course name (نام درس)
  - Course code (کد درس)
  - Group number (گروه)
  - Units (واحد)
  - Professor (استاد)
  - Schedule (day and time)

### 2. Schedule Visualization

- Weekly schedule view in a grid format
- Color-coded course blocks
- Visual indicators for time conflicts
- Schedule spans from 8:00 to 20:00 for all weekdays

### 3. Course Validation

- Automatic checking for:
  - Time conflicts between courses
  - Total units within allowed range
  - Prerequisites and co-requisites
  - Group number conflicts

### 4. User Interface Features

- Light/Dark theme toggle
- Responsive design for mobile and desktop
- Course search functionality
- Detailed course information modal
- Change log tracking system
- Toast notifications for user feedback

### 5. Data Management

- Persistent storage of selected courses
- Course database with comprehensive course information
- Changelog tracking for app updates

## Technical Details

### File Structure

```
├── index.html
├── styles.css
├── src/
│   ├── app.js
│   ├── controllers/
│   │   ├── LectureController.js
│   │   └── SearchController.js
│   ├── models/
│   │   └── LectureModel.js
│   ├── views/
│   │   └── LectureView.js
│   ├── utils/
│   │   ├── localStorage.js
│   │   └── notification.js
│   └── data/
│       ├── courses.js
│       └── changelog.js
```

### Technologies Used

- HTML5
- CSS3 with Custom Properties
- Vanilla JavaScript (ES6+)
- LocalStorage for data persistence
- Remix Icons for UI elements

## Getting Started

1. Clone the repository
2. Open

index.html

in a modern web browser 3. Start adding courses to your schedule:

- Click "افزودن درس" button
- Search for desired courses
- Select courses to add to your schedule
- Validate your selection using "بررسی درس ها"

## Data Structure

### Course Object Example

```javascript
{
  code: "310149",
  group: "1",
  name: "چندرسانه ای و اسکریپت",
  units: 3.0,
  teacher: "عبدالهی محمد",
  day: "چهارشنبه",
  startTime: "12:00",
  endTime: "15:00"
}
```

## Changelog Management

The app maintains a changelog system to track updates and changes:

```javascript
{
  id: 1,
  date: "1403/11/13",
  time: "15:15",
  type: "updated",
  label: "به‌روزرسانی",
  description: "بروزرسانی زمان‌بندی دیتابیس"
}
```

## Contributing

Feel free to submit issues and enhancement requests.

## Author

امیرحسین کاظمی

## License

This project is licensed under the MIT License.
