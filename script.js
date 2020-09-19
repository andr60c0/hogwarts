"use strict";

window.addEventListener("DOMContentLoaded", start);

let allStudents = [];
let gryffindorPrefects = [];
let hufflepuffPrefects = [];
let ravenclawPrefects = [];
let slytherinPrefects = [];
let expelledStudents = [];
let currentFilter = "all_students";
let currentSort = "name";

//The prototype for all students
const Student = {
  firstName: "",
  lastName: "",
  middlename: "",
  nickname: "",
  image: "",
  house: "",
  isPrefect: false,
  inInqSquad: false,
  isExpelled: false,
};

function start() {
  console.log("start");

  //Add event listeners to filter and sort buttons
  document.querySelectorAll("#filterlist").forEach((option) => {
    option.addEventListener("change", selectFilter);
  });

  document.querySelectorAll("#sortlist").forEach((option) => {
    option.addEventListener("change", selectSorting);
  });

  loadJSON();
}

async function loadJSON() {
  console.log("loadJSON");
  const response = await fetch(
    "https://petlatkea.dk/2020/hogwarts/students.json"
  );
  const jsonData = await response.json();

  //when loaded, prepare data objects
  prepareObjects(jsonData);
  //console.log(jsonData);
}

//Selecting filter and setting right filter

function selectFilter() {
  console.log("selectFilter");
  currentFilter = this.value;
  console.log("BLABLA", currentFilter);
  buildList();
}

function setFilter() {
  console.log("setFilter");
  if (currentFilter === "gryffindor") {
    const onlyGryffindor = allStudents.filter(inGryffindor);
    return onlyGryffindor;
  } else if (currentFilter === "hufflepuff") {
    const onlyHufflepuff = allStudents.filter(inHufflepuff);
    return onlyHufflepuff;
  } else if (currentFilter === "ravenclaw") {
    const onlyRavenclaw = allStudents.filter(inRavenclaw);
    return onlyRavenclaw;
  } else if (currentFilter === "slytherin") {
    const onlySlytherin = allStudents.filter(inSlytherin);
    return onlySlytherin;
  } else if (currentFilter === "prefects") {
    const onlyPrefects = allStudents.filter(isPrefect);
    return onlyPrefects;
  } else if (currentFilter === "expelled") {
    const onlyExpelled = expelledStudents;
    return onlyExpelled;
  } else {
    return allStudents;
  }
}

function selectSorting() {
  console.log("selectSorting");
  currentSort = this.value;
  buildList();
}

function setSorting(currentList) {
  console.log("setSorting");
  if (currentSort === "name") {
    const sortedList = currentList.sort(sortByName);
    return sortedList;
  } else if (currentSort === "lastname") {
    const sortedList = currentList.sort(sortByLastName);
    return sortedList;
  } else if (currentSort === "house") {
    const sortedList = currentList.sort(sortByHouse);
    return sortedList;
  }
}

function prepareObjects(jsonData) {
  console.log("prepareObjects");
  allStudents = jsonData.map(prepareObject);

  buildList();
}

function prepareObject(jsonObject) {
  console.log("prepareObject");
  const student = Object.create(Student);

  const house = jsonObject.house.trim();
  const fullName = jsonObject.fullname.trim();

  //Splitting the full name to first name,middle name, nickname and last name
  let firstName;
  if (fullName.includes(" ")) {
    firstName = fullName.substring(0, fullName.indexOf(" "));
  } else {
    firstName = fullName;
  }

  let middleName;
  if (
    fullName.includes(" ") &&
    fullName.lastIndexOf(" ") >= 0 &&
    !fullName.includes('"')
  ) {
    middleName = fullName
      .substring(fullName.indexOf(" ") + 1, fullName.lastIndexOf(" "))
      .trim();
    middleName = middleName.trim();
    if (middleName.length === 0) {
      middleName = "";
    }
  } else {
    middleName = "";
  }

  let nickName;
  if (fullName.includes('"')) {
    nickName = fullName.substring(
      fullName.indexOf(" ") + 1,
      fullName.lastIndexOf(" ")
    );
    nickName =
      nickName.substring(0, 2).toUpperCase() +
      nickName.substring(2).toLowerCase();
  } else {
    nickName = "";
  }

  let lastName;
  if (fullName.includes(" ")) {
    lastName = fullName.substring(fullName.lastIndexOf(" ")).trim();
    if (lastName.includes("-")) {
      lastName =
        lastName.substring(0, lastName.indexOf("-")) +
        lastName
          .substring(lastName.indexOf("-"), lastName.indexOf("-") + 2)
          .toUpperCase() +
        lastName.substring(lastName.indexOf("-") + 2).toLowerCase();
    } else {
      lastName =
        lastName.substring(0, 1).toUpperCase() +
        lastName.substring(1).toLowerCase();
    }
  } else {
    lastName = "";
  }

  let image = lastName + "_" + firstName.substring(0, 1) + ".png";
  if (image.includes("-")) {
    image = image.substring(image.indexOf("-") + 1);
  }
  if (image.includes("Patil")) {
    image = lastName + "_" + firstName + ".png";
  }
  image = image.toLowerCase();

  //TODO: Make capitalize function work with middlename, nickname and lastname
  student.firstName = capitalize(firstName);
  student.middlename = capitalize(middleName);
  student.nickname = nickName;
  student.lastName = lastName;
  student.house = capitalize(house);
  student.image = image;

  return student;
}
//Building the list going through both filtering and sorting and returning the updated list
function buildList() {
  console.log("buildList");
  const currentList = setFilter();
  console.log("currentList", currentList);
  const sortedList = setSorting(currentList);
  console.log("sortedList", sortedList);
  displayList(sortedList);
}

