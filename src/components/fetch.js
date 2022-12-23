import { fetch as fetchPolyfill } from 'whatwg-fetch'

const originalFetch = window.fetch || fetchPolyfill

const fetch = (...args) => {
  return originalFetch(...args)
}

export default fetch
