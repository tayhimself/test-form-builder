// forms.js
// Common form functions currently used in OSA and ESS exported as an IIFE
//
export const listeners = function (form) {
  const previousButton = document.querySelector("#prev")
  const nextButton = document.querySelector("#next")
  const submitButton = document.querySelector("#submit")
  const tabTargets = document.querySelectorAll(".question")
  const tabPanels = document.querySelectorAll(".question")
  const resultPanel = document.getElementById("result")
  const spinner = document.getElementById("spinner")
  const isEmpty = (str) => !str.trim().length
  let currentStep = 0

  // Add an event listener to the input elements that goes to the next page after 2 seconds when the user selects an answer

  let inputs = document.querySelectorAll("input[type='radio']")
  inputs.forEach((input) => {
    // add a click event listener to the input
    input.addEventListener("click", (event) => {
      // show the spinner
      spinner.classList.remove("hidden")
      //hide the next and previous buttons
      nextButton.classList.add("hidden")
      previousButton.classList.add("hidden")
      // go to the next page after 1.5 seconds
      setTimeout(() => {
        nextButton.click()
        spinner.classList.add("hidden")
        updateStatusDisplay()
      }, 1200)
    })
  })

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
    updateStatusDisplay("next")
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
    updateStatusDisplay("previous")
  })

  function updateStatusDisplay(button = "") {
    if (currentStep == 0) {
      // If it's the first step, hide the previous button
      nextButton.classList.remove("hidden")
      previousButton.classList.add("hidden")
      submitButton.classList.add("hidden")
    } else if (currentStep === tabTargets.length - 1) {
      // If it's the last step, hide the next button and show submit
      nextButton.classList.add("hidden")
      previousButton.classList.remove("hidden")
      submitButton.classList.remove("hidden")
    } else if (currentStep === tabTargets.length) {
      nextButton.classList.add("hidden")
      //validateEntry()
      showResults()
    } else {
      // In all other instances, display both next and previous buttons
      // check if we are dependent on any previous answers using data attributes (dataset)
      do {
        let dependent = tabTargets[currentStep].dataset
        console.log("dependent: ", dependent)
        if (dependent.depends && dependent.dependsValue) {
          let dependentAnswers = document.querySelectorAll("input[name='" + dependent.depends + "']:checked")
          if (dependentAnswers.length > 0) {
            // we have a dependent answer
            if (dependentAnswers[0].value !== dependent.dependsValue) {
              // the answer is not the one we are looking for so skip this question
              nextButton.classList.remove("hidden")
              previousButton.classList.remove("hidden")
              submitButton.classList.add("hidden")
              // Hide current tab
              tabPanels[currentStep].classList.add("hidden")
              tabTargets[currentStep].classList.remove("active")
              // Show next tab
              if (button === "next") {
                tabPanels[currentStep + 1].classList.remove("hidden")
                tabTargets[currentStep + 1].classList.add("active")
                currentStep += 1
              } else if (button === "previous") {
                tabPanels[currentStep - 1].classList.remove("hidden")
                tabTargets[currentStep - 1].classList.add("active")
                currentStep -= 1
              }
            } else {
              break
            }
          }
        } else {
          //exit the while loop
          break
        }
      } while (currentStep < tabTargets.length - 1 && currentStep > 0)
      nextButton.classList.remove("hidden")
      previousButton.classList.remove("hidden")
      submitButton.classList.add("hidden")
    }
  }

  function calculateScore() {
    let score = 0
    let answers = document.querySelectorAll("input:checked")
    answers.forEach((answer) => {
      score += parseInt(answer.value)
    })
    return score
  }

  function showResults() {
    // Hide the form
    form.classList.add("hidden")
    document.querySelector("div.pagination").classList.add("hidden")
    // Show the results
    resultPanel.classList.remove("hidden")
    // Calculate the score
    let score = calculateScore()
    // Display the score
    resultPanel.querySelector("span").innerHTML = score
  }
}