function displayList(students) {
  console.log("displayList");
  //Clear the display
  document.querySelector("#list tbody").innerHTML = "";

  //Showing number of students in each house + all Students
  //TODO: Show number of expelled students
  document.querySelector(".gryffindor_students").textContent =
    "Students in Gryffindor: " +
    allStudents.filter((student) => student.house === "Gryffindor").length;
  document.querySelector(".hufflepuff_students").textContent =
    "Students in Hufflepuff: " +
    allStudents.filter((student) => student.house === "Hufflepuff").length;
  document.querySelector(".ravenclaw_students").textContent =
    "Students in Ravenclaw: " +
    allStudents.filter((student) => student.house === "Ravenclaw").length;
  document.querySelector(".slytherin_students").textContent =
    "Students in Slytherin: " +
    allStudents.filter((student) => student.house === "Slytherin").length;
  document.querySelector(".expelled_students").textContent =
    "Expelled Students: " + expelledStudents.length;

  //Build a new list
  students.forEach(displayStudent);
}

function displayStudent(student) {
  console.log("displayStudent");
  //Create clone
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);

  //Set clone data
  clone.querySelector(
    "[data-field=name]"
  ).textContent = `${student.firstName} ${student.lastName}`;
  // clone.querySelector("[data-field=lastname]").textContent = student.lastName;
  clone.querySelector("[data-field=house]").textContent = student.house;

  //Add event listener for popUp view
  clone
    .querySelector("[data-field=name]")
    .addEventListener("click", () => showDetails(student));

  //Append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

function showDetails(student) {
  console.log("showDetails");

  // document.querySelector("#popUp").innerHTML = "";
  document.querySelector("#popUp").classList.remove("hide");

  document.querySelector(".full_name").textContent =
    student.firstName +
    " " +
    student.middlename +
    " " +
    student.nickname +
    " " +
    student.lastName;
  document.querySelector(".house").textContent = student.house;
  document.querySelector(".student_picture").src =
    "/student_images/" + student.image;
  //EXPELLED
  if (student.isExpelled === true) {
    document.querySelector(".enrollment_status").textContent = "Expelled";
    document.querySelector(".expel_button").textContent = "Re-enroll";
  } else {
    document.querySelector(".enrollment_status").textContent = "Enrolled";
    document.querySelector(".expel_button").textContent = "Expel";
  }

  //Adding eventlistener to expel button

  document
    .querySelector(".expel_button")
    .addEventListener("click", enrollmentStatus);

  function enrollmentStatus() {
    console.log("enrollmentStatus");
    document
      .querySelector(".expel_button")
      .removeEventListener("click", enrollmentStatus);

    expelStudent(student);
  }
  // PREFECTS
  if (student.isPrefect === true) {
    document.querySelector(".prefect_status").textContent = "Active prefect";
    document.querySelector(".prefect_button").textContent = "Remove as prefect";
  } else {
    document.querySelector(".prefect_status").textContent = "Not a prefect";
    document.querySelector(".prefect_button").textContent = "Make as prefect";
  }

  //Adding event listener to prefect button
  if (student.isPrefect === false) {
    document
      .querySelector(".prefect_button")
      .addEventListener("click", addPrefect);
  }
  //Removing the eventlistener from the prefect button and calling the function that checks if there is space for a prefect
  function addPrefect() {
    console.log("addPrefect");
    document
      .querySelector(".prefect_button")
      .removeEventListener("click", addPrefect);
    // togglePrefectStatus(student);
    checkNumberOfPrefects(student);
  }

  document.querySelector("#closebutton").addEventListener("click", () => {
    popUp.classList.add("hide");
  });
}

