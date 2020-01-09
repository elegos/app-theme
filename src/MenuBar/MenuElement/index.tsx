import React, { useState, useRef } from 'react'
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
  onClick?: (event: React.MouseEvent) => void
}

const MenuElement: React.FunctionComponent<MenuElementProps> = (props: MenuElementProps) => {
  const { onClick: onOuterClick, element } = props
  const { isSeparator, onClick } = element
  const [isOpen, setOpen] = useState<boolean>(false)
  const [closeTimeout, setCloseTimeout] = useState<number>(-1)
  const selfRef = useRef<HTMLDivElement>(null)

  const onClickWrapper = (event: React.MouseEvent) => {
    if (onOuterClick) {
      onOuterClick(event)
    }

    if (onClick) {
      onClick(event)
    }
  }

  const onMouseEnter = () => {
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
      data-name={element.name}
      className="MenuElement"
      onClick={onClickWrapper}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span className="ElementText">{element.name}</span>
      {(element.subElements || []).length > 0 && <MdKeyboardArrowRight className="SubElementsCaret" />}
      <div className={classnames('MenuElements', 'side', { open: isOpen })}>
        {(element.subElements || []).map((element) => (
          <MenuElement
            key={element.name}
            element={element}
            onClick={() => alert('click!')}
          />)
        )}
      </div>
    </div>
}
export default MenuElement
