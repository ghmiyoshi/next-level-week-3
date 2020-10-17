import styled, { css } from 'styled-components';

interface PropsText{

  typeText: 'title' | 'count';
}


export const StyledHeader = styled.header`


  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding-bottom: 24px; 
  z-index: 999;

  height: 122px;
  border-bottom: 1px solid  #D3E2E5;
`;


export const Text = styled.h1<PropsText>`

  color: ${props => props.theme.colors.textPrimaryColor};

  ${props => props.typeText === 'title' && css `
  
    font-weight: bold;
    font-size: 32px;
  
  `};


  ${props => props.typeText === 'count' && css `

    font-weight: 600;
    font-size: 16px;

  `};

`;

