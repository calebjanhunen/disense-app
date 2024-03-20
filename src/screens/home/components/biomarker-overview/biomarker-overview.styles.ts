import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';

export const Container = styled(TouchableOpacity)`
  border: 1px solid grey;
  border-radius: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #4caf50;
  /* background-color: #4CAF50;
  background-color: #E57373;
  background-color: #FFB74D; */
  padding: 24px;
`;

export const Left = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;
