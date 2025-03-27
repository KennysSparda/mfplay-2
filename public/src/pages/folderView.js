import MovieList from "../components/movieList.js"
import Button from "../components/button.js"
import { navigateTo } from "../router.js"

export default function FolderView() {
  const page = document.createElement("div")
  page.className = "folder-view"

  const params = decodeURIComponent(window.location.pathname.replace("/folder", "")) // Remove "/folder"
  console.log(params)
  // Container para o cabeçalho
  const header = document.createElement("div")
  header.className = "folder-header"

  const backButton = Button("⬅ Voltar", () => {
    const parts = params.split("/").filter(Boolean) // Divide caminho e remove vazios
    parts.pop() // Remove a última pasta
    
    let newPath = parts.length ? `/folder/${parts.join("/")}` : "/" 
  
    if (newPath === "/folder") newPath = "/" // 👈 Evita ficar preso em "/folder"
  
    navigateTo(newPath)
  }, "back-button")
  header.appendChild(backButton)

  const title = document.createElement("h2")
  title.className = "folder-title"
  title.textContent = params || "Biblioteca"
  header.appendChild(title)

  page.appendChild(header)

  // Container do conteúdo
  const content = document.createElement("div")
  content.className = "folder-content"
  page.appendChild(content)

  fetch("/api/videos")
    .then(res => res.json())
    .then(data => {
      console.log("Estrutura de pastas recebida:", data)

      const folderData = findFolder(data, params)

      if (folderData) {
        content.appendChild(MovieList(folderData.children))
      } else {
        console.error("❌ Caminho não encontrado:", params)
        content.innerHTML = "<p class='folder-error'>❌ Pasta não encontrada</p>"
      }
    })
    .catch(err => {
      console.error("Erro ao carregar pasta:", err)
      content.innerHTML = "<p class='folder-error'>❌ Erro ao carregar os arquivos</p>"
    })

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
