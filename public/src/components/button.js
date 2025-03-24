// src/components/button.js
export default function Button(label, onClick, className = "") {
  const button = document.createElement("button")
  button.textContent = label
  button.className = className

  if (onClick) button.addEventListener("click", onClick)

  return button
}
