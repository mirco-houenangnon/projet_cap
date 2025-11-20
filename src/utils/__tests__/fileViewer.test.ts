import { describe, it, expect, vi, beforeEach } from 'vitest'
import { openFileInNewTab } from '../fileViewer'

global.fetch = vi.fn()
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
global.URL.revokeObjectURL = vi.fn()

describe('fileViewer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.open = vi.fn()
  })

  describe('openFileInNewTab', () => {
    it('opens file in new tab with authentication', async () => {
      const mockBlob = new Blob(['test'], { type: 'application/pdf' })
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      } as Response)

      localStorage.setItem('token', 'test-token')

      await openFileInNewTab('http://example.com/file.pdf')

      expect(fetch).toHaveBeenCalledWith(
        'http://example.com/file.pdf',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      )
      expect(window.open).toHaveBeenCalledWith('blob:mock-url', '_blank')
    })

    it('handles fetch errors', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
      } as Response)

      console.error = vi.fn()

      await openFileInNewTab('http://example.com/file.pdf')

      expect(console.error).toHaveBeenCalled()
    })
  })
})
