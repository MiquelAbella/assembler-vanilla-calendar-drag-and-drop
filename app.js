const closeAddModalBtn = document.querySelector("#add-modal-close-btn");
const addEventModal = document.querySelector("#add-event-modal");
const addEventForm = document.querySelector("#add-event-form");

const closeEditModalBtn = document.querySelector("#edit-modal-close-btn");
const editEventModal = document.querySelector("#edit-event-modal");
const editEventForm = document.querySelector("#edit-event-form");
const editEventTextarea = document.querySelector("#edit-event-text-input");
const editEventTitle = document.querySelector("#edit-event-title");
const deleteEventBtn = document.querySelector("#delete-event");
const cancelAddBtn = document.querySelector(".cancel-btn");
const addEventBtn = document.querySelector("#add-event-btn");

document.body.addEventListener("keydown", closeAddModal);
document.body.addEventListener("load", getExpiredEvents());

closeAddModalBtn.addEventListener("click", toggleAddModalVisibility);
closeEditModalBtn.addEventListener("click", toggleEditModalVisibility);

addEventForm.addEventListener("submit", addEvent);
editEventForm.addEventListener("submit", editEvent);
deleteEventBtn.addEventListener("click", deleteEvent);
cancelAddBtn.addEventListener("click", closeAddModal);

let events = JSON.parse(localStorage.getItem("event-list")) || [];

let year = new Date().getFullYear();
let month = new Date().getMonth();

const monthList = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let yearCounter = 0;
let monthCounter = 0;
let translateCounter = 0;
let currentDay;
let currentEvent;

document.body.addEventListener("load", initCalendar());
addEventModal.addEventListener("click", closeModal);
editEventModal.addEventListener("click", closeModal);

function closeModal(e) {
  if (e.target.classList[0] === "add-event-modal") {
    addEventModal.classList.add("hidden");
  }
  if (e.target.classList[0] === "edit-event-modal") {
    editEventModal.classList.add("hidden");
  }
}

function initCalendar() {
  let currMonth = document.createElement("p");
  currMonth.classList.add("month-title");
  currMonth.innerText =
    monthList[month + monthCounter] + ", " + (year + yearCounter);

  let calendarContainer = document.createElement("section");
  calendarContainer.classList.add("calendar-container");
  calendarContainer.id = month + monthCounter + "-" + year;

  let backArrow = document.createElement("p");
  let nextArrow = document.createElement("p");
  let openModalBtn = document.createElement("button");

  backArrow.innerText = "BACK";
  backArrow.id = "back-" + (month + monthCounter) + "-" + year;
  backArrow.addEventListener("click", printPrevMonth);
  nextArrow.innerText = "NEXT";
  nextArrow.id = "next-" + (month + monthCounter) + "-" + year;
  nextArrow.addEventListener("click", printNextMonth);
  openModalBtn.innerText = "Add event";
  openModalBtn.classList.add("add-btn");
  openModalBtn.addEventListener("click", openAddModal);

  let numberOfDays = getDaysInMonth(
    year + yearCounter,
    month + monthCounter,
    0
  );

  let daysContainer = document.createElement("div");
  daysContainer.classList.add("month-container");

  let currDay = `${new Date(Date.now()).getDate()}-${month}-${year}`;

  for (let i = 0; i < numberOfDays; i++) {
    let day = document.createElement("div");
    day.classList.add("day");

    let dayText = document.createElement("p");
    dayText.innerText = i + 1;
    dayText.style.color = "#3279a8";

    day.id = `${dayText.innerText}-${month + monthCounter}-${
      year + yearCounter
    }`;

    if (day.id === currDay) {
      day.style.backgroundColor = "rgb(196, 196, 253)";
    }

    day.appendChild(dayText);
    day.addEventListener("click", openAddModalFromDay);
    day.addEventListener("dragover", dragOver);
    day.addEventListener("drop", dragDrop);
    day.addEventListener("dragleave", dragLeave);

    daysContainer.appendChild(day);

    events.map((event) => {
      if (event.day === day.id) {
        let newEvent = document.createElement("p");
        newEvent.classList.add("event");
        newEvent.innerHTML = event.eventTitle;
        newEvent.id = parseInt(event.eventId);

        newEvent.style.backgroundColor =
          event.eventType === "meeting"
            ? "#c362f0"
            : event.eventType === "personal"
            ? "#62f07e"
            : event.eventType === "study"
            ? "#6262f0"
            : "lightblue";

        newEvent.setAttribute("draggable", true);

        newEvent.addEventListener("click", openEditForm);
        newEvent.addEventListener("dragstart", dragStart);
        day.appendChild(newEvent);
      }
    });
  }
  calendarContainer.appendChild(daysContainer);

  let navContainer = document.createElement("div");
  navContainer.classList.add("arrows-container");

  navContainer.appendChild(backArrow);
  navContainer.appendChild(openModalBtn);
  navContainer.appendChild(nextArrow);

  document.body.appendChild(calendarContainer);

  calendarContainer.insertAdjacentElement("afterbegin", navContainer);
  calendarContainer.insertAdjacentElement("afterbegin", currMonth);

  if (month + monthCounter === 11) {
    yearCounter += 1;
    monthCounter = 0;
    month = 0;
  } else {
    monthCounter++;
  }
}

