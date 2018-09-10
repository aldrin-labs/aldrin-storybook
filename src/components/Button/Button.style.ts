import styled from 'styled-components';
export const StyledButton = styled.button`
background-color: #300;
border: none;
color: white;
padding: 13px 32px;
text-align: center;
font-size: 16px;
margin: 4px 2px;
opacity: 0.6;
transition: 0.25s;
display: inline-block;
text-decoration: none;
cursor: pointer;
border-radius: 3px;
margin-left: calc( 100% - 114px );

&:hover {
opacity: 1
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

border: 0;
}
&:focus{
outline: 0;
}
`;