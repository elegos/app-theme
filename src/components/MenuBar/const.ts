export const menuCloseEvent = 'app-theme.components.MenuBar.Close'

export const menuElementMouseEnterEvent = 'app-theme.components.MenuBar.MenuElement.MouseEnter'
export interface MenuElementMouseEnterDetail {
  path: string
}

export const menuTopElementHorizontalEvent = 'app-theme.components.MenuBar.MenuTopElement.MoveHorizontal'
export interface MenuTopElementHorizontalDetail {
  direction: Direction
}

export enum Direction {
  Down = 'ArrowDown',
  Left = 'ArrowLeft',
  Right = 'ArrowRight',
  Up = 'ArrowUp',
}

export type AllowedVDirection = Direction.Up|Direction.Down
export type AllowedHDirection = Direction.Right|Direction.Left
export type AllowedDirection = AllowedVDirection|AllowedHDirection

export const onGenericKeyDown = (
  handleHorizontal: (direction: AllowedHDirection, currentElement: HTMLElement) => void,
  handleVertical: (direction: AllowedVDirection, currentElement: HTMLElement) => void,
) => (event: React.KeyboardEvent<HTMLDivElement>): void => {
  event.stopPropagation()

  const { currentTarget, key } = event
  const allowedDirections = [Direction.Up, Direction.Down, Direction.Left, Direction.Right]
  if (!allowedDirections.includes(key as Direction)) {
    return
  }

  const direction = key as AllowedDirection

  if (
    (direction === Direction.Left || direction === Direction.Right)
    && handleHorizontal
  ) {
    handleHorizontal(direction, currentTarget)
    return
  }

  if (
    (direction === Direction.Up || direction === Direction.Down)
    && handleVertical
  ) {
    handleVertical(direction, currentTarget)
  }
}
