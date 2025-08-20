import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import useRotatingCode from './useRotatingCode'

describe('useRotatingCode', () => {
  it('rotates code and clears interval on unmount', () => {
    vi.useFakeTimers()
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval')
    const getRandomValuesMock = vi
      .spyOn(globalThis.crypto, 'getRandomValues')
      .mockImplementationOnce((arr) => {
        arr[0] = 9000
        return arr
      })
      .mockImplementation((arr) => {
        arr[0] = 18000
        return arr
      })

    const { result, unmount } = renderHook(() => useRotatingCode(1000))

    expect(result.current.currentCode).toBe('19000')

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.previousCode).toBe('19000')
    expect(result.current.currentCode).toBe('28000')

    unmount()
    expect(clearIntervalSpy).toHaveBeenCalled()

    getRandomValuesMock.mockRestore()
    clearIntervalSpy.mockRestore()
    vi.useRealTimers()
  })
})
