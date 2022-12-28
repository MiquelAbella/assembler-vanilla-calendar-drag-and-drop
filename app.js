const closeAddModalBtn = document.querySelector("#add-modal-close-btn");
const addEventModal = document.querySelector("#add-event-modal");
const addEventForm = document.querySelector("#add-event-form");
const editEventTextarea = document.querySelector("#edit-event-text-input");

const closeEditModalBtn = document.querySelector("#edit-modal-close-btn");
const editEventModal = document.querySelector("#edit-event-modal");
const editEventForm = document.querySelector("#edit-event-form");
const deleteEventBtn = document.querySelector("#delete-event");

closeAddModalBtn.addEventListener("click", toggleAddModalVisibility);
closeEditModalBtn.addEventListener("click", toggleEditModalVisibility);

addEventForm.addEventListener("submit", addEvent);
editEventForm.addEventListener("submit", editEvent);
deleteEventBtn.addEventListener("click", deleteEvent);

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

  backArrow.innerText = "BACK";
  backArrow.id = "back-" + (month + monthCounter) + "-" + year;
  backArrow.addEventListener("click", printPrevMonth);
  nextArrow.innerText = "NEXT";
  nextArrow.id = "next-" + (month + monthCounter) + "-" + year;
  nextArrow.addEventListener("click", printNextMonth);

  let numberOfDays = getDaysInMonth(
    year + yearCounter,
    month + monthCounter,
    0
  );

  let daysContainer = document.createElement("div");
  daysContainer.classList.add("month-container");

  for (let i = 0; i < numberOfDays; i++) {
    let day = document.createElement("div");
    day.classList.add("day");
    let dayText = document.createElement("p");
    dayText.innerText = i + 1;
    dayText.style.color = "#3279a8";
    day.id = `${dayText.innerText}-${month + monthCounter}-${
      year + yearCounter
    }`;

    day.appendChild(dayText);
    day.addEventListener("click", addEventToCalendar);
    day.addEventListener("dragover", dragOver);
    day.addEventListener("drop", dragDrop);
    day.addEventListener("dragleave", dragLeave);
    daysContainer.appendChild(day);

    events.map((event) => {
      if (event.day === day.id) {
        let newEvent = document.createElement("p");
        newEvent.classList.add("event");
        newEvent.innerHTML = event.eventMsg;
        newEvent.id = parseInt(event.eventId);
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

function addEventToCalendar(e) {
  currentDay = e.target;
  addEventModal.classList.toggle("hidden");
}

function toggleAddModalVisibility() {
  addEventModal.classList.toggle("hidden");
}
function toggleEditModalVisibility() {
  editEventModal.classList.toggle("hidden");
}

function addEvent(e) {
  e.preventDefault();
  let eventText = e.target.elements[0].value;
  let newEvent = document.createElement("p");
  newEvent.classList.add("event");
  newEvent.innerHTML = eventText;
  newEvent.setAttribute("draggable", true);
  newEvent.addEventListener("dragstart", dragStart);
  newEvent.id = new Date().getTime();

  events.push({
    day: currentDay.id,
    eventMsg: eventText,
    eventId: parseInt(newEvent.id),
  });
  localStorage.setItem("event-list", JSON.stringify(events));

  newEvent.addEventListener("click", openEditForm);
  currentDay.appendChild(newEvent);
  toggleAddModalVisibility();
  e.target.reset();
}

function openEditForm(e) {
  e.stopPropagation();
  currentEvent = e.target;
  editEventTextarea.value = e.target.innerHTML;
  toggleEditModalVisibility();
}

function editEvent(e) {
  e.preventDefault();
  console.log(currentEvent);
  let currentDay = currentEvent.parentElement;
  let eventText = e.target.elements[0].value;
  currentEvent.innerText = eventText;
  toggleEditModalVisibility();
  let filteredEvents = events.filter((evt) => {
    return evt.eventId != parseInt(currentEvent.id);
  });
  events = [];
  events.push(...filteredEvents, {
    day: currentDay.id,
    eventMsg: eventText,
    eventId: parseInt(currentEvent.id),
  });
  localStorage.setItem("event-list", JSON.stringify(events));
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
  e.target.style.border = "1px solid lightblue";
}

function dragDrop(e) {
  if (e.target.classList[0] === "day") {
    e.target.style.border = "1px solid lightblue";
    e.target.appendChild(currentEvent);
    let filteredEvents = events.filter((evt) => {
      return evt.eventId != parseInt(currentEvent.id);
    });
    events = [];
    events.push(...filteredEvents, {
      day: e.target.id,
      eventMsg: currentEvent.innerText,
      eventId: parseInt(currentEvent.id),
    });
    localStorage.setItem("event-list", JSON.stringify(events));
  }
}
