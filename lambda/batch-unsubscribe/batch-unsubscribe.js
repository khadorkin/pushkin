import PromiseTools from 'promise-tools';
import Subscription from '../../lib/subscription';
import sendToSlack from '../../lib/util/send-to-slack';

export default (event, context, cb) => {
    let sns = event.Records[0].Sns;
    let parsedMessage = JSON.parse(sns.Message);
    console.log('received batch unsubscribe', parsedMessage);

    PromiseTools.map(parsedMessage.subscriptions, (subscription) => {
        return Subscription.remove(parsedMessage.topic, {
            type: 'web',
            data: subscription
        });
    }).then((removed) => {

        let slackMsg = {
            text: `Removed ${removed.length} NotRegistered subscribers`
        };

        sendToSlack(slackMsg).then(() => context.done(null));
    }).catch((err) => {
        context.done(err);
    })
}
