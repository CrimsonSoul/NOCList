const { spawn } = require('child_process');
const net = require('net');

/**
 * Wait until a TCP port becomes available.
 * @param {Object} options
 * @param {number} options.port - Port number to check.
 * @param {string} [options.host='localhost'] - Hostname to connect to.
 * @param {number} [options.timeout=10000] - Maximum wait time in ms.
 * @param {number} [options.interval=500] - Retry interval in ms.
 */
function waitForPort({
  port,
  host = 'localhost',
  timeout = 10000,
  interval = 500,
}) {
  return new Promise((resolve, reject) => {
    const endTime = Date.now() + timeout;

    const attempt = () => {
      const socket = net.createConnection({ port, host });

      const onError = () => {
        socket.destroy();
        if (Date.now() > endTime) {
          reject(new Error(`Timed out waiting for port ${host}:${port}`));
        } else {
          setTimeout(attempt, interval);
        }
      };

      socket.setTimeout(1000, onError);
      socket.once('error', onError);
      socket.once('connect', () => {
        socket.end();
        resolve();
      });
    };

    attempt();
  });
}

async function start() {
  const vite = spawn('npx', ['vite'], { stdio: 'inherit', shell: true });

  try {
    await waitForPort({ port: 5173 });

    const electron = spawn('npx', ['electron', '.'], {
      stdio: 'inherit',
      shell: true,
    });

    const shutdown = () => {
      if (!vite.killed) vite.kill('SIGINT');
    };

    electron.on('close', shutdown);
    process.on('SIGINT', () => {
      electron.kill('SIGINT');
      shutdown();
    });
  } catch (err) {
    console.error(`❌ Failed to detect Vite dev server: ${err.message}`);
    vite.kill('SIGINT');
    process.exit(1);
  }
}

start();
