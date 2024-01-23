import base64 from 'react-native-base64';
import { Base64 } from 'react-native-ble-plx';

export function decodeByteArray(byteArr: Uint8Array) {
  const id = byteArr[0];
  const tempVal =
    (byteArr[1] << 24) | (byteArr[2] << 16) | (byteArr[3] << 8) | byteArr[4];
  console.log(id, tempVal);
}

export function fromBase64ToByteArr(base64String: Base64): Uint8Array {
  const decodedString = base64.decode(base64String);
  const byteArr = new Uint8Array(new ArrayBuffer(decodedString.length));

  for (let i = 0; i < decodedString.length; i++) {
    byteArr[i] = decodedString.charCodeAt(i);
  }

  return byteArr;
}
