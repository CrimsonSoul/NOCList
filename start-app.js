const { spawn } = require('child_process')
const net = require('net')

const vite = spawn('npx', ['vite'], {
  stdio: 'inherit',
  shell: true
})

function waitForPort(port, host, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    function check() {
      const socket = new net.Socket()
      socket.setTimeout(1000)
      socket.once('connect', () => {
        socket.destroy()
        resolve()
      })
      socket.once('timeout', () => {
        socket.destroy()
        retry()
      })
      socket.once('error', () => {
        socket.destroy()
        retry()
      })
      socket.connect(port, host)
    }
    function retry() {
      if (Date.now() - startTime > timeout) {
        reject(new Error('Timed out waiting for port'))
      } else {
        setTimeout(check, 500)
      }
    }
    check()
  })
}

waitForPort(5173, 'localhost')
  .then(() => {
    const electron = spawn('npx', ['electron', '.'], {
      stdio: 'inherit',
      shell: true
    })
    electron.on('close', () => vite.kill('SIGINT'))
  })
  .catch(err => {
    console.error('❌ Failed to detect Vite dev server:', err.message)
    vite.kill('SIGINT')
    process.exit(1)
  })
