import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import MenuElement, { MenuElementDef, MenuElementProps } from '../MenuElement'
import {
  onGenericKeyDown,
  Direction,
  AllowedHDirection,
  AllowedVDirection,
  menuTopElementHorizontalEvent,
  MenuTopElementHorizontalDetail,
  menuTopElementSwitchEvent,
} from '../const'
import PolyEvent from '../../../polyfill/Event'

export interface MenuItem {
  /**
   * The display name
   */
  name: string
  /**
   * The menu's entries
   */
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
      const target = direction === Direction.Right ? myself.nextSibling : myself.previousSibling;

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

    if (tabIndex === currentMenuIndex) {
      changeMenuIndex(-1)

      return
    }

    selfRef.current.focus()
    changeMenuIndex(tabIndex)
  }

  const onMouseEnter = (): void => {
    if (currentMenuIndex === -1 || tabIndex === currentMenuIndex) {
      return
    }

    changeMenuIndex(tabIndex)
    const topParent = selfRef.current?.closest('.MenuBar')
    if (topParent) {
      topParent.dispatchEvent(PolyEvent(menuTopElementSwitchEvent))
    }
  }

  const onKeyDown = onGenericKeyDown(
    (direction: AllowedHDirection) => {
      if (document.activeElement !== selfRef.current) {
        return
      }

      const htmlElement = selfRef.current as unknown as HTMLDivElement

      const sibling = direction === Direction.Right ? htmlElement.nextSibling : htmlElement.previousSibling
      if (!sibling) {
        return
      }

      (sibling as HTMLElement).focus()
      changeMenuIndex((sibling as HTMLElement).tabIndex)
    },
    (direction: AllowedVDirection) => {
      if (
        direction === Direction.Up
        || !selfRef.current
        || document.activeElement !== selfRef.current
      ) {
        return
      }

      const target = document.querySelector('.MenuItem.open .MenuElement') as HTMLElement

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

export const MenuItemProps = PropTypes.shape({
  name: PropTypes.string.isRequired,
  elements: PropTypes.arrayOf(MenuElementProps),
})

MenuTopElement.propTypes = {
  tabIndex: PropTypes.number.isRequired,
  currentMenuIndex: PropTypes.number.isRequired,
  menu: MenuItemProps.isRequired,
  changeMenuIndex: PropTypes.func.isRequired,
}

export default MenuTopElement
