export default function Progress(value, max, onInput, className = "") {
  const progress = document.createElement("input")
  progress.type = "range"
  progress.min = 0
  progress.max = max
  progress.value = value
  progress.className = className

  progress.addEventListener("input", (e) => {
    onInput(Number(e.target.value))
  })

  return progress
}
