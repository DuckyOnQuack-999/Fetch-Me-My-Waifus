import { DownloadProgress } from '../types/waifu'

export const calculateProgress = (downloaded: number, total: number): DownloadProgress => {
  const progress = downloaded / total
  const speed = downloaded / 10 // Assuming 10 seconds have passed, this is a simplification
  const remainingBytes = total - downloaded
  const eta = remainingBytes / speed

  return {
    total,
    downloaded,
    speed,
    eta
  }
}
