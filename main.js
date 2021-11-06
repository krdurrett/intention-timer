//  QUERY SELECTORS
var studyButton = document.querySelector("#study");
var meditateButton = document.querySelector("#meditate");
var exerciseButton = document.querySelector("#exercise");
var categorySection = document.querySelector(".category-button-section")
var studyImage = document.querySelector("#study-image");
var meditateImage = document.querySelector("#meditate-image");
var exerciseImage = document.querySelector("#exercise-image");
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

// GLOBAL VARIABLES
var categoryElements = {study:{button: studyButton, image: studyImage},
                        meditate:{button:meditateButton, image: meditateImage},
                        exercise:{button:exerciseButton, image:exerciseImage}};
var currentActivatedCategory = "";
var currentActivity;
var startTime;
var updateTimer;
var savedActivities = [];

// EVENT LISTENERS
studyButton.addEventListener("click", function(){
  setCategory("study")
});

meditateButton.addEventListener("click", function(){
  setCategory("meditate")
});

exerciseButton.addEventListener("click", function(){
  setCategory("exercise")
});

startActivityButton.addEventListener("click", function(event) {
  event.preventDefault();
  startActivity();
});

startCompleteButton.addEventListener("click", callStartTimer);

logActivityButton.addEventListener("click", logActivity);

// FUNCTIONS
// goal: store a completed activity in local storage
// input: an object (one for each activity)
// output: stringified version in local storage
function pushToLSArray(){
  savedActivities.push(currentActivity);
  currentActivity.saveToStorage();
}

function pullFromLS(){
  for (var i = 0; i < savedActivities.length; i++) {
    localStorage.getItem(`${savedActivites[i].id}`);
  }
}

// create empty array
// add empty array to local storage (setItem('savedActivities', <stringified array>))

// when we click save activity:
// stringify the activity strigifiedActivity)
// localStorage.setItem('savedActivies', stingifiedActivity)




  // localStorage.setItem('storedActivites', JSON.stringify(savedActivites));


// create a global empty array to hold all saved activity objects
// add the current activity to array
// stringify the array
// add the array to local storage (setItems)

// display:
//  - parse the array from localStorage
// -  display each saved object (add a loop to createActivityCard function)


function logActivity() {
  addHidden(timerViewPage);
  addHidden(noActivitiesText);
  removeHidden(completedViewPage);
  createActivityCard(currentActivity);
  pageTitle.innerText = "Completed Activity";
  currentActivity.saveToStorage();
};

function createActivityCard(currentActivity) {

  activityCardSection.innerHTML = ``;
  activityCardSection.innerHTML = `
  <div class="activity-card">
    <div class="activity-details">
      <p class="activity-card-label">${currentActivity.category}</p>
      <p class="activity-card-time">${currentActivity.minutes.toString().padStart(2, "0")}:${currentActivity.seconds.toString().padStart(2, "0")}</p>
      <p class="activity-card-description">${currentActivity.description}</p>
    </div>
    <div class="activity-icon-div">
      <div class="activity-icon" id ="${currentActivity.id}">
      </div>
    </div>
  </div>
  `;
  var activityCardIcon = document.getElementById(`${currentActivity.id}`);
  activityCardIcon.classList.add(`${currentActivity.category}-box`);
};


function setCategory(selectedCategory) {
  if (currentActivatedCategory !== "") {
    deactivateCategory(currentActivatedCategory);
  };
  activateCategory(selectedCategory);
  currentActivatedCategory = selectedCategory;
};

function deactivateCategory(category){
  var currCategory = categoryElements[category];
  currCategory.button.classList.remove(`${category}-button-clicked`);
  currCategory.image.src = `assets/${category}.svg`;
};

function activateCategory(category){
  var currCategory = categoryElements[category];
  console.log(category, currCategory);
  currCategory.button.classList.add(`${category}-button-clicked`);
  currCategory.image.src = `assets/${category}-active.svg`;
};

function addHidden(element) {
  element.classList.add('hidden');
};

function addErrorHidden(element) {
  element.classList.add('error-hidden');
};

function removeHidden(element) {
  element.classList.remove('hidden');
};

function removeErrorHidden(element) {
  element.classList.remove('error-hidden');
};

function startActivity() {
  if (currentActivatedCategory !== '' && goalInput.value !== '' && minsInput.value !== '' && secsInput.value !== '') {
    addHidden(chooseCatViewPage);
    removeHidden(timerViewPage);
    currentActivity = new Activity(currentActivatedCategory, goalInput.value, parseInt(minsInput.value), parseInt(secsInput.value));
    renderTimer(currentActivity.minutes, currentActivity.seconds);
    activityName.innerText = `${goalInput.value}`;
    changeButtonBorder();
    pageTitle.innerText = "Current Activity";
  } else {
    showInputError();
  };
};

function showInputError() {
  var inputElements = [goalInput, minsInput, secsInput];
  var errorElements = [goalError, minutesError, secondsError];
  for (var i = 0; i < inputElements.length; i++) {
    if (inputElements[i].value === ''){
      removeErrorHidden(errorElements[i]);
    } else {
      addErrorHidden(errorElements[i])
    }
  };
  if (!currentActivatedCategory) {
    removeErrorHidden(buttonError);
  } else {
    addErrorHidden(buttonError);
  };
};

function changeButtonBorder() {
  var activity = currentActivity.category;
  startCompleteButton.classList.add(`${activity}-border`);
};

function changeActivityCardColor() {
  var activity = currentActivity.category;

}

function callStartTimer() {
  currentActivity.startTimer();
  startCompleteButton.disabled = true;
  startCompleteButton.innerText = '';
}

function updateTimer(){
  var currentTime = Date.now();
  var elapsedTime = currentTime - startTime;
  var overAllDuration = (currentActivity.minutes * 60 + currentActivity.seconds) * 1000;
  var remainingDuration = overAllDuration - elapsedTime;
  if (remainingDuration <= 0) {
    startCompleteButton.innerText = "COMPLETE!";
    removeHidden(logActivityButton);
    currentActivity.markComplete();
    return;
  }
  var remainingSeconds = Math.floor(remainingDuration / 1000);
  var minutesComponent = Math.floor(remainingSeconds / 60);
  var secondsComponent = Math.floor(remainingSeconds % 60);
  renderTimer(minutesComponent, secondsComponent);
  window.requestAnimationFrame(updateTimer);
}

function renderTimer(minutes, seconds){
  timerText.innerText = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
