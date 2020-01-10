import React, { useRef, useEffect } from 'react'
import classnames from 'classnames'

import MenuElement, { MenuElementDef } from '../MenuElement'
import {
  onGenericKeyDown,
  Direction,
  AllowedHDirection,
  AllowedVDirection,
  menuTopElementHorizontalEvent,
  MenuTopElementHorizontalDetail,
} from '../const'

export interface MenuItem {
  name: string
  elements?: MenuElementDef[]
}

interface MenuTopElementProps {
  tabIndex: number
  currentMenuIndex: number
  menu: MenuItem

  changeMenuIndex: (index: number) => void
}

const MenuTopElement: React.FunctionComponent<MenuTopElementProps> = (props: MenuTopElementProps) => {
  const {
    menu, tabIndex, changeMenuIndex, currentMenuIndex,
  } = props
  const selfRef = useRef<HTMLDivElement>(null)

  // Horizontal move from sub-element
  useEffect(() => {
    if (!selfRef.current) {
      return (): void => {}
    }

    const myself = selfRef.current

    const listener = (event: CustomEvent<MenuTopElementHorizontalDetail>): void => {
      const { direction } = event.detail
      let target = direction === Direction.Right ? myself.nextSibling : myself.previousSibling
      if (!target) {
        const parent = myself.parentElement
        if (parent) {
          target = (
            direction === Direction.Right
              ? parent.firstChild
              : parent.lastChild
          ) || null
        }
      }

      (target as HTMLElement)?.focus()
    }

    myself.addEventListener(menuTopElementHorizontalEvent, listener as EventListener)

    return (): void => {
      myself.removeEventListener(menuTopElementHorizontalEvent, listener as EventListener)
    }
  }, [selfRef])

  const onClick = (event: React.MouseEvent): void => {
    const target = event.target as HTMLElement
    if (
      target !== selfRef.current
      || !target.classList.contains('MenuItem')
    ) {
      return
    }

    selfRef.current.focus()
    changeMenuIndex(tabIndex)
  }

  const onMouseEnter = (): void => {
    if (currentMenuIndex === -1) {
      return
    }

    changeMenuIndex(tabIndex)
  }

  const onKeyDown = onGenericKeyDown(
    (direction: AllowedHDirection) => {
      if (document.activeElement !== selfRef.current) {
        return
      }

      const htmlElement = selfRef.current as unknown as HTMLDivElement

      let sibling = direction === Direction.Right ? htmlElement.nextSibling : htmlElement.previousSibling
      if (!sibling) {
        const { parentNode } = htmlElement
        sibling = (direction === Direction.Right ? parentNode?.firstChild : parentNode?.lastChild) || null
      }

      if (sibling) {
        (sibling as HTMLElement).focus()
        changeMenuIndex((sibling as HTMLElement).tabIndex)
      }
    },
    (direction: AllowedVDirection) => {
      if (document.activeElement !== selfRef.current) {
        return
      }

      const htmlElement = selfRef.current as unknown as HTMLDivElement
      const target = htmlElement.querySelector(`.MenuElement:${
        direction === Direction.Up ? 'last-child' : 'first-child'
      }`) as HTMLElement

      target?.focus()
    },
  )

  return (
    <div
      tabIndex={tabIndex}
      data-name={menu.name}
      className={classnames('MenuItem', { open: tabIndex === currentMenuIndex })}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onFocus={onMouseEnter}
      onKeyDown={onKeyDown}
      role="menu"
      ref={selfRef}
    >
      {menu.name}
      <div className={classnames('MenuElements', { open: tabIndex === currentMenuIndex })}>
        {menu.elements?.map((element, elementIndex) => (
          <MenuElement
            key={element.name}
            tabIndex={elementIndex}
            element={element}
            parentPath={menu.name}
          />
        ))}
      </div>
    </div>
  )
}

export default MenuTopElement
