import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';

export const Container = styled(TouchableOpacity)`
  border: 1px solid black;
  border-radius: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #e57373;
  /* background-color: #8fcb9b;
  background-color: #ef233c;
  background-color: #f5b700; */
  padding: 24px;
`;

export const Left = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: 24px;
`;
