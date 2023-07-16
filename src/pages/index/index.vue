<template>
  <view class="content">
    <view class="list" v-show="onShow">
      <view class="item" v-for="v in userList" :key="v.id">
        <navigator :url="`./show?id=${v.id}`">姓名：{{v.name}}</navigator>
      </view>
    </view>
    <view class="list" v-show="onShow">
      <view class="item" v-for="v in postList" :key="v.id">
        <navigator :url="`./show?id=${v.id}`">标题：{{v.title}}</navigator>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Http, type BeforeRequestCallbackResult, type AfterRequestCallbackResult } from 'lwu-request'

const requestUrl = 'https://jsonplaceholder.typicode.com'
const http = new Http({
  baseUrl: {
    dev: requestUrl,
    pro: requestUrl
  },
  before: (res: BeforeRequestCallbackResult) => {
    // console.log(res, '请求前拦截');
    http.setHeader({
      ...res.header,
      // test: 222
    })
  },
  after: (res: AfterRequestCallbackResult) => {
    // console.log(res, '请求后拦截');
  },
  networkExceptionHandle: () => {
    console.log('断网了啊');
  },
  errorHandleByCode: (code) => {
    console.log(code);
    if (code === 408) {
      console.log('请求超时了');
    } else if (code === 1009) {
      console.log('客户端断网了');
    }
  },
  debug: false,
  // timeout: 10,
  takeTokenMethod: 'body',
  takenTokenKeyName: 'user_token',
  tokenValue: () => {
    return new Promise((resolve, reject) => {
      // 模拟原来的token
      resolve('111111');
    });
  },
  xhrCodeName: 'code',
  tokenExpiredCode: 0,
  tokenExpiredCodeType: 'apiResponseCode',
  autoRefreshToken: true,
  refreshTokenHandle: (refreshToken?: string) => {
    // 打印旧的Token
    console.log(refreshToken, '旧的token');
    return new Promise((resolve, reject) => {
      // 模拟获取新的token
      resolve('BbLKVJLO6PLrPxzZeXOa67ggPmdvXywm8vU4y59HbWY=');
    });
  }
})

http
  .config({
    domain: 'https://api.kags.cn'
  })
  .post('/v1/user/userinfo')

// 清空 `domain` 防止污染后面的请求域名
http.config({
  domain: ''
});

console.log(http.uri(), '请求域名111111');

let xhr = new XMLHttpRequest();
xhr.open('post', `https://api.kags.cn/v1/user/userinfo`);
xhr.setRequestHeader("Content-Type","application/json");
xhr.timeout = 10;

xhr.ontimeout = function () {
	console.log('客户端请求超时了:xhr', xhr.status);
}

xhr.onerror = function () {
	console.log('客户端断网了:xhr', xhr.status);
}

xhr.onprogress = function () {
  console.log('LOADING', xhr.status);
};

xhr.onload = function () {
  console.log('DONE', xhr.status);
};
console.log(xhr);
xhr.send(JSON.stringify({
	a: 1,
	b: 2
}));

xhr = new XMLHttpRequest();
xhr.open('get', `${http.uri()}/posts?a=2&b=3`);
xhr.send();
// xhr.onreadystatechange = () => {
// 	console.log(xhr.readyState);
// 	console.log(xhr.getAllResponseHeaders());
// 	if (xhr.readyState === xhr.DONE) {
// 		console.log(xhr.response);
// 	}
// }

const onShow = ref(false)

// 主题列表
const postList = ref()
http.get('/posts').then(res => {
  postList.value = res
  onShow.value = true
})

// 主题详情
const postDetail = ref()
http.get('/posts/1').then(res => {
  postDetail.value = res
  onShow.value = true
})

// 用户列表
const userList = ref()
http.get('/users').then(res => {
  userList.value = res
  onShow.value = true
})

// onMounted(async () => {
//   let res1 = await http.get('/posts');
//   postList.value = res1
//   let res2 = await http.get('/posts/1');
//   postDetail.value = res2;
//   let res3 = await http.get('/users');
//   console.log(res3);
//   userList.value = res3;
//   onShow.value = true;
// })
</script>

<style lang="scss">
.content {
  .list {
    padding: 30rpx;
  }
}
</style>