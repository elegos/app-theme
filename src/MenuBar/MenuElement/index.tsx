import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { MdKeyboardArrowRight, MdCheck } from 'react-icons/md'

import {
  menuCloseEvent,
  menuElementMouseEnterEvent,
  MenuElementMouseEnterDetail,
  onGenericKeyDown,
  Direction,
  AllowedVDirection,
  AllowedHDirection,
  menuTopElementHorizontalEvent,
} from '../const'
import PolyCustomEvent from '../../polyfill/CustomEvent'

export interface MenuElementDef {
  /**
   * The element's name. Must be unique per menu.
   */
  name: string
  /**
   * The element's sub-elements
   */
  subElements?: MenuElementDef[]
  /**
   * Whether a tick should appear on the left (switch element)
   */
  isChecked?: boolean
  /**
   * Arbitrary text to be placed to the right of the element's text
   */
  postText?: string
  /**
   * If the element is a separator. If true, it won't render
   * eventual subElements nor show the tick on the left
   * or the text on the right
   */
  isSeparator?: boolean

  /**
   * If it returns true, it will prevent the menu to close
   * upon pressing [enter] or clicking on the element
   */
  onClick?: (event: React.MouseEvent | React.KeyboardEvent) => boolean|void
}

interface MenuElementProps {
  element: MenuElementDef
  parentPath: string
  tabIndex?: number

  // see MenuElementDef.onClick
  onClick?: (event: React.MouseEvent | React.KeyboardEvent) => boolean|void
}

const checkElementNotContainedBy = (elem: HTMLElement, container: HTMLElement|null): boolean => {
  if (!container) {
    return false
  }

  if (elem === container) {
    return true
  }

  const parent = elem.parentElement

  return !parent ? false : checkElementNotContainedBy(parent, container)
}

