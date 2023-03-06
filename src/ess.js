let response = await fetch("../ess.json")
let data = await response.json()
let form = document.createElement("form")
document.getElementById("main").appendChild(form)
let questions = Array.from(data.questions)


questions.forEach((question, i) => {
  let markup = `
  <div class="question ${i > 0 ? `hidden`:``}">
  <label class="text-semibold text-xl text-left min-w-full">Situation: ${question.text}</label>

  <ul class="grid grid-cols-1 gap-y-5 m-5 mx-auto w-1/2 ">
  ${question.options
    .map(
      (option, idx) => `
  <li class="relative">
  <input class="sr-only peer" type="radio" value=${i} name=${question.id} id="${question.id + option}">
  <label class="flex p-5 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none hover:bg-gray-50 peer-checked:ring-green-500 peer-checked:ring-2 peer-checked:border-transparent peer-checked:bg-green-100" peer-checked:text-gray-600 for="${
    question.id + option
  }">${option}</label></li>`
    )
    .join("")}
  </ul>
  </div>`
  form.innerHTML += markup

})

const previousButton = document.querySelector("#prev")
const nextButton = document.querySelector("#next")
const submitButton = document.querySelector("#submit")
const tabTargets = document.querySelectorAll(".question")
const tabPanels = document.querySelectorAll(".question")
const resultPanel = document.querySelector("#result")
const isEmpty = (str) => !str.trim().length
let currentStep = 0

// Next: Change UI relative to the current step and account for button permissions
nextButton.addEventListener("click", (event) => {
  event.preventDefault()
  // Hide current tab
  tabPanels[currentStep].classList.add("hidden")
  tabTargets[currentStep].classList.remove("active")
  // Show next tab
  tabPanels[currentStep + 1].classList.remove("hidden")
  tabTargets[currentStep + 1].classList.add("active")
  currentStep += 1
  updateStatusDisplay()
})

// Previous: Change UI relative to the current step and account for button permissions
previousButton.addEventListener("click", (event) => {
  event.preventDefault()
  // Hide current tab
  tabPanels[currentStep].classList.add("hidden")
  tabTargets[currentStep].classList.remove("active")
  // Show the previous tab
  tabPanels[currentStep - 1].classList.remove("hidden")
  tabTargets[currentStep - 1].classList.add("active")
  currentStep -= 1
  nextButton.removeAttribute("disabled")
  updateStatusDisplay()
})

function updateStatusDisplay() {
  // If on the last step, hide the next button and show submit
  if (currentStep === tabTargets.length - 1) {
    nextButton.classList.add("hidden")
    previousButton.classList.remove("hidden")
    submitButton.classList.remove("hidden")
    showResults()
    //validateEntry()

  // If it's the first step, hide the previous button
  } else if (currentStep == 0) {
    nextButton.classList.remove("hidden")
    previousButton.classList.add("hidden")
    submitButton.classList.add("hidden")

    // In all other instances, display both buttons
  } else {
    nextButton.classList.remove("hidden")
    previousButton.classList.remove("hidden")
    submitButton.classList.add("hidden")
  }
}

function showResults() {
  // Hide the form
  form.classList.add("hidden")
  // Show the results
  resultPanel.classList.remove("hidden")
  // Calculate the score
  let score = calculateScore()
  // Display the score
  resultPanel.querySelector("span").innerHTML = score
}

function calculateScore() {
  let score = 0
  let answers = document.querySelectorAll("input:checked")
  answers.forEach((answer) => {
    score += parseInt(answer.value)
  })
  return score
}