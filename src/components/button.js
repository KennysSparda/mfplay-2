export default function Button(text, action) {
  const Button = document.createElement('button')
  Button.innerHTML = text

  return Button
}