import * as React from 'react'
import { shallow } from 'enzyme'
import { RadialChart } from 'react-vis'
import PieChart from '../index'

const data = [{ angle: 30, label: 'First' }, { angle: 50, label: 'Second' }]

describe('PieChart', () => {
  describe('render()', () => {
    it('basic', () => {
      const wrapper = shallow(<PieChart data={data} />)

      expect(wrapper).toMatchSnapshot()
    })

    it('if width', () => {
      const wrapper = shallow(<PieChart data={data} width={300} />)

      expect(wrapper).toMatchSnapshot()
    })

    it('if height', () => {
      const wrapper = shallow(<PieChart data={data} height={300} />)

      expect(wrapper).toMatchSnapshot()
    })

    it('if radius', () => {
      const wrapper = shallow(<PieChart data={data} radius={300} />)

      expect(wrapper).toMatchSnapshot()
    })

    it('if innerRadius', () => {
      const wrapper = shallow(<PieChart data={data} innerRadius={300} />)

      expect(wrapper).toMatchSnapshot()
    })

    it('if hasCustomColors', () => {
      const hasColorData = data.map((obj) => {
        return {
          color: '#fff',
          ...obj,
        }
      })
      const wrapper = shallow(<PieChart data={hasColorData} />)

      expect(wrapper).toMatchSnapshot()
    })
  })

  // it('onValueMouseOver()', () => {
  //   const wrapper = shallow(<PieChart data={data} />)
  //   wrapper
  //     .find(RadialChart)
  //     .props()
  //     .onValueMouseOver(data[1])
  //
  //   expect(wrapper.state('value')).toEqual(data[1])
  //   wrapper.update()
  //   expect(wrapper).toMatchSnapshot()
  // })
  //
  // it('onSeriesMouseOut()', () => {
  //   const wrapper = shallow(<PieChart data={data} />)
  //   wrapper
  //     .find(RadialChart)
  //     .props()
  //     .onValueMouseOver(data[1])
  //   wrapper
  //     .find(RadialChart)
  //     .props()
  //     .onSeriesMouseOut()
  //
  //   expect(wrapper.state('value')).toBeNull()
  // })
})
