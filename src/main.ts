import { createSSRApp } from "vue";
import App from "./App.vue";

// import { Http } from 'lwu-request'
// const requestUrl = 'https://jsonplaceholder.typicode.com'
// const http = new Http({
//   baseUrl: {
//     dev: requestUrl,
//     pro: requestUrl
//   }
// });
// uni.$http = http;

export function createApp() {
  const app = createSSRApp(App);
  return {
    app,
  };
}
