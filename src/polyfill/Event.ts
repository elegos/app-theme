const PolyEvent = (
  typeArg: string,
  eventInitDict?: EventInit,
): Event => {
  try {
    return new Event(typeArg, eventInitDict)
  } catch (_) {
    const params = eventInitDict || { bubbles: false, cancelable: false }
    const event = document.createEvent('Event')
    event.initEvent(typeArg, params.bubbles, params.cancelable)

    return event
  }
}

export default PolyEvent
