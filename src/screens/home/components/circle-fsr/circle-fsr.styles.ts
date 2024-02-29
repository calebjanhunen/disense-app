import { View } from 'react-native';
import styled from 'styled-components';

export const CircleFsrContainer = styled(View)<{
  top: number;
  left: number;
  width: number;
  height: number;
}>`
  position: absolute;
  background-color: grey;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  border-radius: 100px;
  height: ${({ height }) => `${height}px`};
  width: ${({ width }) => `${width}px`};
  top: ${({ top }) => `${top}px`};
  left: ${({ left }) => `${left}px`};
  margin-left: ${({ width }) => `${-width / 2}px`};
  margin-top: ${({ height }) => `${-height / 2}px`};
`;
