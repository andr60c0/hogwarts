"use strict";

window.addEventListener("DOMContentLoaded", start);

let allStudents = [];
let gryffindorPrefects = [];
let hufflepuffPrefects = [];
let ravenclawPrefects = [];
let slytherinPrefects = [];
let expelledStudents = [];
let inqSquad = [];
let bloodStatus = {};
let currentFilter = "all_students";
let currentSort = "name";
let hasBeenHacked = false;

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
  bloodStatus: "",
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

  //loadJSON();
  loadJSON("https://petlatkea.dk/2020/hogwarts/students.json", prepareObjects);
  loadJSON(
    "https://petlatkea.dk/2020/hogwarts/families.json",
    prepareBloodStatus
  );
}

async function loadJSON(url, callback) {
  console.log("loadJSON");
  // const response = await fetch(
  //   "https://petlatkea.dk/2020/hogwarts/students.json"
  // );
  // const jsonData = await response.json();

  //when loaded, prepare data objects
  // prepareObjects(jsonData);
  //console.log(jsonData);
  const response = await fetch(url);
  const data = await response.json();
  callback(data);
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
  } else if (currentFilter === "inq_squad") {
    const onlyInqMembers = inqSquad;
    return onlyInqMembers;
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

function prepareBloodStatus(jsonData) {
  bloodStatus = jsonData;
  console.log(bloodStatus);

  allStudents.forEach((student) => {
    if (
      bloodStatus.pure.includes(student.lastName) === true &&
      bloodStatus.half.includes(student.lastName) === false
    ) {
      student.bloodStatus = "Pure blood";
    } else if (
      bloodStatus.pure.includes(student.lastName) === true &&
      bloodStatus.half.includes(student.lastName) === true
    ) {
      student.bloodStatus = "Pure blood";
    } else if (
      bloodStatus.pure.includes(student.lastName) === false &&
      bloodStatus.half.includes(student.lastName) === true
    ) {
      student.bloodStatus = "Half blood";
    } else {
      student.bloodStatus = "Muggle blood";
    }
  });
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
    lastName = "undefined";
  }

  let image = lastName + "_" + firstName.substring(0, 1) + ".png";
  if (image.includes("-")) {
    image = image.substring(image.indexOf("-") + 1);
  }
  if (image.includes("Patil")) {
    image = lastName + "_" + firstName + ".png";
  }

  if (image.includes("undefined")) {
    image = "anonymous.jpg";
  }
  image = image.toLowerCase();

  //TODO: Make capitalize function work with middlename, nickname and lastname
  student.firstName = capitalize(firstName);
  student.middlename = capitalize(middleName);
  student.nickname = nickName;
  student.lastName = lastName;
  student.house = capitalize(house);
  student.image = image;
  student.canBeExpelled = true;

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

  //Showing number of students in each house + all Students + expelled students
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
  document.querySelector(".all_students").textContent =
    "Enrolled students: " + allStudents.length;

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

  document.querySelector(".student_picture").src =
    "/student_images/" + student.image;

  //EXPEL
  if (student.isExpelled === true) {
    document.querySelector(".enrollment_status").textContent = "Expelled";
    document.querySelector(".expel_button").classList.add("hide");
  } else {
    document.querySelector(".expel_button").classList.remove("hide");
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
  } else {
    document
      .querySelector(".prefect_button")
      .addEventListener("click", removePrefect);
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

  function removePrefect() {
    console.log("removePrefect");
    document
      .querySelector(".prefect_button")
      .removeEventListener("click", removePrefect);
    removeAsPrefect(student);
  }

  document.querySelector("#closebutton").addEventListener("click", () => {
    popUp.classList.add("hide");
  });

  //BLOOD STATUS
  document.querySelector(".blood_status").textContent = student.bloodStatus;

  //INQUISITORIAL SQUAD

  if (student.inInqSquad === true) {
    document.querySelector(".inq_squad_status").textContent = "Active member";
    document.querySelector(".inq_button").textContent = "Remove as member";
  } else {
    document.querySelector(".inq_squad_status").textContent = "Not a member";
    document.querySelector(".inq_button").textContent = "Make as member";
  }

  if (student.inInqSquad === false) {
    document
      .querySelector(".inq_button")
      .addEventListener("click", addToInqSquad);
  } else {
    document
      .querySelector(".inq_button")
      .addEventListener("click", removeFromInqSquad);
  }

  function addToInqSquad() {
    console.log("addToInqSquad");
    document
      .querySelector(".inq_button")
      .removeEventListener("click", addToInqSquad);

    addInqSquadMember(student);
  }

  function removeFromInqSquad() {
    console.log("removeFromInqSquad");
    document
      .querySelector(".inq_button")
      .removeEventListener("click", removeFromInqSquad);

    removeInqSquadMember(student);
  }

  //HOUSE THEMES
  if (student.house == "Gryffindor") {
    document;
    setTheme("gryffindor_theme");
    document.querySelector(".house_crest").src = "images/gryffindorcrest.png";
  } else if (student.house == "Hufflepuff") {
    setTheme("hufflepuff_theme");
    document.querySelector(".house_crest").src = "images/hufflepuffcrest.png";
  } else if (student.house == "Ravenclaw") {
    setTheme("ravenclaw_theme");
    document.querySelector(".house_crest").src = "images/ravenclawcrest.png";
  } else if (student.house == "Slytherin") {
    setTheme("slytherin_theme");
    document.querySelector(".house_crest").src = "images/slytherincrest.png";
  }
}

function setTheme(themeName) {
  localStorage.setItem("theme", themeName);
  document.documentElement.className = themeName;
}

function expelStudent(student) {
  document
    .querySelector(".ok_button")
    .removeEventListener("click", expelStudent);

  console.log("expelStudent");
  if (student.canBeExpelled === false) {
    document.querySelector("#confirmation").classList.remove("hide");
    document.querySelector(".prefect_confirmation").textContent =
      "This student cannot be expelled";
    document.querySelector(".ok_button").addEventListener("click", () => {
      document.querySelector("#confirmation").classList.add("hide");
    });
  } else {
    if (student.isPrefect === true) {
      document.querySelector("#confirmation").classList.remove("hide");
      document.querySelector(".prefect_confirmation").textContent =
        student.firstName +
        " " +
        student.lastName +
        " is a prefect. To continue with expulsion, please remove student as prefect.";
      document.querySelector(".ok_button").addEventListener("click", () => {
        document.querySelector("#confirmation").classList.add("hide");
      });
    } else {
      allStudents.splice(allStudents.indexOf(student), 1);
      expelledStudents.push(student);
      student.isExpelled = true;
    }

    buildList();
    showDetails(student);
  }
}
function removeAsPrefect(student) {
  console.log("removeAsPrefect");
  student.isPrefect = false;
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
  prefectArray.splice(prefectArray.indexOf(student), 1);
  showDetails(student);
  buildList();
  console.log(student);
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
    switchPrefect(student, prefectArray);
  }
}

