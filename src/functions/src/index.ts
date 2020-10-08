import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

export const cleanupAfterVehicle = functions.runWith({ timeoutSeconds: 540 }).https.onCall(async (data, context) => {
    const firebase_tools = require('firebase-tools');

    console.log('Data:');
    console.log(data);
    const userId = data.userId;
    console.log('UserId ' + userId);
    const vehicleId = data.vehicleId;
    console.log('VehicleId ' + vehicleId);

    const collectionPath = `users/${userId}/vehicles/${vehicleId}/repairs`;
    const token = '1//03gL_2Zlby53mCgYIARAAGAMSNwF-L9IrGPRcnGslleSUC6EqMC6DrayKGKQye-6pRapd_gPBsndtBntgij09lufcnhRCWf16eW8';

    await firebase_tools.delete(collectionPath, {
        project: 'carm-d0bb1',
        recursive: true,
        yes: true,
        token: token,
    });
});
