const { spawn } = require('child_process')
const net = require('net')

/**
 * Wait until a TCP port becomes available.
 * @param {number} port - Port number to check.
 * @param {string} host - Hostname to connect to.
 * @param {number} [timeout=10000] - Maximum wait time in ms.
 * @param {number} [interval=500] - Retry interval in ms.
 */
function waitForPort(port, host, timeout = 10000, interval = 500) {
  return new Promise((resolve, reject) => {
    const endTime = Date.now() + timeout

    const attempt = () => {
      const socket = net.createConnection({ port, host })

      const onError = () => {
        socket.destroy()
        if (Date.now() > endTime) {
          reject(new Error(`Timed out waiting for port ${host}:${port}`))
        } else {
          setTimeout(attempt, interval)
        }
      }

      socket.setTimeout(1000, onError)
      socket.once('error', onError)
      socket.once('connect', () => {
        socket.end()
        resolve()
      })
    }

    attempt()
  })
}

/**
 * Launch the Vite dev server and, once ready, start Electron.
 */
async function startDev() {
  const vite = spawn('npx', ['vite'], { stdio: 'inherit', shell: true })

  const cleanup = () => {
    if (!vite.killed) vite.kill('SIGINT')
    if (electron && !electron.killed) electron.kill('SIGINT')
  }

  let electron

  vite.on('error', (err) => {
    console.error('Vite process error:', err)
    cleanup()
    process.exit(1)
  })

  try {
    await waitForPort(5173, 'localhost')

    electron = spawn('npx', ['electron', '.'], {
      stdio: 'inherit',
      shell: true,
    })

    electron.on('error', (err) => {
      console.error('Electron process error:', err)
      cleanup()
      process.exit(1)
    })

    electron.on('close', () => {
      cleanup()
      process.exit(0)
    })

    vite.on('close', () => {
      cleanup()
      process.exit(0)
    })

    process.on('SIGINT', () => {
      cleanup()
      process.exit(0)
    })
  } catch (err) {
    console.error('❌ Failed to detect Vite dev server:', err.message)
    cleanup()
    process.exit(1)
  }
}

if (require.main === module) {
  startDev()
}

module.exports = { startDev }

