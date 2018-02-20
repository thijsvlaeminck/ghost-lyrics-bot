{
  const Twit = require(`twit`),
        fetch = require(`node-fetch`),
        config = require(`./config`),
        T = new Twit(config),
        stream = T.stream(`user`),
        fs = require(`fs`);

  let lyrics;

  const init = () => {
    console.log("the lyric bot is starting");

    fetch(`http://student.howest.be/thijs.vlaeminck/bot/ghost.json`)
      .then(r => r.json())
      .then(jsonData => lyrics = jsonData)
      .then(tweetIt)
      .catch(error => {
        console.log(error)
      });

    setInterval(tweetIt, 1000 * 60 * 60 * 6.00001);
    stream.on(`tweet`, tweetEvent);
  };

  const tweetEvent = eventMsg => {
    // const tweetTo = eventMsg.entities.user_mentions.screen_name;
    const tweetTo = eventMsg.in_reply_to_screen_name;
    const from = eventMsg.user.screen_name;

    if (tweetTo === `GhostLyricBot`) {
      const b64content = fs.readFileSync(`assets/img/papa2.png`, { encoding: 'base64' })

      // first we must post the media to Twitter
      T.post('media/upload', { media_data: b64content }, function (err, data, response) {
        // now we can assign alt text to the media, for use by screen readers and
        // other text-based presentations and interpreters
        const mediaIdStr = data.media_id_string;
        const altText = "Papa Emeritus showing his kazoo";
        const meta_params = { media_id: mediaIdStr, alt_text: { text: altText } };

        T.post('media/metadata/create', meta_params, function (err, data, response) {
          if (!err) {
            // now we can reference the media and post a tweet (media will attach to the tweet)
            const tweet = { status: `@${from} are you on the level? #ghost #ghostBC #PapaEmeritus`, media_ids: [mediaIdStr] };

            T.post('statuses/update', tweet, tweeted);
          }
        });
      });
    }
  };

  const tweetIt = () => {
    const line = lyrics[randomIndex];
    const randomIndex = Math.floor(Math.random() * lyrics.length);    
    const randomLineIndex = Math.floor(Math.random() * line.lines.length);    

    const tweet = {
      status: `${line.lines[randomLineIndex].toUpperCase()} - from "${line.song}" #ghost #ghostBC #ghostLyrics`
    }

    T.post('statuses/update', tweet, tweeted);
  };

  const tweeted = (err, data, response) => {
    if (err) {
      console.log("Something went wrong. Idiot.");
    } else {
      console.log("Tweet sent!");
    }
  };

  init();

}