const MenuElement: React.FunctionComponent<MenuElementProps> = (props: MenuElementProps) => {
  const {
    onClick: onOuterClick, element, parentPath, tabIndex,
  } = props
  const { onClick, isSeparator } = element
  const [isOpen, setOpen] = useState<boolean>(false)
  const [closeTimeout, setCloseTimeout] = useState<number>(-1)
  const selfRef = useRef<HTMLDivElement>(null)
  const ownPath = `${parentPath}.${element.name}`

  useEffect((): () => void => {
    const menuCloseListener = (): void => {
      setOpen(false)
    }

    const mouseEnterListener = (event: CustomEvent<MenuElementMouseEnterDetail>): void => {
      if (!isOpen || !element.subElements?.length) {
        return
      }

      if (!event.detail.path.startsWith(ownPath)) {
        clearTimeout(closeTimeout)
        setOpen(false)

        return
      }

      clearTimeout(closeTimeout)
      setOpen(true)
    }

    document.addEventListener(menuCloseEvent, menuCloseListener as EventListener)
    document.addEventListener(menuElementMouseEnterEvent, mouseEnterListener as EventListener)

    return (): void => {
      document.removeEventListener(menuCloseEvent, menuCloseListener as EventListener)
      document.removeEventListener(menuElementMouseEnterEvent, mouseEnterListener as EventListener)
    }
  }, [closeTimeout, element.subElements, isOpen, ownPath])

  const onClickWrapper = (event: React.MouseEvent | React.KeyboardEvent): void => {
    let keepOpen: boolean|void

    if (onOuterClick) {
      keepOpen = onOuterClick(event)
    }

    if (!element.subElements?.length && onClick) {
      const onClickResult = onClick(event)
      keepOpen = keepOpen || onClickResult
    }

    if (!keepOpen) {
      document.dispatchEvent(PolyCustomEvent(menuCloseEvent, {}))
    }

    event.stopPropagation()
  }

  const onMouseEnter = (event: React.MouseEvent | React.FocusEvent): void => {
    event.stopPropagation()

    if (selfRef.current && document.activeElement !== selfRef.current) {
      selfRef.current.focus()
      return
    }

    if (element.subElements && element.subElements.length) {
      document.dispatchEvent(PolyCustomEvent(
        menuElementMouseEnterEvent,
        { detail: { path: ownPath } },
      ))
    }

    clearTimeout(closeTimeout)
    if (isOpen) {
      return
    }
    setOpen(true)
  }

  const onMouseLeave = (event: React.MouseEvent | React.FocusEvent): void => {
    if (!isOpen) {
      clearTimeout(closeTimeout)
      return
    }

    const relatedTarget: Element|null = event.relatedTarget as Element
    const isStillSelf = relatedTarget
      && (
        (
          relatedTarget.closest
          && relatedTarget.closest('MenuElement') === selfRef.current
        ) || checkElementNotContainedBy(relatedTarget as HTMLElement, selfRef.current as HTMLElement)
      )

    if (!isStillSelf) {
      clearTimeout(closeTimeout)
      setCloseTimeout(setTimeout(() => setOpen(false), 750))
    }
  }

  const onKeyDownHorizontal = (direction: AllowedHDirection): void => {
    const parentMenuElement = selfRef.current?.parentElement?.closest('.MenuElement') as HTMLElement

    // not in a sub-menu and direction is left, or there is no sub-menu
    if (!parentMenuElement && (direction === Direction.Left || !element.subElements?.length)) {
      selfRef.current?.closest('.MenuItem')?.dispatchEvent(PolyCustomEvent(
        menuTopElementHorizontalEvent,
        { detail: { direction } },
      ))
      return
    }

    if (direction === Direction.Right) {
      const newFocus = selfRef.current?.querySelector('.MenuElements > .MenuElement');
      (newFocus as HTMLElement)?.focus()

      return
    }

    parentMenuElement?.focus()
  }

  const onKeyDownVertical = (direction: AllowedVDirection, currentElement: HTMLElement): void => {
    if (document.activeElement !== selfRef.current) {
      return
    }

    const parent = currentElement.parentElement
    let target: Node | null
    let cycleElement: Node | null = currentElement as Node
    do {
      target = direction === Direction.Up
        ? cycleElement.previousSibling
        : cycleElement.nextSibling
      cycleElement = target
    } while (
      cycleElement && (cycleElement as HTMLElement).classList.contains('Separator')
      && parent && parent.childNodes.length > 1
    )

    if (!target && direction === Direction.Up) {
      (selfRef.current?.closest('.MenuItem') as HTMLElement)?.focus()
      return
    }

    if (target) {
      (target as HTMLElement).focus()
    }
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter') {
      onClickWrapper(event)
      return
    }
    onGenericKeyDown(onKeyDownHorizontal, onKeyDownVertical)(event)
  }

  return isSeparator
    ? <hr className="Separator" />
    : (
      <div
        role="menuitem"
        tabIndex={tabIndex}
        ref={selfRef}
        className="MenuElement"
        onClick={onClickWrapper}
        onKeyDown={onKeyDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onMouseEnter}
        onBlur={onMouseLeave}
      >
        {element.isChecked && <MdCheck className="SubElementsPre" />}
        <span className="ElementText">{element.name}</span>
        {(element.subElements || []).length > 0 && <MdKeyboardArrowRight className="SubElementsPost" />}
        {
          element.subElements?.length === 0
          && element.postText
          && <div className="SubElementsPost text">{element.postText}</div>
        }
        <div className={classnames('MenuElements', 'side', { open: isOpen })}>
          {element.subElements?.map((elem, i) => (
            <MenuElement
              key={elem.name}
              parentPath={ownPath}
              element={elem}
              tabIndex={(tabIndex || 0) + 1 + i}
            />
          ))}
        </div>
      </div>
    )
}
export default MenuElement

const MenuElementProps = PropTypes.shape({
  name: PropTypes.string.isRequired,
  isChecked: PropTypes.bool,
  postText: PropTypes.string,
  isSeparator: PropTypes.bool,
  subElements: PropTypes.array,
  onClick: PropTypes.func,
})

// eslint-disable-next-line
// @ts-ignore
MenuElementProps.subElements = PropTypes.arrayOf(MenuElementProps)

export { MenuElementProps }
