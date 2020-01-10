import React from 'react'
import MenuBar from './MenuBar'

export default { title: 'Demo' }
export const Composed = (): React.ReactElement => <div>
  <MenuBar elements={[
    { name: 'File', elements: [
      { name: 'New File...', onClick: () => alert('should not prompt'), subElements: [
        { name: 'Blank' },
        { name: 'From template', isChecked: true, postText: 'CTRL+X' },
        { name: 'Separator #1', isSeparator: true },
        { name: 'Sub - submenu', subElements: [{ name: 'Whatever', onClick: () => true }] }
      ] },
      { name: 'New Window...', subElements: [
        { name: 'Classic Window' },
        { name: 'Fancy Window' },
      ] },
      { name: 'Separator #1', isSeparator: true },
      { name: 'Open File...', onClick: () => false },
    ] },
    { name: 'Edit' },
    { name: 'Selection' }
  ]} />
</div>
