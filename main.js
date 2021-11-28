//  QUERY SELECTORS
var studyButton = document.querySelector("#study");
var meditateButton = document.querySelector("#meditate");
var exerciseButton = document.querySelector("#exercise");
var categorySection = document.querySelector(".category-button-section");
var studyImage = document.querySelector("#studyImage");
var meditateImage = document.querySelector("#meditateImage");
var exerciseImage = document.querySelector("#exerciseImage");
var startActivityButton = document.querySelector(".start-activity-button");
var timerViewPage = document.querySelector(".timer-view");
var chooseCatViewPage = document.querySelector(".choose-category-view");
var completedViewPage = document.querySelector(".completed-view");
var goalInput = document.querySelector(".goal-input");
var minsInput = document.querySelector(".mins-input");
var secsInput = document.querySelector(".secs-input");
var timerText = document.querySelector(".timer-text");
var activityName = document.querySelector(".activity-name");
var goalError = document.querySelector(".error-goal");
var minutesError = document.querySelector(".error-minutes");
var secondsError = document.querySelector(".error-seconds");
var buttonError = document.querySelector(".error-button");
var startCompleteButton = document.querySelector(".start-complete-button");
var pageTitle = document.querySelector(".title");
var logActivityButton = document.querySelector(".log-activity-button");
var noActivitiesText = document.querySelector(".no-activities-text");
var activityCardSection = document.querySelector(".activities-list");
var createNewActivityButton = document.querySelector(".create-new-activity-button");
var inputs = document.querySelectorAll("input");
var errorMessages = document.querySelectorAll(".error-message");

// GLOBAL VARIABLES
var currentActivity;
var savedActivities = [];

// FUNCTIONS
let getActivatedCategory = () => {
  var categoryElement = document.querySelector(".activated-category");
  if (!categoryElement) {
    return "";
  };
  return categoryElement.id;
}

let returnHome = () => {
  addHidden(completedViewPage);
  removeHidden(chooseCatViewPage);
  deactivateCategory(getActivatedCategory());
  startCompleteButton.classList.remove(`${currentActivity.category}-border`);
  pageTitle.innerText = "New Activity";
  clearInputs();
  clearErrorMessages();
}

let clearInputs = () => {
  inputs.forEach(item => {
    item.value = null;
  })
}

let clearErrorMessages = () => {
  errorMessages.forEach(message => {
    addErrorHidden(message);
  })
}

let logActivity = () => {
  addHidden(timerViewPage);
  addHidden(noActivitiesText);
  removeHidden(completedViewPage);
  pageTitle.innerText = "Completed Activity";
  currentActivity.saveToStorage();
  displayActivityCards();
}

let createCardCategory = category =>
  category.charAt(0).toUpperCase() + category.substr(1);


let displayActivityCards = () => {
  activityCardSection.innerHTML = ``;
  savedActivities = [];
  getStoredActivities();
  sortList(savedActivities);
  savedActivities.forEach(activity => {
     addToActivityList(activity);
  })
  if (savedActivities.length > 0) {
    addHidden(noActivitiesText);
  }
}

let getStoredActivities = () => {
  for (var i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i).includes("activity")) {
      var stringifiedActivity = localStorage.getItem(`${localStorage.key(i)}`);
      var parsedActivity = JSON.parse(stringifiedActivity);
      savedActivities.push(parsedActivity);
    }
  }
}

let sortList = list => {
  savedActivities.forEach(activity => {
    activity.id = activity.id.substring(8)
  })
  savedActivities = savedActivities.sort(function(a, b) {
    return b.id - a.id;
  })
}

let addToActivityList = activity => {
  activityCardSection.innerHTML += `
  <div class="activity-card">
    <div class="activity-details">
      <p class="activity-card-label">${createCardCategory(activity.category)}</p>
      <p class="activity-card-time">${activity.minutes} MIN ${activity.seconds} SECONDS</p>
      <p class="activity-card-description">${activity.description}</p>
    </div>
    <div class="activity-icon-div">
      <div class="activity-icon" id ="${activity.id}">
      </div>
    </div>
  </div>
  `;
  var activityCardIcon = document.getElementById(`${activity.id}`);
  activityCardIcon.classList.add(`${activity.category}-box`);
}

