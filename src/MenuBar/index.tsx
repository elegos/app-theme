import React, { ReactElement, useState, useEffect, DOMElement } from 'react'
import classnames from 'classnames'

import MenuElement, { MenuElementDef } from './MenuElement'

import './MenuBar.scss'
import { menuCloseEvent } from './const'

interface MenuItem {
  name: string
  elements?: MenuElementDef[]
}

interface MenuProps {
  elements: MenuItem[]
}

const MenuBar: React.FunctionComponent<MenuProps> = (props: MenuProps): ReactElement => {
  const [openedMenu, setOpenedMenu] = useState<string>('')
  const onMenuClick = (menuItemName: string) => (event: React.MouseEvent) => {
    const target = event.target as HTMLElement
    if (!target.classList.contains('MenuItem')) {
      return
    }

    let newOpened = ''
    if (openedMenu !== menuItemName) {
      newOpened = menuItemName
    }

    setOpenedMenu(newOpened)
  }

  const onMenuEnter = (menuItemName: string) => () => {
    if (!!openedMenu && openedMenu !== menuItemName) {
      setOpenedMenu(menuItemName)
    }
  }

  useEffect(() => {
    const onMenuClose = (event: CustomEvent) => {
      setOpenedMenu('')
    }

    const onDocClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.MenuItem')) {
        setOpenedMenu('')
      }
    }

    document.addEventListener(menuCloseEvent, onMenuClose as EventListener)
    document.addEventListener('click', onDocClick)

    return () => {
      document.removeEventListener(menuCloseEvent, onMenuClose as EventListener)
      document.removeEventListener('click', onDocClick)
    }
  }, [])

  return (
    <div className="MenuBar">
      {props.elements.map((item) => {
        return (
          <div
            className={classnames('MenuItem', { open: item.name === openedMenu })}
            onClick={onMenuClick(item.name)}
            onMouseEnter={onMenuEnter(item.name)}
            key={item.name}
          >
            {item.name}
            <div className={classnames('MenuElements', { open: item.name === openedMenu})}>
              {(item.elements || []).map((element) => (
                <MenuElement
                  key={element.name}
                  element={element}
                  parentPath={item.name}
                  onClick={() => !(element.subElements || []).length && setOpenedMenu('')}
                />)
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MenuBar
