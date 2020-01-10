const PolyCustomEvent = <T = any>(
  typeArg: string,
  eventInitDict: CustomEventInit<T> | undefined
): CustomEvent<T> => {
  try {
    return new CustomEvent(typeArg, eventInitDict)
  } catch (_) {
    const params = eventInitDict || { bubbles: false, cancelable: false, detail: null }
    const event = document.createEvent('CustomEvent')
    event.initCustomEvent(typeArg, params.bubbles || false, params.cancelable || false, params.detail)

    return event
  }
}

export default PolyCustomEvent