let setCategory = selectedCategory => {
  var currentActivatedCategory = getActivatedCategory();
  if (currentActivatedCategory) {
    deactivateCategory(currentActivatedCategory);
  }
  activateCategory(selectedCategory);
}

let getCategoryElements = category => {
  switch(true) {
    case category === "study":
      return {button: studyButton, image: studyImage};
      break;
    case category === "meditate":
      return {button: meditateButton, image: meditateImage};
      break;
    case category === "exercise":
      return {button: exerciseButton, image: exerciseImage};
  }
}

let deactivateCategory = category => {
  var currCategory = getCategoryElements(category);
  currCategory.button.classList.remove(`${category}-button-clicked`);
  currCategory.button.classList.remove("activated-category");
  currCategory.image.src = `assets/${category}.svg`;
}

let activateCategory = category => {
  var currCategory = getCategoryElements(category);
  currCategory.button.classList.add(`${category}-button-clicked`);
  currCategory.button.classList.add("activated-category");
  currCategory.image.src = `assets/${category}-active.svg`;
}

let addHidden = element => {
  element.classList.add("hidden");
}

let addErrorHidden = element => {
  element.classList.add("error-hidden");
}

let removeHidden = element => {
  element.classList.remove("hidden");
}

let removeErrorHidden = element => {
  element.classList.remove("error-hidden");
}

let startActivity = () => {
  if (getActivatedCategory() && goalInput.value && minsInput.value && secsInput.value) {
    addHidden(chooseCatViewPage);
    removeHidden(timerViewPage);
    addHidden(logActivityButton);
    currentActivity = new Activity(getActivatedCategory(), goalInput.value, parseInt(minsInput.value), parseInt(secsInput.value));
    renderTimer(currentActivity.minutes, currentActivity.seconds);
    activityName.innerText = `${goalInput.value}`;
    changeButtonBorder();
    pageTitle.innerText = "Current Activity";
    startCompleteButton.innerText = "START";
    startCompleteButton.disabled = false;
  } else {
    showInputError();
  }
}

let showInputError = () => {
  var inputElements = [goalInput, minsInput, secsInput];
  var errorElements = [goalError, minutesError, secondsError];
  inputElements.forEach(input => {
    if (!input.value) {
      removeErrorHidden(errorElements[inputElements.indexOf(input)]);
    } else {
      addErrorHidden(errorElements[inputElements.indexOf(input)])
    }
  })
  if (!getActivatedCategory()) {
    removeErrorHidden(buttonError);
  } else {
    addErrorHidden(buttonError);
  }
}

let changeButtonBorder = () => {
  var activity = currentActivity.category;
  startCompleteButton.classList.add(`${activity}-border`);
}

let changeActivityCardColor = () => {
  var activity = currentActivity.category;
}

let callStartTimer = () => {
  var startTime = Date.now();
  currentActivity.startTimer(renderTimer, onTimerComplete);
  startCompleteButton.disabled = true;
  startCompleteButton.innerText = "";
}

let onTimerComplete = () => {
  startCompleteButton.innerText = "COMPLETE!";
  removeHidden(logActivityButton);
  currentActivity.markComplete();
}

let renderTimer = (minutes, seconds) => {
  timerText.innerText = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// EVENT LISTENERS
studyButton.addEventListener("click", () => {
  setCategory("study")
})

meditateButton.addEventListener("click", () => {
  setCategory("meditate")
})

exerciseButton.addEventListener("click", () => {
  setCategory("exercise")
})

startActivityButton.addEventListener("click", event => {
  event.preventDefault();
  startActivity();
})

startCompleteButton.addEventListener("click", callStartTimer);

logActivityButton.addEventListener("click", logActivity);

createNewActivityButton.addEventListener("click", returnHome);

window.addEventListener("load", displayActivityCards);
