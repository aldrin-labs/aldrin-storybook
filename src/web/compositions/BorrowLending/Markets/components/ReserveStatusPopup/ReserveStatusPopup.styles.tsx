import styled from 'styled-components'

export const TextBlock = styled.div`
    border-radius: 0.5rem;
    padding: 3.5rem;
    text-align: left;
    margin-bottom: 2rem;
    background-color: #17181A;
`

export const TitleBlock = styled.h3`
    margin-top: 0;
    margin-bottom: 1.6rem;
    font-size: 2.5rem;
    color: #ecf0f3;
`

export const SubtitleBlock = styled.strong`
    display: block;
    margin-bottom: 1.6rem;
    font-size: 2.8rem;
    color: #ecf0f3;
`

export const DescriptionBlock = styled.span`
    display: block;
    font-size: 1.8rem;
    color: #ecf0f3;
`

export const UtilizationChart = styled.div`
    text-align: center;
`

export const StatsList = styled.ul`
    width: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: space-between;
`

export const StatsItem = styled.li`
    list-style: none;
    flex: 1;
    border-right: 0.1rem solid rgb(56, 59, 69);
    text-align: center;
    &:last-child {
        border-right: 0;
    }
`

export const StatsName = styled.p`
    font-size: 1.8rem;
    color: #ecf0f3;
`

export const StatsDescription = styled.strong`
    font-size: 1.8rem;
    color: #ecf0f3;
`
