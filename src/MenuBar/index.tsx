import React, {
  ReactElement, useState, useEffect,
} from 'react'
import PropTypes from 'prop-types'

import './MenuBar.scss'

import { menuCloseEvent } from './const'
import MenuTopElement, { MenuItem, MenuItemProps } from './MenuTopElement'

interface MenuProps {
  elements: MenuItem[]
}

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

    document.addEventListener(menuCloseEvent, onMenuClose as EventListener)
    document.addEventListener('click', onDocClick)

    return (): void => {
      document.removeEventListener(menuCloseEvent, onMenuClose as EventListener)
      document.removeEventListener('click', onDocClick)
    }
  }, [])

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
