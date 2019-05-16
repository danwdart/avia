import Twitter from 'twitter';
import objConfig from '../config';

const client = new Twitter(objConfig.client),
    //pRt = id => client.post(
    //    `statuses/retweet/${id}`
    //),
    pQuote = (tweet, strText) => client.post(
        `statuses/update`,
        {
            status: `${strText} https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`
        }
    ),
    pStream = strAction => client.stream(
        `statuses/filter`,
        {
            track: strAction
        }
    ),
    pDelay = ms => new Promise(res => setTimeout(res, ms)),
    pListenAndRt = async (strAction, strText) => {
        console.log(`Listening for ${strAction}`);
        try {
            for await (const tweet of pStream(strAction)) {
                await pQuote(tweet, strText);
            }
        } catch (err) {
            console.log(err);
        }
    },
    main = async () => {
        for (let strAction in objConfig.actions) {
            let strText = objConfig.actions[strAction];
            try {
                await pListenAndRt(strAction, strText);
                await pDelay(1000);
            } catch (err) {
                console.log(err);
            }
        }
    };

main();
