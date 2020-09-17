"use strict";

window.addEventListener("DOMContentLoaded", start);

let allStudents = [];
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
};

function start() {
  console.log("start");

  //TODO: Add event listeners to filter and sort buttons
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
  console.log("setSorting");
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
  student.middlename = middleName;
  student.nickname = nickName;
  student.lastName = lastName;
  student.house = capitalize(house);
  student.image = image;

  return student;
}

function buildList() {
  console.log("buildList");
  const currentList = setFilter();
  console.log("currentList", currentList);
  const sortedList = setSorting(currentList);

  displayList(sortedList);
}

function displayList(students) {
  console.log("displayList");
  //Clear the display
  document.querySelector("#list tbody").innerHTML = "";

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

  popUp.classList.remove("hide");
  popUp.querySelector("#closebutton").addEventListener("click", () => {
    popUp.classList.add("hide");
  });
  popUp.querySelector(".full_name").textContent =
    student.firstName +
    " " +
    student.middlename +
    " " +
    student.nickname +
    " " +
    student.lastName;
  popUp.querySelector(".student_picture").src =
    "/student_images/" + student.image;
  popUp.querySelector(".house").textContent = student.house;
}

//Cleaning up data functions

function capitalize(str) {
  const firstLetter = str.substring(0, 1).toUpperCase();
  const restOfName = str.substring(1).toLowerCase();
  const capitalizedName = firstLetter + restOfName;

  return capitalizedName;
}

//Filtering functions

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
