import React from 'react';
import {compose} from 'recompose';
import {withTheme} from '@material-ui/core/styles';
import {toNumberWithDecimals, u192ToBN} from '@sb/dexUtils/borrow-lending/U192-converting';
import BN from 'bn.js';
import {Theme} from '@material-ui/core';

import { RootRow } from '@sb/compositions/Pools/components/Charts/styles';
import {Cell, WideContent, Page, Row} from '@sb/components/Layout';
import CurrentMarketSize from './components/CurrentMarketSize/CurrentMarketSize';
import BorrowedLent from './components/BorrowedLent/BorrowedLent';
import TableMarkets from './components/TableMarkets/TableMarkets';
import MarketComposition from './components/MarketComposition/MarketComposition';
import {MarketCompType} from './types';

type MarketsProps = {
	theme: Theme,
	reserves: any
}

const Markets = ({theme, reserves}: MarketsProps) => {

	const calculateTotalLiq = (reservesList: []): {'number': number, 'bn': BN} => {
		let total = new BN(0);
		reservesList.forEach(reserve => {
			const reserveLiq = u192ToBN(reserve.liquidity.borrowedAmount).add(reserve.liquidity.availableAmount);
			total = total.add(reserveLiq);
		})

		return {
			'number': parseInt(total.toString()),
			'bn': total,
		}
	}

	const totalLiq = calculateTotalLiq(reserves);

	const calculateMarketSize = (reservesList: []): {'number': number, 'bn': BN} => {
		let total = new BN(0);
		reservesList.forEach(reserve => {
			const reserveMarketPrice = u192ToBN(reserve.liquidity.marketPrice);
			const reserveAvailableAmount = reserve.liquidity.availableAmount;
			total = total.add(reserveMarketPrice.mul(reserveAvailableAmount));
		})

		return {
			'number': parseInt(total.toString()),
			'bn': total,
		}
	}

	const calculateTotalBorrowedAmount = (reservesList: []): {'number': number, 'bn': BN} => {
		let total = new BN(0);
		reservesList.forEach(reserve => {
			const reserveBorrowedAmount = u192ToBN(reserve.liquidity.borrowedAmount);
			total = total.add(reserveBorrowedAmount);
		})

		return {
			'number': parseInt(total.toString()),
			'bn': total,
		}
	}

	const calculateLentPercentage = (reservesList: []) => {
		let totalLent = new BN(0);
		reservesList.forEach(reserve => {
			const reserveLiq = u192ToBN(reserve.liquidity.borrowedAmount).add(reserve.liquidity.availableAmount);
			const reserveLentPercent = u192ToBN(reserve.liquidity.borrowedAmount).div(reserveLiq);

			totalLent = totalLent.add(reserveLentPercent);
		})
		return parseInt(totalLent.toString());
	}

	const generateMarketCompositionArr = (reservesList: []): MarketCompType[] => {
		const marketCompArr: MarketCompType[] = [];
		reservesList.forEach(reserve => {
			const reserveLiq = u192ToBN(reserve.liquidity.borrowedAmount).add(reserve.liquidity.availableAmount);
			const reserveLiqPercent = (100 * parseInt(reserveLiq.toString()))/totalLiq.number;

			marketCompArr.push({
				asset: reserve.liquidity.mint.toString(),
				value: reserveLiqPercent,
			})
		})

		return marketCompArr;
	}

	const marketSize = toNumberWithDecimals(calculateMarketSize(reserves).number, 2);
	const borrowedAmount = toNumberWithDecimals(calculateTotalBorrowedAmount(reserves).number, 2);
	const lentPercentage = calculateLentPercentage(reserves);
	const marketCompValues = generateMarketCompositionArr(reserves);

	return (
		<Page>
			<WideContent>
				<RootRow>
					<Cell col={12} colLg={4}>
						<CurrentMarketSize value={marketSize} />
					</Cell>
					<Cell col={12} colLg={8}>
						<Row>
							<Cell col={4} colLg={4}>
								<BorrowedLent valueBorrowed={borrowedAmount} valueLent={lentPercentage} />
							</Cell>
							<Cell col={8} colLg={8}>
								<MarketComposition values={marketCompValues} />
							</Cell>
						</Row>

					</Cell>
				</RootRow>

				<RootRow>
					<Cell col={12}>
						<TableMarkets theme={theme} reserves={reserves} />
					</Cell>
				</RootRow>

			</WideContent>
		</Page>
	);
};

export default compose(withTheme())(Markets)
