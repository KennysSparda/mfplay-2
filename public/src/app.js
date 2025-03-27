import { Router } from "./router.js"

document.body.innerHTML = "<div id='app'></div>"

const initialPath = window.INITIAL_PATH || window.location.pathname
Router(initialPath)
