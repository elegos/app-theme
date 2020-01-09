import React from 'react'
import MenuBar from './MenuBar'

export default { title: 'Demo' }
export const Composed = (): React.ReactElement => <div>
  <MenuBar elements={[
    { name: 'File', elements: [
      { name: 'New File...', subElements: [
        { name: 'Blank' },
        { name: 'From template' },
        { name: 'Separator #1', isSeparator: true },
        { name: 'Sub - submenu', subElements: [{ name: 'Whatever' }] }
      ] },
      { name: 'New Window' },
      { name: 'Separator #1', isSeparator: true },
      { name: 'Open File...', onClick: () => alert('Open file') },
    ] },
    { name: 'Edit' },
    { name: 'Selection' }
  ]} />
</div>
