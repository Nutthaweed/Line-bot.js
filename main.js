const line = require('@line/bot-sdk');
const express = require('express')
const axios = require('axios')
const dotenv = require('dotenv')

const env = dotenv.config().parsed
const app = express()

const lineConfig = {
    channelAccessToken: env.ACCESS_TOKEN,
    channelSecret: env.SECRET_TOKEN
}

const client = new line.Client(lineConfig);

app.post('/webhook', line.middleware(lineConfig), async (req, res) => {
    try {
        const events = req.body.events
        console.log('event=>>>[]')
        return events.length > 0 ? await events.map(item => handleEvent(item)) : res.status(200).send("OK")
    } catch (error) {
        res.status(500).end()
    }
});

const handleEvent = async (event) => {
   if(event.type !== 'message' || event.message.type !== 'text'){
         return null;
    }
   else if (event.type === 'message'){
      const { data } = await axios.get(`https://${env.RAPID_URL}/champions/${event.message.text}/bard` , {
      headers: {
        'x-rapidapi-host' : env.RAPID_URL ,
        'x-rapidapi-key' : env.RAPID_KEY
        }
    })
       console.log("DATA=>>>",data)
       const bard  = {data}
       let str = ''
       bard.forEach((result, i) => {
           str += bard.length = 1 !== i? `${result}\n` : result
       })
       console.log("STR====>",arr)
       return client.replyMessage(event.replyToken, {type : 'text', text: str})
    };
};


app.listen(4000, () => {
    console.log('listening on 4000');
});