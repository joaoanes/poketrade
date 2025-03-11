import React, {forwardRef,
  useRef,
  useImperativeHandle,
  useCallback,
  useEffect} from 'react'
import { FixedSizeList as List, ListOnScrollProps } from 'react-window'
import { debounce } from 'lodash'
  
  type AnimatedListProps = {
    itemSize: number
    duration?: number

    easing?: (progress: number) => number
    onAnimationComplete?: (index: number) => void
  } & React.ComponentProps<typeof List>
  

const defaultEasing = (t: number) => 1 - Math.pow(1 - t, 3)
  
const AnimatedList = forwardRef(({
  itemSize,
  duration = 200,
  easing = defaultEasing,
  onAnimationComplete = () => {},
  onScroll: parentOnScroll,
  ...restProps
}: AnimatedListProps, ref) => {
  const listRef = useRef<List>(null)
  const scrollOffsetRef = useRef(0)
  const animationFrameRef = useRef<number | null>(null)
  const isAnimatingRef = useRef(false)
  const startTimeRef = useRef<number | null>(null)
  const startOffsetRef = useRef(0)
  const targetOffsetRef = useRef(0)
  
  const cancelAnimation = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    isAnimatingRef.current = false
    startTimeRef.current = null
  }, [])
  
  const animateStep = useCallback((timestamp: number) => {
    if (startTimeRef.current === null) {
      startTimeRef.current = timestamp
    }
    const elapsed = timestamp - startTimeRef.current
    const progress = Math.min(1, elapsed / duration)
    const eased = easing(progress)
  
    const distance = targetOffsetRef.current - startOffsetRef.current
    const newOffset = startOffsetRef.current + distance * eased
  
    scrollOffsetRef.current = newOffset
    listRef.current?.scrollTo(newOffset)
  
    if (progress < 1) {
      animationFrameRef.current = requestAnimationFrame(animateStep)
    } else {

      listRef.current?.scrollTo(targetOffsetRef.current)
      scrollOffsetRef.current = targetOffsetRef.current
      cancelAnimation()
      const index = Math.round(scrollOffsetRef.current / itemSize)
      onAnimationComplete(index)
    }
  }, [duration, easing, onAnimationComplete, cancelAnimation])
  
  const animatedScrollTo = useCallback((index: number) => {
    cancelAnimation()
    isAnimatingRef.current = true
    startTimeRef.current = null
    startOffsetRef.current = scrollOffsetRef.current
    targetOffsetRef.current = index * itemSize
    animationFrameRef.current = requestAnimationFrame(animateStep)
  }, [cancelAnimation, animateStep, itemSize])
  
  useImperativeHandle(ref, () => ({ animatedScrollTo }), [animatedScrollTo])
  
  const snapToNearestItem = useCallback(() => {
    if (!isAnimatingRef.current) {
      const index = Math.round(scrollOffsetRef.current / itemSize)
      animatedScrollTo(index)
    }
  }, [animatedScrollTo, itemSize])
  
  const debouncedSnap = useRef(debounce(snapToNearestItem, 200)).current
  
  const onScroll = useCallback((params: ListOnScrollProps) => {
    if (!params.scrollUpdateWasRequested && isAnimatingRef.current) {
      cancelAnimation()
    }
  
    if (parentOnScroll) parentOnScroll(params)
  
    scrollOffsetRef.current = params.scrollOffset
  
    debouncedSnap()
  }, [parentOnScroll, cancelAnimation, debouncedSnap])
  
  useEffect(() => {
    return () => {
      cancelAnimation()
      debouncedSnap.cancel()
    }
  }, [cancelAnimation, debouncedSnap])
  
  return (
    <List
      ref={listRef}
      onScroll={onScroll}
      overscanCount={3}
      itemSize={itemSize}
      {...restProps}
    />
  )
})
  
AnimatedList.displayName = 'AnimatedList'
export default React.memo(AnimatedList)
  