const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors')

const app = express()
app.use(cors())
const PORT = 3000

const VIDEOS_DIR = path.resolve('D:/Filmes, Desenhos e Séries')

// Serve os arquivos do frontend
app.use(express.static(path.join(__dirname, 'public')))

// Função que escaneia pastas
const scanDirectory = (dir, relativePath = '') => {
  const folderName = path.basename(dir)
  const folderUrl = '/folder/' + (relativePath ? relativePath.split(path.sep).map(encodeURIComponent).join('/') : '')

  let node = { name: folderName, type: 'folder', path: relativePath, url: folderUrl, children: [] }

  const items = fs.readdirSync(dir)
  items.forEach(item => {
    const fullPath = path.join(dir, item)
    const itemRelativePath = path.join(relativePath, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      node.children.push(scanDirectory(fullPath, itemRelativePath))
    } else if (item.match(/\.(mp4|mkv|avi|mov)$/i)) {
      const videoUrl = '/video/' + itemRelativePath.split(path.sep).map(encodeURIComponent).join('/')
      let coverUrl = null
      const possibleCoverExts = ['.jpg', '.jpeg', '.png']
      const baseName = path.parse(item).name

      for (const ext of possibleCoverExts) {
        const coverFile = path.join(dir, baseName + ext)
        if (fs.existsSync(coverFile)) {
          const coverRelativePath = path.join(relativePath, baseName + ext)
          coverUrl = '/cover/' + coverRelativePath.split(path.sep).map(encodeURIComponent).join('/')
          break
        }
      }

      node.children.push({ name: item, type: 'video', path: itemRelativePath, url: videoUrl, cover: coverUrl })
    }
  })
  return node
}

// API para listar os vídeos e pastas
app.get('/api/videos', (req, res) => {
  if (!fs.existsSync(VIDEOS_DIR)) {
    return res.status(404).json({ error: 'Diretório de vídeos não encontrado' })
  }
  res.json(scanDirectory(VIDEOS_DIR))
})

// Streaming de vídeos
app.get('/video/*', (req, res) => {
  const videoRelativePath = req.params[0]
  const videoPath = path.join(VIDEOS_DIR, videoRelativePath)

  if (!fs.existsSync(videoPath)) return res.sendStatus(404)

  fs.stat(videoPath, (err, stats) => {
    if (err) return res.sendStatus(500)

    const mimeTypes = { '.mp4': 'video/mp4', '.mkv': 'video/x-matroska', '.avi': 'video/x-msvideo', '.mov': 'video/quicktime' }
    const ext = path.extname(videoPath).toLowerCase()
    const contentType = mimeTypes[ext] || 'application/octet-stream'

    let range = req.headers.range
    if (!range) {
      res.writeHead(200, { 'Content-Length': stats.size, 'Content-Type': contentType })
      return fs.createReadStream(videoPath).pipe(res)
    }

    const parts = range.replace(/bytes=/, '').split('-')
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1
    const chunkSize = (end - start) + 1

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${stats.size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': contentType
    })

    fs.createReadStream(videoPath, { start, end }).pipe(res)
  })
})

// Servir imagens de capa
app.get('/cover/*', (req, res) => {
  const coverPath = path.join(VIDEOS_DIR, req.params[0])
  if (!fs.existsSync(coverPath)) return res.sendStatus(404)
  res.sendFile(coverPath)
})

// Servir o index.html para qualquer outra rota (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})
