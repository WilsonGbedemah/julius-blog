import { useReadingProgress } from '../hooks/useReadingProgress'

export default function ReadingProgress() {
  const progress = useReadingProgress()

  return (
    <div
      className="progress-bar"
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  )
}
