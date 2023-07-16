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

  // Add an event listener to the input elements that goes to the next page after 1.2 seconds when the user selects an answer

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
    // Show next tab if it exists. This handles the case for the last step when submit button is clicked, but we are calling nextButton.click() to go to the next step in the event listener function for the input elements to advance to the next page after 2 seconds when the user selects an answer
    if (currentStep < tabTargets.length - 1) {
      tabPanels[currentStep + 1].classList.remove("hidden")
      tabTargets[currentStep + 1].classList.add("active")
    }
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

    //console.log("currentStep: ", currentStep, "tabTargets.length: ", tabTargets.length)
    if (currentStep == 0) {
      // If it's the first step, hide the previous button
      nextButton.classList.remove("hidden")
      previousButton.classList.add("hidden")
      submitButton.classList.add("hidden")
    } else if (currentStep === tabTargets.length) {
      nextButton.classList.add("hidden")
      //validateEntry()
      showResults()
    } else {
      // In all other instances, display both next and previous buttons
      // check if we are dependent on any previous answers using data attributes (dataset)
      do {
        let dependent = tabTargets[currentStep].dataset
        console.log("dependent: ", dependent, "currentStep: ", currentStep)
        if (dependent.depends && dependent.dependsValue) {
          let dependentAnswers = document.querySelectorAll("input[name='" + dependent.depends + "']:checked")
          //console.log("dependentAnswers: ", dependentAnswers, "dependentAnswers.value: ", dependentAnswers[0].value)
          if (dependentAnswers.length > 0) {
            // we have a dependent answer, we need to loop over this, but for now let's just check the first one TODO: loop over all the dependent answers
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
          //exit the while loop if we don't have any more dependent answers
          break
        }
      } while (currentStep < tabTargets.length - 1 && currentStep > 0)

      previousButton.classList.remove("hidden")
      if (currentStep === tabTargets.length - 1) {
        // If it's the last step, hide the next button and show submit
        nextButton.classList.add("hidden")
        submitButton.classList.remove("hidden")
      } else {
        nextButton.classList.remove("hidden")
        submitButton.classList.add("hidden")
      }
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
    console.log("showResults")
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