function expelStudent(student) {
  console.log("expelStudent");
  allStudents.splice(allStudents.indexOf(student), 1);

  expelledStudents.push(student);
  student.isExpelled = true;
  document.querySelector(".expel_button").classList.add("hide");
  showDetails(student);
  buildList();
}

//Checking the number of prefects in each house
function checkNumberOfPrefects(student) {
  console.log("checkNumberOfPrefects");
  let prefectArray = [];

  if (student.house === "Gryffindor") {
    prefectArray = gryffindorPrefects;
  } else if (student.house === "Hufflepuff") {
    prefectArray = hufflepuffPrefects;
  } else if (student.house === "Ravenclaw") {
    prefectArray = ravenclawPrefects;
  } else if (student.house === "Slytherin") {
    prefectArray = slytherinPrefects;
  }

  // console.log(prefectArray);

  if (prefectArray.length < 2) {
    student.isPrefect = true;
    prefectArray.push(student);
    showDetails(student);
    buildList();
    // console.log(student);
  } else if (prefectArray.length > 1) {
    removePrefect(student, prefectArray);
  }
}

function removePrefect(student, prefectArray) {
  console.log("removePrefect");
  document.querySelector("#remove_other").classList.remove("hide");
  const prefectButton1 = document.querySelector(".prefect1");
  const prefectButton2 = document.querySelector(".prefect2");

  prefectButton1.textContent =
    prefectArray[0].firstName + " " + prefectArray[0].lastName;
  prefectButton2.textContent =
    prefectArray[1].firstName + " " + prefectArray[1].lastName;

  prefectButton1.addEventListener("click", removePrefect1);
  prefectButton2.addEventListener("click", removePrefect2);

  function removePrefect1() {
    console.log("removePrefect1");
    replacePrefect(prefectArray, student, prefectArray[0]);
  }

  function removePrefect2() {
    console.log("removePrefect2");
    replacePrefect(prefectArray, student, prefectArray[0]);
  }
}

function replacePrefect(prefectArray, student, replacedStudent) {
  console.log("replacePrefect");
  prefectArray.splice(prefectArray.indexOf(replacedStudent), 1);
  prefectArray.push(student);
  student.isPrefect = true;
  replacedStudent.isPrefect = false;
  document.querySelector("#remove_other").classList.add("hide");

  document.querySelector("#confirmation").classList.remove("hide");
  document.querySelector(".prefect_confirmation").textContent =
    student.firstName +
    " " +
    student.lastName +
    " has replaced " +
    replacedStudent.firstName +
    " " +
    replacedStudent.lastName +
    " as prefect";

  document.querySelector(".ok_button").addEventListener("click", () => {
    document.querySelector("#confirmation").classList.add("hide");
  });
  showDetails(student);
  buildList();
}

//Cleaning up data functions

function capitalize(str) {
  const firstLetter = str.substring(0, 1).toUpperCase();
  const restOfName = str.substring(1).toLowerCase();
  const capitalizedName = firstLetter + restOfName;

  return capitalizedName;
}

//Filtering functions

function isPrefect(student) {
  if (student.isPrefect === true) {
    return true;
  } else {
    return false;
  }
}

function inGryffindor(student) {
  if (student.house === "Gryffindor") {
    return true;
  } else {
    return false;
  }
}

function inHufflepuff(student) {
  if (student.house === "Hufflepuff") {
    return true;
  } else {
    return false;
  }
}

function inRavenclaw(student) {
  if (student.house === "Ravenclaw") {
    return true;
  } else {
    return false;
  }
}

function inSlytherin(student) {
  if (student.house === "Slytherin") {
    return true;
  } else {
    return false;
  }
}

//Sorting functions
function sortByName(a, b) {
  if (a.firstName < b.firstName) {
    return -1;
  } else {
    return 1;
  }
}

function sortByLastName(a, b) {
  if (a.lastName < b.lastName) {
    return -1;
  } else {
    return 1;
  }
}

function sortByHouse(a, b) {
  if (a.house < b.house) {
    return -1;
  } else {
    return 1;
  }
}
