import MovieList from "../components/movieList.js"
import Button from "../components/button.js"
import { navigateTo } from "../router.js"

export default function FolderView() {
  const page = document.createElement("div")
  page.className = "folder-view"

  const params = decodeURIComponent(window.location.pathname.replace("/folder", "")) // Remove apenas "/folder"

  const backButton = Button("⬅ Voltar", () => navigateTo("/"), "back-button")
  page.appendChild(backButton)

  fetch(`http://26.64.225.16:3000/api/videos`)
    .then(res => res.json())
    .then(data => {
      console.log("Estrutura de pastas recebida:", data)

      const folderData = findFolder(data, params)

      if (folderData) {
        page.appendChild(MovieList(folderData.children))
      } else {
        console.error("❌ Caminho não encontrado:", params)
        page.innerHTML += "<p>❌ Pasta não encontrada</p>"
      }
    })
    .catch(err => console.error("Erro ao carregar pasta:", err))

  return page
}

// 🛠️ **Correção da função `findFolder`**
function findFolder(data, path) {
  if (decodeURIComponent(data.url) === path) return data // Agora verifica pelo `url`, que é o que usamos para navegar

  if (data.children) {
    for (const child of data.children) {
      const found = findFolder(child, path)
      if (found) return found
    }
  }

  return null
}