function getDaysInMonth(currentYear, currentMonth) {
  let numberOfDays = new Date(currentYear, currentMonth, 0).getDate();

  return numberOfDays;
}

function printPrevMonth() {
  if (translateCounter > 0) {
    translateCounter--;
    let months = document.querySelectorAll(".calendar-container");
    for (let month of months) {
      month.style.transform = `translateX(-${100 * translateCounter}vw)`;
    }
  }
}

function printNextMonth(e) {
  e.target.removeEventListener("click", printNextMonth);
  e.target.addEventListener("click", showNextMonth);

  translateCounter++;
  initCalendar();
  let months = document.querySelectorAll(".calendar-container");
  for (let month of months) {
    month.style.transform = `translateX(-${100 * translateCounter}vw)`;
  }
}

function showNextMonth() {
  translateCounter++;
  let months = document.querySelectorAll(".calendar-container");
  for (let month of months) {
    month.style.transform = `translateX(-${100 * translateCounter}vw)`;
  }
}

function openAddModalFromDay(e) {
  currentDay = e.target;
  let correctDate = currentDay.id.split("-");

  correctDate[1] = parseInt(correctDate[1] + 1).toString();

  if (parseInt(correctDate[1]) < 10) {
    correctDate[1] = `0${correctDate[1]}`;
  }

  if (parseInt(correctDate[0]) < 10) {
    correctDate[0] = `0${correctDate[0]}`;
  }

  correctDate = correctDate.reverse().join("-");

  let startDate = document.getElementById("add-event-start-date");
  startDate.value = correctDate;

  addEventModal.classList.toggle("hidden");
}

function openAddModal() {
  addEventModal.classList.toggle("hidden");
}

function closeAddModal(e) {
  if (e.key === "Escape") {
    addEventModal.classList.add("hidden");
    editEventModal.classList.add("hidden");
  } else if (e.target.innerText === "Cancel") {
    addEventModal.classList.add("hidden");
  }
}

function toggleAddModalVisibility() {
  addEventModal.classList.toggle("hidden");
}
function toggleEditModalVisibility() {
  editEventModal.classList.toggle("hidden");
}

