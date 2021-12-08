import React from 'react';

import {MarketStats} from "@sb/compositions/BorrowLending/Markets/Markets.styles";
import { RootRow } from '@sb/compositions/Pools/components/Charts/styles'
import {Content, Page} from "@sb/components/Layout";
import CurrentMarketSize from './components/CurrentMarketSize';
import { Block, BlockContent } from '@sb/components/Block';

const Markets = () => {
	return (
		<Page>
			<Content>
				<RootRow>
					<MarketStats>
						<Block>
							<BlockContent>
								<CurrentMarketSize value="412148232" />
							</BlockContent>
						</Block>
					</MarketStats>
				</RootRow>

			</Content>
		</Page>
	);
};

export default Markets;
