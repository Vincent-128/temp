export const getId = (() => {
  let defaultSize = 10
  let alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  let mask = (2 << (Math.log(alphabet.length - 1) / Math.LN2)) - 1
  let step = -~((1.6 * mask * defaultSize) / alphabet.length)
  return () => {
    let id = ''
    while (true) {
      let bytes = crypto.getRandomValues(new Uint8Array(step))
      let j = step
      while (j--) {
        id += alphabet[bytes[j] & mask] || ''
        if (id.length === defaultSize) return id
      }
    }
  }
})()

export const debounce = (callback, wait) => {
  let timeoutId = null
  return (...args) => {
    window.clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => {
      callback(...args)
    }, wait)
  }
}
