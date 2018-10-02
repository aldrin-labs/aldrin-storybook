import * as React from 'react'
import styled from 'styled-components'

import { Props, State } from '@components/Legends/Legends.types'

export default class Legends extends React.Component<Props, State> {
  state: State = {
    activeLegend: null,
  }

  onChangeActiveLegend = (index: number | null) => {
    const { onChange } = this.props
    const { activeLegend } = this.state

    if (activeLegend && activeLegend === index) return
    this.setState({ activeLegend: index }, () => {
      if (onChange) onChange(index)
    })
  }

  render() {
    const { legends } = this.props
    const { activeLegend } = this.state

    if (!legends) return null

    return (
      <LegendsContainer>
        {legends.map((legend, i) => {
          return (
            <LegendContainer>
              <LegendColor
                style={{
                  backgroundColor: legend.color,
                  boxShadow:
                    activeLegend === i ? '0px 0px 0px 1px #fff' : 'none',
                }}
                onClick={() => this.onChangeActiveLegend(i)}
              />
              <LegendTitle>{legend.title}</LegendTitle>
            </LegendContainer>
          )
        })}

        <ResetButton onClick={() => this.onChangeActiveLegend(null)}>
          Reset
        </ResetButton>
      </LegendsContainer>
    )
  }
}

const ResetButton = styled.button`
  margin-top: 10px;
  background: transparent;
  border-radius: 2px;
  border: 1px solid #4c5055;
  padding: 10px;
  outline: none;
  font-family: Roboto, sans-serif;
  letter-spacing: 0.4px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: #4ed8da;
  cursor: pointer;
  text-transform: uppercase;
`

const LegendTitle = styled.p`
  color: #fff;
  text-align: left;
  padding: 0;
  margin: 5px;
`

const LegendColor = styled.button`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 10px;
  border-color: transparent;
  cursor: pointer;
  outline: none;
`

const LegendContainer = styled.div`
  display: flex;
  align-items: center;
  min-width: 100px;
`

const LegendsContainer = styled.div`
  display: flex;
  flex-direction: column;
`
