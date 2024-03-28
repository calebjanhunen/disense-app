import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';

export const Container = styled(TouchableOpacity)<{
  riskLevel: 0 | 1 | 2;
}>`
  border: 1px solid grey;
  border-radius: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #4caf50;
  background-color: ${({ riskLevel }) => {
    if (riskLevel === 0) {
      return '#4caf50';
    } else if (riskLevel === 1) {
      return '#FFB74D';
    } else {
      return '#E57373';
    }
  }};
  padding: 24px;
`;

export const Left = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;
