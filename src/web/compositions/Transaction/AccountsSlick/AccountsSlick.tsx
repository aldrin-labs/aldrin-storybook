import React, { Component } from 'react'
import { compose } from 'recompose'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getMyPortfoliosQuery } from '@core/graphql/queries/portfolio/getMyPortfoliosQuery'
import Slider from 'react-slick'

import {
    AccountsSlickStyles,
    TypographyAccountName,
    TypographyAccountMoney
} from './AccountsSlick.styles'

import SvgIcon from '@sb/components/SvgIcon'
import SliderArrow from '@icons/SliderArrow.svg'

const LeftArrow = ({ className, onClick, style }) => <SvgIcon
    src={SliderArrow}
    className={className}
    onClick={onClick}
    style={{ ...style, cursor: 'pointer' }}
    width={32}
    height={32}
/>
const RightArrow = ({ className, onClick, style }) => <SvgIcon
    src={SliderArrow}
    className={className}
    onClick={onClick}
    style={{ ...style, cursor: 'pointer', transform: 'rotate(-180deg)' }}
    width={32}
    height={32}
/>

class AccountsSlick extends Component {
    render() {
        const { getMyPortfoliosQuery, isSideNav } = this.props

        const settings = {
            speed: 375,
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: false,
            prevArrow: <LeftArrow/>,
            nextArrow: <RightArrow/>
        }

        const MyPortfoliosOptions = getMyPortfoliosQuery.myPortfolios.map(
          (item: { _id: string; name: string }) => {
            return {
              label: item.name,
              value: item._id,
            }
          }
        )

        return (
            <>
                <AccountsSlickStyles/>
                
                {MyPortfoliosOptions.length > 1 ? (
                    <Slider {...settings}>
                        {MyPortfoliosOptions.map(slide => (
                            <div>
                                <TypographyAccountName isSideNav={isSideNav}>{slide.label}</TypographyAccountName>
                                <TypographyAccountMoney isSideNav={isSideNav}>$500,000.00</TypographyAccountMoney>
                            </div>
                        ))}
                    </Slider>
                ) : (
                    <div style={{ margin: '2rem 0 2.5rem' }}>
                        <TypographyAccountName isSideNav={isSideNav}>{MyPortfoliosOptions[0].label}</TypographyAccountName>
                        <TypographyAccountMoney isSideNav={isSideNav}>$500,000.00</TypographyAccountMoney>
                    </div>
                )}
            </>
        )
    }
}

export default compose(
    queryRendererHoc({
      query: getMyPortfoliosQuery,
      name: 'getMyPortfoliosQuery',
    })
)(AccountsSlick)
