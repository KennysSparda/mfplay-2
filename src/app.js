// src/app.js

import Button from "./components/button.js"
import Video from "./components/video.js"

export default function App() {
  const App = document.createElement('bo')
  App.textContent = "App"
  App.append(Button("Aperte aqui"))
 
  const videoUrl = " mkv\\Naruto Classico\\Naruto Classico 01.mkv"
  const video = Video(videoUrl)

  App.append(video)
  return App
}