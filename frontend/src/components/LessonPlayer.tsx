import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatTimecode } from '../lib/format'
import { btn } from '../lib/ui'

interface LessonPlayerProps {
  src: string
  poster: string
  title: string
  nextHref?: string
  nextTitle?: string
}

export default function LessonPlayer({
  src,
  poster,
  title,
  nextHref,
  nextTitle,
}: LessonPlayerProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const hideTimer = useRef<number | undefined>(undefined)

  const [playing, setPlaying] = useState(false)
  const [ended, setEnded] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [muted, setMuted] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [controlsOn, setControlsOn] = useState(true)
  const [waiting, setWaiting] = useState(false)
  const [error, setError] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [started, setStarted] = useState(false)

  const progress = duration > 0 ? current / duration : 0
  const showChrome = !playing || hovering || controlsOn || ended || !started

  const showControlsTemporarily = useCallback(() => {
    setControlsOn(true)
    window.clearTimeout(hideTimer.current)
    hideTimer.current = window.setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setControlsOn(false)
    }, 2200)
  }, [])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      void video.play()
    } else {
      video.pause()
    }
  }, [])

  const seekToRatio = useCallback((ratio: number) => {
    const video = videoRef.current
    if (!video || !Number.isFinite(video.duration)) return
    video.currentTime = Math.min(1, Math.max(0, ratio)) * video.duration
    setEnded(false)
  }, [])

  const onBarPointer = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const bar = barRef.current
      if (!bar) return
      bar.setPointerCapture(event.pointerId)
      const rect = bar.getBoundingClientRect()
      seekToRatio((event.clientX - rect.left) / rect.width)
    },
    [seekToRatio],
  )

  const onBarMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.buttons !== 1) return
      const bar = barRef.current
      if (!bar) return
      const rect = bar.getBoundingClientRect()
      seekToRatio((event.clientX - rect.left) / rect.width)
    },
    [seekToRatio],
  )

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onPlay = () => {
      setPlaying(true)
      setEnded(false)
      setStarted(true)
      setError(false)
    }
    const onPause = () => setPlaying(false)
    const onTime = () => setCurrent(video.currentTime)
    const onMeta = () => setDuration(video.duration || 0)
    const onWait = () => setWaiting(true)
    const onPlaying = () => setWaiting(false)
    const onEnd = () => {
      setPlaying(false)
      setEnded(true)
      setControlsOn(true)
    }
    const onErr = () => {
      setError(true)
      setWaiting(false)
      setPlaying(false)
    }
    const onProgress = () => {
      if (!video.buffered.length) return
      setBuffered(video.buffered.end(video.buffered.length - 1) / (video.duration || 1))
    }

    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    video.addEventListener('timeupdate', onTime)
    video.addEventListener('loadedmetadata', onMeta)
    video.addEventListener('durationchange', onMeta)
    video.addEventListener('waiting', onWait)
    video.addEventListener('playing', onPlaying)
    video.addEventListener('ended', onEnd)
    video.addEventListener('error', onErr)
    video.addEventListener('progress', onProgress)

    return () => {
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('timeupdate', onTime)
      video.removeEventListener('loadedmetadata', onMeta)
      video.removeEventListener('durationchange', onMeta)
      video.removeEventListener('waiting', onWait)
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('ended', onEnd)
      video.removeEventListener('error', onErr)
      video.removeEventListener('progress', onProgress)
    }
  }, [src])

  useEffect(() => {
    const onFs = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  useEffect(() => {
    const node = wrapRef.current
    if (!node) return
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (event.code === 'Space' || event.key === 'k') {
        event.preventDefault()
        togglePlay()
        showControlsTemporarily()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        const video = videoRef.current
        if (video) video.currentTime = Math.min(video.duration || 0, video.currentTime + 5)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        const video = videoRef.current
        if (video) video.currentTime = Math.max(0, video.currentTime - 5)
      } else if (event.key === 'f') {
        event.preventDefault()
        void toggleFullscreen()
      } else if (event.key === 'm') {
        event.preventDefault()
        toggleMute()
      }
    }
    node.addEventListener('keydown', onKey)
    return () => node.removeEventListener('keydown', onKey)
  }, [togglePlay, showControlsTemporarily])

  useEffect(() => () => window.clearTimeout(hideTimer.current), [])

  function toggleMute() {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
  }

  async function toggleFullscreen() {
    const node = wrapRef.current
    if (!node) return
    if (document.fullscreenElement) {
      await document.exitFullscreen()
    } else {
      await node.requestFullscreen()
    }
  }

  function cycleSpeed() {
    const next = speed === 1 ? 1.25 : speed === 1.25 ? 1.5 : speed === 1.5 ? 2 : 1
    const video = videoRef.current
    if (video) video.playbackRate = next
    setSpeed(next)
  }

  function replay() {
    const video = videoRef.current
    if (!video) return
    video.currentTime = 0
    setEnded(false)
    void video.play()
  }

  return (
    <div
      ref={wrapRef}
      tabIndex={0}
      className="relative aspect-video rounded-2xl overflow-hidden bg-ink outline-none group"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onMouseMove={showControlsTemporarily}
      onClick={() => wrapRef.current?.focus()}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={src}
        poster={poster}
        playsInline
        preload="metadata"
        onPlay={() => {
          setPlaying(true)
          setEnded(false)
          setStarted(true)
          setError(false)
        }}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(event) => setCurrent(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
        onWaiting={() => setWaiting(true)}
        onPlaying={() => setWaiting(false)}
        onEnded={() => {
          setPlaying(false)
          setEnded(true)
          setControlsOn(true)
        }}
        onError={() => {
          setError(true)
          setWaiting(false)
          setPlaying(false)
        }}
        onClick={(event) => {
          event.stopPropagation()
          togglePlay()
        }}
        onDoubleClick={(event) => {
          event.stopPropagation()
          void toggleFullscreen()
        }}
      />

      {!started && !playing && (
        <img
          src={poster}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-[0.82] pointer-events-none"
        />
      )}

      {waiting && !error && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="w-10 h-10 rounded-full border-[3px] border-white/30 border-t-accent animate-spin" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/80 px-6 text-center">
          <p className="text-white text-sm">Не удалось загрузить видео. Проверьте соединение и попробуйте ещё раз.</p>
          <button
            type="button"
            className={btn('solid')}
            onClick={() => {
              setError(false)
              videoRef.current?.load()
              void videoRef.current?.play()
            }}
          >
            Повторить
          </button>
        </div>
      )}

      {!error && (!playing || ended) && (
        <button
          type="button"
          className="absolute inset-0 flex items-center justify-center bg-transparent"
          onClick={(event) => {
            event.stopPropagation()
            if (ended) replay()
            else togglePlay()
          }}
          aria-label={ended ? 'Смотреть снова' : `Смотреть урок «${title}»`}
        >
          <span className="w-[84px] h-[84px] rounded-full bg-accent text-white text-[28px] flex items-center justify-center pl-1 shadow-[0_8px_30px_rgba(0,0,0,.25)] transition-transform duration-200 hover:scale-105">
            {ended ? '↺' : '▶'}
          </span>
        </button>
      )}

      {ended && nextHref && (
        <div className="absolute bottom-[58px] left-1/2 -translate-x-1/2 z-10">
          <Link to={nextHref} className={btn('light')} onClick={(e) => e.stopPropagation()}>
            Следующий урок{nextTitle ? `: ${nextTitle}` : ''} →
          </Link>
        </div>
      )}

      <div
        className={`absolute inset-x-0 bottom-0 px-5 pb-[18px] pt-16 bg-gradient-to-t from-ink/80 to-transparent transition-opacity duration-200 ${
          showChrome ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          ref={barRef}
          className="h-1.5 rounded-full bg-white/35 cursor-pointer mb-3 relative"
          onPointerDown={onBarPointer}
          onPointerMove={onBarMove}
          role="slider"
          aria-label="Прогресс урока"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(current)}
        >
          <i
            className="absolute inset-y-0 left-0 rounded-full bg-white/25"
            style={{ width: `${Math.min(100, buffered * 100)}%` }}
          />
          <i
            className="absolute inset-y-0 left-0 rounded-full bg-accent"
            style={{ width: `${Math.min(100, progress * 100)}%` }}
          />
          <span
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow"
            style={{ left: `calc(${Math.min(100, progress * 100)}% - 6px)` }}
          />
        </div>

        <div className="flex items-center gap-3 text-white text-xs font-semibold">
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center text-base"
            onClick={togglePlay}
            aria-label={playing ? 'Пауза' : 'Смотреть'}
          >
            {playing ? '❚❚' : '▶'}
          </button>
          <span className="tabular-nums tracking-wide">
            {formatTimecode(current)} / {formatTimecode(duration)}
          </span>
          <span className="flex-1" />
          <button
            type="button"
            className="px-2 h-8 rounded-full border border-white/25 hover:bg-white/10"
            onClick={cycleSpeed}
            aria-label="Скорость воспроизведения"
          >
            {speed}×
          </button>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center"
            onClick={toggleMute}
            aria-label={muted ? 'Включить звук' : 'Выключить звук'}
          >
            {muted ? '🔇' : '🔊'}
          </button>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center"
            onClick={() => void toggleFullscreen()}
            aria-label={fullscreen ? 'Выйти из полного экрана' : 'Полный экран'}
          >
            {fullscreen ? '↙' : '⛶'}
          </button>
        </div>
      </div>
    </div>
  )
}
