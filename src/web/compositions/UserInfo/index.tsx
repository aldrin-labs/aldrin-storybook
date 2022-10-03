import React, { useState } from 'react'

import { Input } from '@sb/components/Input'
import { BlackPage, Cell, Row, WideContent } from '@sb/components/Layout'

const UserInfo = () => {
  const [userKey, setUserKey] = useState('')

  return (
    <BlackPage>
      <WideContent style={{ height: '100%' }}>
        <Row
          style={{ width: '100%', height: '100%', justifyContent: 'center' }}
        >
          <Cell
            col={10}
            colSm={9}
            colMd={8}
            colLg={7}
            colXl={6}
            style={{ justifyContent: 'center' }}
          >
            <Input
              name="UserKey"
              value={userKey}
              onChange={(v) => setUserKey(v)}
              placeholder="..."
              borderRadius="lg"
              variant="outline"
              disabled={false}
            />
          </Cell>
        </Row>
      </WideContent>
    </BlackPage>
  )
}

export { UserInfo }
