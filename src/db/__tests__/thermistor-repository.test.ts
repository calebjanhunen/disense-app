// import { db } from '../db';
// import { deleteThermistorDataForUser } from '../thermistor-repository';

// jest.mock('../db', () => {
//   const originalModule = jest.requireActual('../db'); // Import the actual module
//   const mockTransactionAsync = jest.fn(async callback => {
//     const tx = {
//       executeSqlAsync: jest.fn().mockResolvedValue(undefined),
//     };
//     await callback(tx);
//   });

//   return {
//     __esModule: true,
//     ...originalModule,
//     db: {
//       transactionAsync: mockTransactionAsync,
//     },
//   };
//   //   return {
//   //     // openDatabase: jest.fn(() => ({
//   //     db: {
//   //       transactionAsync: jest.fn(async callback => {
//   //         const tx = {
//   //           executeSqlAsync: jest.fn(),
//   //         };
//   //         await callback(tx);
//   //       }),
//   //     },
//   //     // })),
//   //   };
// });

// eslint-disable-next-line @typescript-eslint/no-var-requires
// jest.setMock('../db', require('../../mocks/db.mock'));

// describe('Thermistor Repository', () => {
//   describe('Test deleteThermistorDataForUser', () => {
//     it('Should delete successfully', async () => {
//       //   db.transactionAsync.mock
//       const userId = 1;
//       await deleteThermistorDataForUser(userId);

//       expect(db.transactionAsync).toHaveBeenCalled();
//     });
//   });
// });
