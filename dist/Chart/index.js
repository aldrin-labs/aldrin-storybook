import React from 'react';
import styled from 'styled-components';
const Wrapper = styled.div `
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
export const SingleChart = ({ additionalUrl, chartsApiUrl }) => (React.createElement(Wrapper, null,
    React.createElement("iframe", { src: `https://${chartsApiUrl}${additionalUrl}`, height: '100%' })));
export default SingleChart;
//# sourceMappingURL=index.js.map