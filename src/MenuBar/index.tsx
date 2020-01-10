import React, {
  ReactElement, useState, useEffect,
} from 'react'

import './MenuBar.scss'

import { menuCloseEvent } from './const'
import MenuTopElement, { MenuItem } from './MenuTopElement'

interface MenuProps {
  elements: MenuItem[]
}

const MenuBar: React.FunctionComponent<MenuProps> = (props: MenuProps): ReactElement => {
  const { elements } = props
  const [currentMenuIndex, setCurrentMenuIndex] = useState<number>(-1)

  // const onMenuClick = (menuItemName: string) => (event: React.MouseEvent): void => {
  //   const target = event.target as HTMLElement
  //   if (!target.classList.contains('MenuItem')) {
  //     return
  //   }

  //   let newOpened = ''
  //   if (openedMenu !== menuItemName) {
  //     newOpened = menuItemName
  //   }

  //   setOpenedMenu(newOpened)
  // }

  // const onMenuEnter = (menuItemName: string) => (): void => {
  //   if (!!openedMenu && openedMenu !== menuItemName) {
  //     setOpenedMenu(menuItemName)
  //   }
  // }

  // const onKeyDownVertical = (direction: AllowedVDirection, currentElement: HTMLElement): void => {
  //   const container = currentElement.querySelector('.MenuElements')
  //   const target = direction === Direction.Up ? container?.lastChild : container?.firstChild

  //   if (target) {
  //     (target as HTMLElement).focus()
  //   }
  // }

  // const onKeyDown = onGenericKeyDown(onKeyDownHorizontal, onKeyDownVertical)

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
          menu={item}
          tabIndex={index}
          currentMenuIndex={currentMenuIndex}
          changeMenuIndex={changeMenuIndex}
        />
      ))}
    </div>
  )
}

export default MenuBar
