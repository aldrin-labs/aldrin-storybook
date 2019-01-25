import * as React from 'react'
import { shallow, mount } from 'enzyme'
import AreaChart from '../index'

describe('Switch', () => {
  it('render()', () => {
    const wrapper = shallow(
      <AreaChart data={[{ x: 1, y: 2 }, { x: 2, y: 3 }]} />
    )

    expect(wrapper).toMatchSnapshot()
  })
})
