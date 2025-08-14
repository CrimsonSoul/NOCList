import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const electronStub = {
  app: { isPackaged: false },
  BrowserWindow: class {},
  ipcMain: { on: vi.fn(), handle: vi.fn() },
  shell: { openExternal: vi.fn(), openPath: vi.fn() },
}
require.cache[require.resolve('electron')] = { exports: electronStub }

const main = require('./main')

let handlerMap
let fakeWatcher

beforeEach(() => {
  handlerMap = {}
  fakeWatcher = {
    on: (event, handler) => {
      handlerMap[event] = handler
    },
  }
  vi.useFakeTimers()
})

describe('watchExcelFiles debounce', () => {
  it('debounces change events', () => {
    const sendSpy = vi.fn()
    main.__setWin({ webContents: { send: sendSpy } })

    main.watchExcelFiles(fakeWatcher)
    handlerMap.change('file1')
    handlerMap.change('file2')
    handlerMap.change('file3')

    vi.advanceTimersByTime(300)

    expect(sendSpy).toHaveBeenCalledTimes(1)
  })

  it('debounces unlink events', () => {
    const sendSpy = vi.fn()
    main.__setWin({ webContents: { send: sendSpy } })

    main.watchExcelFiles(fakeWatcher)
    handlerMap.unlink('file1')
    handlerMap.unlink('file2')
    handlerMap.unlink('file3')

    vi.advanceTimersByTime(300)

    expect(sendSpy).toHaveBeenCalledTimes(1)
  })
})

describe('safeOpenExternalLink', () => {
  it('allows http and https URLs', async () => {
    electronStub.shell.openExternal.mockClear()

    await main.__testables.safeOpenExternalLink('https://example.com')
    await main.__testables.safeOpenExternalLink('http://example.com')

    expect(electronStub.shell.openExternal).toHaveBeenCalledTimes(2)
  })

  it('blocks other protocols and invalid URLs', async () => {
    electronStub.shell.openExternal.mockClear()
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    await main.__testables.safeOpenExternalLink('file:///etc/passwd')
    await main.__testables.safeOpenExternalLink('notaurl')

    expect(electronStub.shell.openExternal).not.toHaveBeenCalled()
    expect(errorSpy).toHaveBeenCalledTimes(2)
    errorSpy.mockRestore()
  })
})
