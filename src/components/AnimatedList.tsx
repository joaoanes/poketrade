import React, { useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react'
import { FixedSizeList as List, ListOnScrollProps } from 'react-window'

type AnimatedListProps = {
  duration?: number;
  easing?: (delta: number) => number;
  onAnimationComplete?: () => void;
  itemSize: number;
} & React.ComponentProps<typeof List>

const defaultEasing = (delta: number) => delta

const AnimatedList = forwardRef(({ 
  duration = 1000, 
  easing = defaultEasing, 
  onAnimationComplete = () => {}, 
  itemSize, 
  ...props 
}: AnimatedListProps, ref) => {
  const listRef = useRef<List>(null)
  const animationRef = useRef<number | null>(null)
  const scrollOffsetRef = useRef(0)
  const targetScrollOffsetRef = useRef<number | null>(null)
  const animationStartTimeRef = useRef<number | null>(null)

  const _animate = useCallback(() => {
    if (animationStartTimeRef.current === null || targetScrollOffsetRef.current === null) return

    animationRef.current = requestAnimationFrame(() => {
      const now = performance.now()
      const elapsed = now - animationStartTimeRef.current!
      const scrollDelta = targetScrollOffsetRef.current! - scrollOffsetRef.current
      const easedTime = easing(Math.min(1, elapsed / duration))
      const newScrollOffset = scrollOffsetRef.current + scrollDelta * easedTime

      listRef.current?.scrollTo(newScrollOffset)
      scrollOffsetRef.current = newScrollOffset

      if (elapsed < duration) {
        _animate()
      } else {
        animationStartTimeRef.current = null
        targetScrollOffsetRef.current = null
        onAnimationComplete()
      }
    })
  }, [duration, easing, onAnimationComplete])

  const animatedScrollTo = useCallback((index: number) => {
    if (animationStartTimeRef.current !== null) return
    targetScrollOffsetRef.current = index * itemSize
    animationStartTimeRef.current = performance.now()
    _animate()
  }, [_animate, itemSize])

  useImperativeHandle(ref, () => ({animatedScrollTo}), [animatedScrollTo])

  const onScroll = useCallback(({
    scrollOffset, scrollUpdateWasRequested, scrollDirection 
  }: ListOnScrollProps) => {

    props.onScroll ? props.onScroll({
      scrollDirection, scrollOffset, scrollUpdateWasRequested
    }) : null

    if (!scrollUpdateWasRequested) {
      scrollOffsetRef.current = scrollOffset
    }
  }, [props])

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <List
    
      itemSize={itemSize}
      {...props}
      onScroll={onScroll}
      ref={listRef}
    />
  )
})

AnimatedList.displayName = 'AnimatedList'
export default AnimatedList
