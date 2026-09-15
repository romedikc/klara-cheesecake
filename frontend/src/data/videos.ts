/**
 * Placeholder lesson streams served from /public/lessons.
 * Replace with API/CDN URLs when the backend returns `videoUrl` per lesson.
 */
const SAMPLE_VIDEOS = ['/lessons/sintel.mp4', '/lessons/flower.mp4'] as const

export function videoForLesson(lessonId: string): string {
  let hash = 0
  for (let i = 0; i < lessonId.length; i += 1) {
    hash = (hash + lessonId.charCodeAt(i) * (i + 1)) % SAMPLE_VIDEOS.length
  }
  return SAMPLE_VIDEOS[hash]
}
