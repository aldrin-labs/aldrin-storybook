import React from 'react'

import { Button, Container } from './index.styles'

const tables = ['All pools', 'Your pools']

export const Switcher = () => {
  return (
    <Container>
      {tables.map((table) => (
        <Button size={tables.length} onClick={() => {}}>
          {table}
        </Button>
      ))}
    </Container>
  )
}
