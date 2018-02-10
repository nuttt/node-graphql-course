const { read } = require('./topicreader')

const main = async () => {
  // console.log(await read(2))
  console.log(await read(process.env.TOPIC_ID))
}

main()
