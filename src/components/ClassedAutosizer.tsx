import React from "react"
import { AutoSizer } from "react-virtualized"
import layout from '../styles/layout.module.css'

type AutoSizerProps = React.ComponentProps<typeof AutoSizer>

export const ClassedAutoSizer = (props: AutoSizerProps) => {
  return (
    <AutoSizer
      {...props}
      className={layout.autosizer}
    />
  )
}