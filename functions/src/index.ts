import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();
const fcm = admin.messaging();

export const sentToTopic = functions.firestore
    .document("puppies/{puppyId}")
    .onCreate(async snapshot => {
        const puppy = snapshot.data();

        const payload: admin.messaging.MessagingPayload = {
            notification:{
                title: 'New Puppy',
                body: `dah body ${puppy.name}`,
                clickAction: 'FLUTTER_NOTIFICATION_CLICK'
            }
        };

        return fcm.sendToTopic('puppies', payload);
    });

export const sendToDevice = functions.firestore
    .document('orders/{orderId}')
    .onCreate(async snapshot =>{

        const order = snapshot.data();

        const querySnapshot = await db
            .collection('users')
            .doc(order.seller)
            .collection('tokens')
            .get();

        const tokens = querySnapshot.docs.map(snap => snap.id);

        const payload: admin.messaging.MessagingPayload = {
            notification:{
                title: 'New title',
                body: 'you selling things',
                click_action: 'FLUTTER_NOTIFICATION_CLICK'
            }
        };

        return fcm.sendToDevice(tokens, payload);
    });