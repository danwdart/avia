import Twitter from 'twitter';
import objConfig from '../config';

const client = new Twitter(objConfig.client),
    main = async () => {
        try {
            const myTweets = await client.get(
                `statuses/user_timeline`,
                {
                    count: 200,
                    screen_name: objConfig.username
                }
            );
            console.log(myTweets);

            for (const {id_str} of myTweets) {
                console.log(`Deleting tweet ${id_str}`);
                await client.post(
                    `statuses/destroy/${id_str}`,
                    {}
                );
            }
        } catch (err) {
            console.error(err);
        }
    };

main();