function addEvent(e) {
  if (e.target.innerText === "Cancel") {
    addEventModal.classList.add("hidden");
    return;
  }
  e.preventDefault();

  let eventTitle = e.target.elements[0].value;
  let eventBody = e.target.elements[1].value;
  let eventStart = e.target.elements[2].value;
  let eventEnd = e.target.elements[5].value;
  let startTime = e.target.elements[3].value;
  let endTime = e.target.elements[6].value;
  let reminder = document.querySelector(
    'input[name="reminder"]:checked'
  )?.value;
  let eventType = e.target.elements[13].value;
  let splittedTime = startTime.split(":");

  let millisecondsStart =
    new Date(eventStart).valueOf() +
    parseInt(splittedTime[0]) * 3600000 +
    parseInt(splittedTime[1]) * 60000;

  splittedTime = endTime.split(":");
  let millisecondsEnd =
    new Date(eventEnd).valueOf() +
    parseInt(splittedTime[0] - 1) * 3600000 +
    parseInt(splittedTime[1]) * 60000;

  let eventDay = `${new Date(eventStart).getDate()}-${new Date(
    eventStart
  ).getMonth()}-${new Date(eventStart).getFullYear()}`;

  let newEvent = document.createElement("p");
  newEvent.classList.add("event");
  newEvent.innerHTML = eventTitle;
  newEvent.setAttribute("draggable", true);
  newEvent.addEventListener("dragstart", dragStart);
  newEvent.addEventListener("click", openEditForm);

  newEvent.style.backgroundColor =
    eventType === "meeting"
      ? "yellow"
      : eventType === "personal"
      ? "#62f07e"
      : eventType === "study"
      ? "#6262f0"
      : "lightblue";

  newEvent.id = new Date().getTime();

  events.push({
    day: eventDay,
    eventTitle: eventTitle,
    eventMsg: eventBody,
    startDate: eventStart,
    startTime: millisecondsStart,
    endTime: millisecondsEnd,
    endDate: eventEnd,
    reminder: reminder,
    eventType: eventType,
    eventId: parseInt(newEvent.id),
    startTimeDisplay: startTime,
    endTimeDisplay: endTime,
  });
  localStorage.setItem("event-list", JSON.stringify(events));

  currentDay = document.getElementById(eventDay);

  newEvent.addEventListener("click", openEditForm);
  if (currentDay) {
    currentDay.appendChild(newEvent);
  }
  toggleAddModalVisibility();
  e.target.reset();
}

function openEditForm(e) {
  e.stopPropagation();
  currentEvent = e.target;

  let title = document.querySelector("#edit-event-title");
  let textarea = document.querySelector("#edit-event-text-input");
  let startDate = document.querySelector("#edit-event-start-date");
  let endDate = document.querySelector("#edit-event-end-date");
  let startTime = document.querySelector("#edit-start-time");
  let endTime = document.querySelector("#edit-end-time");
  let reminder = editEventForm.elements["reminder"];
  let eventType = document.querySelector("#event-type-edit");

  let currentEventObject = events.filter(
    (evt) => evt.eventId.toString() === e.target.id
  )[0];

  switch (currentEventObject.eventType) {
    case "meeting":
      eventType.selectedIndex = 1;
      break;
    case "personal":
      eventType.selectedIndex = 2;

      break;
    case "study":
      eventType.selectedIndex = 3;

      break;
    case "other":
      eventType.selectedIndex = 4;

      break;

    default:
      break;
  }

  switch (currentEventObject.reminder) {
    case "5":
      () => {
        reminder[0].checked = true;
      };
      break;
    case "10":
      () => {
        reminder[1].checked = true;
      };
      break;
    case "15":
      () => {
        reminder[2].checked = true;
      };
      break;
    case "30":
      () => {
        reminder[3].checked = true;
      };
      break;
    case "60":
      () => {
        reminder[4].checked = true;
      };
      break;

    default:
      break;
  }

  title.value = currentEventObject.eventTitle;
  textarea.value = currentEventObject.eventMsg;
  startDate.value = currentEventObject.startDate;
  endDate.value = currentEventObject.endDate;
  reminder.value = currentEventObject.reminder;
  startTime.value = currentEventObject.startTimeDisplay;
  endTime.value = currentEventObject.endTimeDisplay;

  toggleEditModalVisibility();
}

