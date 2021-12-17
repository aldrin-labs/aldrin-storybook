import React from 'react'
import styled from 'styled-components'
import Slider from '@material-ui/lab/Slider';

export const ButtonCategory = styled.button`
    font-size: 3rem;
    padding: 1rem 4rem;
    background: transparent;
    border: none;
    box-shadow: none;
    border-top: 1rem solid transparent;
    color: #fff;
    cursor: pointer;
`

export const TitleBlock = styled.p`
    font-weight: 500;
    margin-bottom: 1rem;
    margin-top: 0;
`

export const SupplyCard = styled.div`
    background: #2f3237;
    padding: 1rem;
    border-radius: 1rem;
    margin-top: 4rem;
`

export const BlockSupply = styled.div`
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    text-align: center;
    color: #fff;
    font-size: 2rem;
`

export const AmountCard = styled.div`
    background: #222429;
    padding: 1rem;
    border-radius: 1rem;
`

export const AmountInput = styled(props => <input {...props} />)`
    width: 100%;
    text-align: center;
`

export const MaxAmount = styled.button`
    font-size: 1.5rem;
    padding: 0;
    background: transparent;
    border: none;
    box-shadow: none;
    color: #fff;
    cursor: pointer;
    color: #fff;
    text-align: left;
`

export const CustomSlider = styled((props) => <Slider {...props} />)`
    padding: 22px 0px;
    .trackBefore & {
        background: #fff
    }
`

export const ButtonGroup = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`
