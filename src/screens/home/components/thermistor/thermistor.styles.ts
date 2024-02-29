import { View } from 'react-native';
import styled from 'styled-components';

export const ThermistorContainer = styled(View)<{
  top: number;
  left: number;
  width: number;
  height: number;
}>`
  position: absolute;
  background-color: orange;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  height: ${({ height }) => `${height}px`};
  width: ${({ width }) => `${width}px`};
  top: ${({ top }) => `${top}px`};
  left: ${({ left }) => `${left}px`};
`;
