// src/app.js
import Button from "./components/button.js"
import Video from "./components/video.js"

export default function App() {
  const app = document.createElement("div")

  const button = Button("Aperte aqui")
  const video = Video("mkv/Naruto Classico/Naruto Classico 01.mkv")

  app.append(button, video)

  return app
}
