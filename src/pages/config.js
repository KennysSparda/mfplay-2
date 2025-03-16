// src/pages/config.js
import { navigateTo } from "../router.js"

export default function Config() {
  const config = document.createElement("div")
  config.innerHTML = "<h1>Configurações</h1>"

  const backButton = document.createElement("button")
  backButton.textContent = "Voltar"
  backButton.addEventListener("click", () => navigateTo("/"))

  config.appendChild(backButton)
  return config
}
