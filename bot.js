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

    setInterval(tweetIt, 1000 * 60 * 60 * 10);
  };

  const tweetIt = () => {
    const randomIndex = Math.floor(Math.random() * lyrics.length);
    const line = lyrics[randomIndex];
    const randomLineIndex = Math.floor(Math.random() * line.lines.length);
    
    console.log(line.lines[randomLineIndex], line.song, line.album);

    const tweet = {
      status: `${line.lines[randomLineIndex].toUpperCase()} - from "${line.song}", on ${line.album} #thebandghost #CardinalCopia #ghostLyrics #ghost`
    }

    T.post('statuses/update', tweet, tweeted);
  };

  const tweeted = (err, data, response) => {
    if (err) {
      console.log("Something went wrong.");
    } else {
      console.log("Tweet sent!");
    }
  };

  init();

}
