import { useEffect } from 'react'

/** Sets the title of the browser tab for the page being shown. */
export function useTitle(title) {
  useEffect(() => {
    document.title = title
  }, [title])
}
