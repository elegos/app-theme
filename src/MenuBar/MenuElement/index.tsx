import React, { useState, useRef, useEffect } from 'react'
import classnames from 'classnames'
import { MdKeyboardArrowRight } from 'react-icons/md'

export interface MenuElementDef {
  name: string
  onClick?: (event: React.MouseEvent | React.KeyboardEvent) => void  
  subElements?: MenuElementDef[]
  isChecked?: boolean
  isSeparator?: boolean
}

interface MenuElementProps {
  element: MenuElementDef
  parentPath: string
  onClick?: (event: React.MouseEvent) => void
}

const menuElementMouseEnterEvent = 'app-theme.MenuBar.MenuElement.MouseEnter'

const MenuElement: React.FunctionComponent<MenuElementProps> = (props: MenuElementProps) => {
  const { onClick: onOuterClick, element, parentPath } = props
  const { isSeparator, onClick } = element
  const [isOpen, setOpen] = useState<boolean>(false)
  const [closeTimeout, setCloseTimeout] = useState<number>(-1)
  const selfRef = useRef<HTMLDivElement>(null)

  const listener = (event: CustomEvent) => {
    if (!isOpen) {
      return
    }

    if (!new RegExp(`^${parentPath}.${element.name}`).test(event.detail.path)) {
      clearTimeout(closeTimeout)
      setOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener(menuElementMouseEnterEvent, listener as EventListener)
    return () => {
      document.removeEventListener(menuElementMouseEnterEvent, listener as EventListener)
    }
  }, [isOpen])

  const onClickWrapper = (event: React.MouseEvent) => {
    if (onOuterClick) {
      onOuterClick(event)
    }

    if (onClick) {
      onClick(event)
    }
  }

  const onMouseEnter = () => {
    if (element.subElements && element.subElements.length) {
      document.dispatchEvent(new CustomEvent(
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
      <span className="ElementText">{element.name}</span>
      {(element.subElements || []).length > 0 && <MdKeyboardArrowRight className="SubElementsCaret" />}
      <div className={classnames('MenuElements', 'side', { open: isOpen })}>
        {(element.subElements || []).map((elem) => (
          <MenuElement
            key={elem.name}
            parentPath={`${parentPath}.${element.name}`}
            element={elem}
            onClick={() => alert('click!')}
          />)
        )}
      </div>
    </div>
}
export default MenuElement
