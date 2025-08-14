import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import crypto from 'crypto'
import useRotatingCode from './useRotatingCode'

describe('useRotatingCode', () => {
  it('rotates code and clears interval on unmount', () => {
    vi.useFakeTimers()
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval')
    const randomIntMock = vi
      .spyOn(crypto, 'randomInt')
      .mockReturnValueOnce(19000)
      .mockReturnValue(28000)

    const { result, unmount } = renderHook(() => useRotatingCode(1000))

    expect(result.current.currentCode).toBe('19000')

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.previousCode).toBe('19000')
    expect(result.current.currentCode).toBe('28000')

    unmount()
    expect(clearIntervalSpy).toHaveBeenCalled()

    randomIntMock.mockRestore()
    clearIntervalSpy.mockRestore()
    vi.useRealTimers()
  })
})
