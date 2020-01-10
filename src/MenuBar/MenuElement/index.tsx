import React, { useState, useRef, useEffect } from 'react'
import classnames from 'classnames'
import { MdKeyboardArrowRight, MdCheck } from 'react-icons/md'

import { menuCloseEvent, menuElementMouseEnterEvent, MenuElementMouseEnterDetail } from '../const'
import PolyCustomEvent from '../../polyfill/CustomEvent'

export interface MenuElementDef {
  name: string
  subElements?: MenuElementDef[]
  isChecked?: boolean
  postText?: string
  isSeparator?: boolean

  // onClick: if return true, will prevent the menu to close
  onClick?: (event: React.MouseEvent | React.KeyboardEvent) => boolean|void
}

interface MenuElementProps {
  element: MenuElementDef
  parentPath: string

  // see MenuElementDef.onClick
  onClick?: (event: React.MouseEvent) => boolean|void
}

const MenuElement: React.FunctionComponent<MenuElementProps> = (props: MenuElementProps) => {
  const { onClick: onOuterClick, element, parentPath } = props
  const { isSeparator, onClick } = element
  const [isOpen, setOpen] = useState<boolean>(false)
  const [closeTimeout, setCloseTimeout] = useState<number>(-1)
  const selfRef = useRef<HTMLDivElement>(null)

  const menuCloseListener = (event: CustomEvent) => {
    setOpen(false)
  }

  const mouseEnterListener = (event: CustomEvent<MenuElementMouseEnterDetail>) => {
    if (!isOpen) {
      return
    }

    if (!new RegExp(`^${parentPath}.${element.name}`).test(event.detail.path)) {
      clearTimeout(closeTimeout)
      setOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener(menuCloseEvent, menuCloseListener as EventListener)
    document.addEventListener(menuElementMouseEnterEvent, mouseEnterListener as EventListener)

    return () => {
      document.removeEventListener(menuCloseEvent, menuCloseListener as EventListener)
      document.removeEventListener(menuElementMouseEnterEvent, mouseEnterListener as EventListener)
    }
  }, [isOpen])

  const onClickWrapper = (event: React.MouseEvent) => {
    let keepOpen: boolean|void

    if (onOuterClick) {
      keepOpen = onOuterClick(event)
    }

    if ((element.subElements || []).length === 0 && onClick) {
      keepOpen = keepOpen || onClick(event)
    }

    if (!keepOpen) {
      document.dispatchEvent(PolyCustomEvent(menuCloseEvent, {}))
    }

    event.stopPropagation()
  }

  const onMouseEnter = () => {
    if (element.subElements && element.subElements.length) {
      document.dispatchEvent(PolyCustomEvent(
        menuElementMouseEnterEvent,
        { detail: { path: `${parentPath}.${element.name}` }}
      ))
    }

    clearTimeout(closeTimeout)
    if (isOpen) {
      return
    }
    setOpen(true)
  }

  const onMouseLeave = (event: React.MouseEvent) => {
    const relatedTarget: Element|null = event.relatedTarget as Element
    const isStillSelf = relatedTarget
      && relatedTarget.closest
      && relatedTarget.closest('MenuElement') === selfRef.current

    if (!isStillSelf) {
      clearTimeout(closeTimeout)
      setCloseTimeout(setTimeout(() => setOpen(false), 750))
    }
  }

  return isSeparator
    ? <hr className="Separator" />
    : <div
      ref={selfRef}
      className="MenuElement"
      onClick={onClickWrapper}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {element.isChecked && <MdCheck className="SubElementsPre" />}
      <span className="ElementText">{element.name}</span>
      {(element.subElements || []).length > 0 && <MdKeyboardArrowRight className="SubElementsPost" />}
      {(element.subElements || []).length === 0 && element.postText && <div className="SubElementsPost text">{element.postText}</div>}
      <div className={classnames('MenuElements', 'side', { open: isOpen })}>
        {(element.subElements || []).map((elem) => (
          <MenuElement
            key={elem.name}
            parentPath={`${parentPath}.${element.name}`}
            element={elem}
          />)
        )}
      </div>
    </div>
}
export default MenuElement
