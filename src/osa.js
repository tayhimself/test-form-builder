import { listeners } from "./forms.js"
let response = await fetch("../osa.json")
let data = await response.json()
let form = document.createElement("form")
document.getElementById("main").appendChild(form)
let questions = Array.from(data.questions)

// set title
let titleEls = document.querySelectorAll("title, h1")
titleEls.forEach((el) => {
  el.innerHTML = data.title
})

questions.forEach((question, i) => {
  // check if data.depends exists and if so, add it to the markup
  let dependency = ``
  if (question.depends &&  question.depends.length > 0) {
    question.depends.forEach(dep =>
      dependency += `data-depends="${dep.question}" data-depends-value="${dep.value}"`
    )
  }
  console.log('dependency: ', dependency)
  let markup = `
  <div class="question ${i > 0 ? `hidden` : ``}"  ${dependency}>
  <label class="text-semibold text-xl text-left min-w-full">${question.text}</label>

  <ul class="grid grid-cols-1 gap-y-5 m-5 mx-auto w-1/2 ">
  ${question.options
    .map(
      (option, idx) => `
  <li class="relative">
  <input class="sr-only peer" type="radio" value=${option.value} name=${question.id} id="${question.id + idx}">
  <label class="flex p-5 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none hover:bg-gray-50 peer-checked:ring-green-500 peer-checked:ring-2 peer-checked:border-transparent peer-checked:bg-green-100" peer-checked:text-gray-600 for="${
    question.id + idx
  }">${option.text}</label></li>`
    )
    .join("")}
  </ul>
  </div>`
  form.innerHTML += markup
})

listeners(form)
