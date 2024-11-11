import 'dotenv/config'

export default {
    expo: {
      name: 'Eventio',
      slug: 'eventio',
      extra: {
        apiUrl: process.env.API_URL,
        apiKey: process.env.API_KEY
      }
    }
  };