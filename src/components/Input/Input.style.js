import styled from "styled-components";
export const StyledInput = styled.input`
width: 100%;
box-sizing: border-box;
border: 1.5px solid transparent;
border-radius: 4px;
font-size: 16px;
background-color: white;
background-image: url('https://www.w3schools.com/css/searchicon.png');
background-position: 10px 10px; 
background-repeat: no-repeat;
padding: 12px 20px 12px 40px;
margin-bottom: 8px;
transition: .25s;
&:hover{
outline: 0;
box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 3px 10px 0 rgba(0, 0, 0, 0.1);
}
&:focus{
outline: 0;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 15px 0 rgba(0, 0, 0, 0.19);
}
`;