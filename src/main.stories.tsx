import React from 'react'
import MenuBar from './MenuBar'

export default { title: 'Demo' }
export const Composed = (): React.ReactElement => <div>
  <MenuBar elements={[
    { name: 'File', elements: [
      { name: 'New File' },
      { name: 'New Window' },
      { name: 'Separator #1', isSeparator: true },
      { name: 'Open File...', onClick: () => alert('Open file') },
    ] },
    { name: 'Edit' },
    { name: 'Selection' }
  ]} />
</div>