function switchPrefect(student, prefectArray) {
  console.log("switchPrefect");
  document.querySelector("#remove_other").classList.remove("hide");
  document.querySelector(".dialog_p").textContent =
    "There can only be two prefects in each house. Choose which prefect shall be replaced:";
  const prefectButton1 = document.querySelector(".prefect1");
  const prefectButton2 = document.querySelector(".prefect2");

  document
    .querySelector(".close_warning_button")
    .addEventListener("click", () => {
      document.querySelector("#remove_other").classList.add("hide");
    });
  prefectButton1.textContent =
    prefectArray[0].firstName + " " + prefectArray[0].lastName;
  prefectButton2.textContent =
    prefectArray[1].firstName + " " + prefectArray[1].lastName;

  prefectButton1.addEventListener("click", replacePrefect1);
  prefectButton2.addEventListener("click", replacePrefect2);

  function replacePrefect1() {
    console.log("replacePrefect1");
    replacePrefect(prefectArray, student, prefectArray[0]);
  }

  function replacePrefect2() {
    console.log("removePrefect2");
    replacePrefect(prefectArray, student, prefectArray[1]);
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

removeInqSquadMember;

function addInqSquadMember(student) {
  console.log("addInqSquadMember");
  if (student.bloodStatus === "Pure blood") {
    student.inInqSquad = true;
    inqSquad.push(student);
    showDetails(student);
    buildList();
  } else {
    document.querySelector("#confirmation").classList.remove("hide");
    document.querySelector(".prefect_confirmation").textContent =
      "This student cannot be a member of Inquisitorial squad do to their blood status";
    document.querySelector(".ok_button").addEventListener("click", () => {
      document.querySelector("#confirmation").classList.add("hide");
    });
  }
}

function removeInqSquadMember(student) {
  console.log("removeFromInqSquad");
  student.inInqSquad = false;
  inqSquad.splice(inqSquad.indexOf(student), 1);
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

function inInqSquad(student) {
  if (student.inInqSquad === true) {
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
document
  .querySelector(".hacker_button")
  .addEventListener("click", hackTheSystem);

function hackTheSystem() {
  document
    .querySelector(".hacker_button")
    .removeEventListener("click", hackTheSystem);
  console.log("hackTheSystem");
  hasBeenHacked = true;

  //Interface fades out

  document.querySelector(".interface_wrapper").classList.remove("fadeIn");
  document.querySelector(".interface_wrapper").classList.add("fadeOut");
  //When that is over, "I solemly swear i am up to no good" fades in
  document
    .querySelector(".interface_wrapper")
    .addEventListener("animationend", hackerHeadingFadeIn);

  function hackerHeadingFadeIn() {
    console.log("fadeIn");
    document.querySelector("#hackerintro").classList.remove("hide");
    document.querySelector("#hackerintro").classList.add("fadeIn");
    //When that is over, "I solemly swear i am up to no good" fades out
    document
      .querySelector("#hackerintro")
      .addEventListener("animationend", hackerHeadingFadeOut);
  }

  function hackerHeadingFadeOut() {
    console.log("hackerHeadingFadeOut");
    document.querySelector("#hackerintro").classList.remove("fadeIn");
    document.querySelector("#hackerintro").classList.add("fadeOut");
    //When that is over interface fades in again
    document
      .querySelector("#hackerintro")
      .addEventListener("animationend", interfaceFadeIn);
  }

  function interfaceFadeIn() {
    console.log("interfaceFadeIn");

    document.querySelector(".interface_wrapper").classList.remove("fadeOut");
    document.querySelector(".interface_wrapper").classList.add("fadeIn");
    document
      .querySelector(".interface_wrapper")
      .addEventListener("animationend", () => {
        document.querySelector(".hackerintro").classList.add("hide");
      });
  }

  //Injecting myself
  const myself = Object.create(Student);
  myself.firstName = "Andrea";
  myself.lastName = "Valgeirsdottir";
  myself.middlename = "";
  myself.nickname = "";
  myself.image = "anonymous.jpg";
  myself.house = "Gryffindor";
  myself.isPrefect = false;
  myself.inInqSquad = false;
  myself.isExpelled = false;
  myself.canBeExpelled = false;
  myself.bloodStatus = "Half-blood";
  console.log(myself);
  allStudents.push(myself);
  buildList();

  //Randomizing bloodstatus
  randomizeBloodStatus(student);

  //Removing Inq squad members
}

function randomizeBloodStatus(student) {
  allStudents.forEach((student) => {
    if (
      student.bloodStatus === "Pure blood" &&
      student.canBeExpelled === true
    ) {
      const randomizeBloodTypes = ["Pure blood", "Half blood", "Muggle blood"];
      console.log(student.bloodStatus);
      student.bloodStatus =
        randomizeBloodTypes[
          Math.floor(Math.random() * randomizeBloodTypes.length)
        ];
      console.log(student.bloodStatus);
    } else {
      student.bloodStatus = "Pure blood";
      console.log(student.bloodStatus);
    }
  });
}

function introFadeOut() {
  console.log("introFadeOut");
  document.querySelector(".intro").classList.remove("fadeOut");
  document.querySelector(".intro").classList.add("hide");
}

//Interface skal være hidet til at starte med DONE
//Headerphoto starts with fadeout class DONE
//when the header photo animation is done -> take hide from interface away
document.querySelector(".intro").addEventListener("animationend", () => {
  document.querySelector(".interface_wrapper").classList.remove("hide");
  document.querySelector(".interface_wrapper").classList.add("fadeIn");
});
