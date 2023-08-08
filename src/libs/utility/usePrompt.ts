import { History, Transition } from 'history'
import { useCallback, useContext, useEffect } from "react"
import { Navigator } from 'react-router'
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom"

type ExtendNavigator = Navigator & Pick<History, "block">

export function useBlocker(blocker: (tx: Transition) => void, when = true) {
  const { navigator } = useContext(NavigationContext)

  useEffect((): () => void => {
    if (!when) return () => { }

    const unblock = (navigator as ExtendNavigator).block((tx) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          unblock()
          tx.retry()
        },
      }

      blocker(autoUnblockingTx)
    })

    return unblock
  }, [navigator, blocker, when])
}

export default function usePrompt(message: string, when = true) {
  const blocker = useCallback((tx: Transition) => {
    if (window.confirm(message)) tx.retry() // eslint-disable-line no-alert
  }, [message])

  useBlocker(blocker, when)
}