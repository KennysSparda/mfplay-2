export default function Video(url) {
  const Video = document.createElement('video')
  Video.height = window.innerHeight / 1.2
  Video.width = window.innerWidth / 1.2
  Video.src = url

  return Video
}