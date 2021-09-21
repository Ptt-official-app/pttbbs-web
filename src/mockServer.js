import { createServer } from 'miragejs'

import articleList from './assets/test/devptt_WhoAmI.json'
import summary from './assets/test/devptt_WhoAmI_summary.json'
import comments from './assets/test/devptt_WhoAmI_comments.json'
import testArticle from './assets/test/devptt_WhoAmI_testArticle.json'

export default function setupServer() {
  console.log("create mock server");
  return createServer({
    routes(){
      this.get('/api/board/:bid/articles', (schema, request) => {
        const bid = request.params.bid
        console.log("GET ARTICLES: " + bid)

        return articleList
      })

      this.get('/api/board/:bid/summary', (schema, request) => {
        const bid = request.params.bid
        console.log("GET SUMMARY: " + bid)

        return summary
      })

      this.get('/api/board/:bid/article/:aid', (schema, request) => {
        const bid = request.params.bid
        const aid = request.params.aid
        console.log("GET ARTICLE from BOARD " + bid + ": " + aid)

        return testArticle
      })

      this.get('/api/board/:bid/article/:aid/comments', (schema, request) => {
        const bid = request.params.bid
        const aid = request.params.aid

        console.log("GET ARTICLE COMMENTS from BOARD " + bid + ": " + aid)

        return comments
      })

      this.get('/api/userid', () => {
        console.log("GET USERID: ")
        return { user_id: 'Guest' }
      })

      this.get('/api/test', () => {
        console.log("GET TEST: ")
        return { content: "content" }
      })
    }
  })
}
