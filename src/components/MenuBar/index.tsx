import React, {
  ReactElement, useState, useEffect,
} from 'react'
import PropTypes from 'prop-types'

import './MenuBar.scss'

import { menuCloseEvent } from './const'
import MenuTopElement, { MenuItem, MenuItemProps } from './MenuTopElement'
import PolyEvent from '../../polyfill/Event'

export interface MenuProps {
  /**
   * The menu items
   */
  elements: MenuItem[]
}

/**
 * MenuBar
 * The menu entrypoint. It requires the menu structure as a prop.
 * @param props the props to build the menu
 */
const MenuBar: React.FunctionComponent<MenuProps> = (props: MenuProps): ReactElement => {
  const { elements } = props
  const [currentMenuIndex, setCurrentMenuIndex] = useState<number>(-1)

  useEffect(() => {
    const onMenuClose = (): void => {
      setCurrentMenuIndex(-1)
    }

    const onDocClick = (event: MouseEvent): void => {
      const target = event.target as HTMLElement
      if (!target.closest('.MenuItem')) {
        setCurrentMenuIndex(-1)
      }
    }

    const onDocKeyDown = (event: KeyboardEvent): void => {
      // Not escape
      if (event.keyCode !== 27 || currentMenuIndex === -1) {
        return
      }

      document.dispatchEvent(PolyEvent(menuCloseEvent))
    }

    document.addEventListener(menuCloseEvent, onMenuClose as EventListener)
    document.addEventListener('click', onDocClick)
    document.addEventListener('keydown', onDocKeyDown)

    return (): void => {
      document.removeEventListener(menuCloseEvent, onMenuClose as EventListener)
      document.removeEventListener('click', onDocClick)
      document.removeEventListener('keydown', onDocKeyDown)
    }
  }, [currentMenuIndex])

  const changeMenuIndex = (index: number): void => {
    if (currentMenuIndex === index) {
      return
    }

    setCurrentMenuIndex(index)
  }

  return (
    <div className="MenuBar">
      {elements.map((item, index) => (
        <MenuTopElement
          key={item.name}
          menu={item}
          tabIndex={index}
          currentMenuIndex={currentMenuIndex}
          changeMenuIndex={changeMenuIndex}
        />
      ))}
    </div>
  )
}

// eslint-disable-next-line
// @ts-ignore
MenuBar.propTypes = {
  // eslint-disable-next-line
  elements: PropTypes.arrayOf(MenuItemProps).isRequired,
  // @tts-ignore
  // elements: PropTypes.arrayOf(PropTypes.shape(MenuItemProps)).isRequired,
}

export default MenuBar
