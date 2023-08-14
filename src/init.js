export const initializeScreener = (disordersToScreen) => {

  disordersToScreen.forEach(([disorder, selected], idx) => {
    if (selected && disorder === "narcolepsy") disordersToScreen[idx] = ["ess", selected]
  })

  let screenStore = {}
  disordersToScreen.forEach(([disorder, selected]) => {
    screenStore[disorder] = {}
    screenStore[disorder].name = disorder
    screenStore[disorder].route = "./" + disorder + ".html"
    screenStore[disorder].completed = false
    screenStore[disorder].values = {}
    screenStore[disorder].result = "X"
  })

  sessionStorage.setItem("screenStore", JSON.stringify({ screenStore }))
  return screenStore
}
