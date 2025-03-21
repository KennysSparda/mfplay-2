const backButton = Button("⬅ Voltar", () => {
  const parts = params.split("/").filter(Boolean) // Divide caminho e remove vazios
  parts.pop() // Remove a última pasta
  
  let newPath = parts.length ? `/folder/${parts.join("/")}` : "/" 

  if (newPath === "/folder") newPath = "/" // 👈 Evita ficar preso em "/folder"

  navigateTo(newPath)
}, "back-button")