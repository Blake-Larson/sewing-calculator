import posthog from 'posthog-js';

function analyticsInit() {
    posthog.init('phc_W1k15szY2U3xV69r1pxK6Z53ViYiciwke0483p4Lrjs', {
        api_host: 'https://us.posthog.com'
    });
}

function captureEvent(event: string, properties: { property: string }) {
	console.log('captureEvent', event, properties);
	posthog.capture(event, properties);
}

export {
	analyticsInit,
	captureEvent
};