function editEvent(e) {
  e.preventDefault();

  if (e.target.innerText === "Delete") return;

  let currentDay = currentEvent.parentElement;

  currentDay.removeChild(currentEvent);

  let eventTitle = e.target.elements[0].value;
  let eventBody = e.target.elements[1].value;
  let eventStart = e.target.elements[2].value;
  let eventEnd = e.target.elements[4].value;
  let reminder = document.querySelector('input[name="reminder"]:checked').value;
  let eventType = e.target.elements[12].value;
  let startTime = e.target.elements[3].value;
  let endTime = e.target.elements[5].value;

  let splittedTime = startTime.split(":");

  let millisecondsStart =
    Date.now(eventStart) +
    parseInt(splittedTime[0]) * 3600000 +
    parseInt(splittedTime[0]) * 60000;

  splittedTime = endTime.split(":");

  let millisecondsEnd =
    Date.now(eventEnd) +
    parseInt(splittedTime[0]) * 3600000 +
    parseInt(splittedTime[0]) * 60000;

  let eventDay = `${new Date(eventStart).getDate()}-${new Date(
    eventStart
  ).getMonth()}-${new Date(eventStart).getFullYear()}`;

  let newEvent = document.createElement("p");
  newEvent.classList.add("event");
  newEvent.innerHTML = eventTitle;
  newEvent.setAttribute("draggable", true);
  newEvent.addEventListener("dragstart", dragStart);
  newEvent.addEventListener("click", openEditForm);

  newEvent.style.backgroundColor =
    eventType === "meeting"
      ? "#c362f0"
      : eventType === "personal"
      ? "#62f07e"
      : eventType === "study"
      ? "#6262f0"
      : "lightblue";

  newEvent.id = new Date().getTime();

  toggleEditModalVisibility();
  let filteredEvents = events.filter((evt) => {
    return evt.eventId != parseInt(currentEvent.id);
  });

  events = [];
  events.push(...filteredEvents, {
    day: eventDay,
    eventTitle: eventTitle,
    eventMsg: eventBody,
    startDate: eventStart,
    startTime: millisecondsStart,
    endTime: millisecondsEnd,
    startTimeDisplay: startTime,
    endTimeDisplay: endTime,
    endDate: eventEnd,
    reminder: reminder,
    eventType: eventType,
    eventId: parseInt(newEvent.id),
  });
  localStorage.setItem("event-list", JSON.stringify(events));
  currentDay = document.getElementById(eventDay);

  newEvent.addEventListener("click", openEditForm);
  currentDay.appendChild(newEvent);

  e.target.reset();
}

function deleteEvent(e) {
  let currentDay = currentEvent.parentElement;
  let filteredEvents = events.filter((evt) => {
    return evt.eventId != parseInt(currentEvent.id);
  });

  events = [];
  events.push(...filteredEvents);
  localStorage.setItem("event-list", JSON.stringify(events));
  currentDay.removeChild(currentEvent);
  toggleEditModalVisibility();
}

function dragStart(e) {
  currentEvent = e.target;
}

function dragOver(e) {
  e.preventDefault();
  e.target.style.border = "1px dashed blue";
}

function dragLeave(e) {
  e.preventDefault();
  e.target.style.border = "1px solid rgb(50, 50, 247)";
}

function dragDrop(e) {
  if (e.target.classList[0] === "day") {
    e.target.style.border = "1px solid rgb(50, 50, 247)";
    e.target.appendChild(currentEvent);

    let filteredEvents = events.filter((evt) => {
      return evt.eventId != parseInt(currentEvent.id);
    });
    let event = events.filter((evt) => {
      return evt.eventId === parseInt(currentEvent.id);
    })[0];

    event.day = e.target.id;
    let newDay = e.target.id.split("-");
    newDay[1] = parseInt(newDay[1] + 1);
    if (newDay[1] < 10) {
      newDay[1] = `0${newDay[1]}`;
    }
    if (newDay[2] < 10) {
      newDay[2] = `0${newDay[2]}`;
    }
    newDay = newDay.reverse().join("-");

    event.startDate = `${new Date(newDay).getFullYear()}-${
      new Date(newDay).getMonth() + 1
    }-${new Date(newDay).getDate()}`;

    let correctDate = event.startDate.split("-");

    if (parseInt(correctDate[1]) < 10) {
      correctDate[1] = `0${correctDate[1]}`;
    }
    if (parseInt(correctDate[2]) < 10) {
      correctDate[2] = `0${correctDate[2]}`;
    }
    correctDate = correctDate.join("-");
    event.startDate = correctDate;

    events = [];
    events.push(...filteredEvents, event);
    localStorage.setItem("event-list", JSON.stringify(events));
  }
}

function getExpiredEvents() {
  setTimeout(() => {
    let now = Date.now();
    let expired = events.filter((evt) => parseInt(evt.endTime) < now);
    expired.forEach((el) => {
      let day = document.getElementById(el.eventId);
      day.style.backgroundColor = "#bab1b1";
    });
  }, 1);
  setInterval(() => {
    let now = Date.now();
    let expired = events.filter((evt) => evt.endTime < now);
    expired.forEach((el) => {
      let day = document.getElementById(el.eventId);
      day.style.backgroundColor = "#bab1b1";
    });
  }, 10000);
}
