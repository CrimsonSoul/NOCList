import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import useRotatingCode from './useRotatingCode'

describe('useRotatingCode', () => {
  it('rotates code and clears interval on unmount', () => {
    vi.useFakeTimers()
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval')
    const randomMock = vi
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.1)
      .mockReturnValue(0.2)

    const { result, unmount } = renderHook(() => useRotatingCode(1000))

    expect(result.current.currentCode).toBe('19000')

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.previousCode).toBe('19000')
    expect(result.current.currentCode).toBe('28000')

    unmount()
    expect(clearIntervalSpy).toHaveBeenCalled()

    randomMock.mockRestore()
    clearIntervalSpy.mockRestore()
    vi.useRealTimers()
  })
})
