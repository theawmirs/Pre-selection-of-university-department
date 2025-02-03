export const changeLogs = [
  {
    id: 1,
    date: "1403/11/14",
    time: "16:31",
    type: "updated",
    label: "به‌روزرسانی",
    description: "به‌روزرسانی دیتابیس درس ها   ",
  },
  {
    id: 2,
    date: "1403/11/13",
    time: "15:17",
    type: "updated",
    label: "به‌روزرسانی",
    description: "ایجاد بخشی جامع برای ثبت و نمایش تغییرات به صورت پویا",
  },
  {
    id: 3,
    date: "1403/11/13",
    time: "15:16",
    type: "updated",
    label: "به‌روزرسانی",
    description: "بهبود قابلیت تغییر تم و واکنش‌گرایی موبایل",
  },
  {
    id: 4,
    date: "1403/11/13",
    time: "15:15",
    type: "updated",
    label: "به‌روزرسانی",
    description: "بروزرسانی زمان‌بندی دیتابیس و جزئیات برنامه درسی",
  },
  {
    id: 5,
    date: "1403/11/13",
    time: "15:14",
    type: "updated",
    label: "به‌روزرسانی",
    description: "اضافه شدن دروس جدید و تغییر جزئیات دروس موجود",
  },
  {
    id: 6,
    date: "1403/11/13",
    time: "15:13",
    type: "updated",
    label: "به‌روزرسانی",
    description: "بهبود واکنش‌گرایی جدول برنامه درسی و اجزای رابط کاربری",
  },
];

const ITEMS_PER_PAGE = 5;
let currentPage = 1;

export function addChangeLog(type, description) {
  const now = new Date();
  // Convert to Persian date format
  const date = new Intl.DateTimeFormat("fa-IR").format(now);
  const time = now.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const labels = {
    added: "اضافه شده",
    updated: "به‌روزرسانی",
    removed: "حذف شده",
  };

  const newLog = {
    id: changeLogs.length + 1,
    date,
    time,
    type,
    label: labels[type],
    description,
  };

  changeLogs.unshift(newLog); // Add to the beginning of the array
  currentPage = 1; // Reset to first page when new log is added
  updateChangeLogDisplay();
  return newLog;
}

export function updateChangeLogDisplay() {
  const changelogContent = document.querySelector(".changelog-content");
  const showMoreButton = document.querySelector(".show-more-logs");
  if (!changelogContent) return;

  const startIndex = 0;
  const endIndex = currentPage * ITEMS_PER_PAGE;
  const hasMoreLogs = endIndex < changeLogs.length;

  const logsToShow = changeLogs.slice(startIndex, endIndex);

  changelogContent.innerHTML = logsToShow
    .map(
      (log) => `
    <div class="changelog-item">
      <div class="changelog-date">${log.date} - ${log.time}</div>
      <div class="changelog-description">
        <span class="changelog-tag ${log.type}">${log.label}</span>
        ${log.description}
      </div>
    </div>
  `
    )
    .join("");

  // Show/hide the "Show More" button based on whether there are more logs
  if (showMoreButton) {
    showMoreButton.style.display = hasMoreLogs ? "block" : "none";
  }

  // Add fade effect if there are more logs
  if (hasMoreLogs) {
    changelogContent.classList.add("has-more");
  } else {
    changelogContent.classList.remove("has-more");
  }
}

export function loadMoreLogs() {
  currentPage++;
  updateChangeLogDisplay();
}

// Function to get the latest update time
export function getLatestUpdateTime() {
  if (changeLogs.length > 0) {
    const latest = changeLogs[0];
    return `${latest.date} - ${latest.time}`;
  }
  return "بدون تغییرات";
}
