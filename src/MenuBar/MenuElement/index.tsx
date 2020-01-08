import React from 'react'

export interface MenuElementDef {
  name: string
  onClick?: (event: React.MouseEvent | React.KeyboardEvent) => void  
  subElements?: MenuElementDef[]
  isSeparator?: boolean
}

interface MenuElementProps {
  element: MenuElementDef
  onClick?: (event: React.MouseEvent) => void
}

const MenuElement: React.FunctionComponent<MenuElementProps> = (props: MenuElementProps) => {
  const { onClick: onOuterClick, element } = props
  const { isSeparator, onClick } = element

  const onClickWrapper = (event: React.MouseEvent) => {
    if (onOuterClick) {
      onOuterClick(event)
    }

    if (onClick) {
      onClick(event)
    }
  }

  return isSeparator
    ? <hr className="Separator" />
    : <div
      className="MenuElement"
      onClick={onClickWrapper}
    >
      {props.element.name}
    </div>
}
export default MenuElement
