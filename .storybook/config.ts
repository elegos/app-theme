import { configure } from '@storybook/react'

configure(require.context('../src', true, /\.stories\.(ts|md)x?$/), module)
