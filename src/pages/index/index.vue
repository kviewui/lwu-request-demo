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
import { Http } from 'lwu-request'

const requestUrl = 'https://jsonplaceholder.typicode.com'
const http = new Http({
  baseUrl: {
    dev: requestUrl,
    pro: requestUrl
  }
})

const onShow = ref(false)

// 主题列表
const postList = ref()
http.get('/posts', {}, {
  task_id: '1'
}).then(res => {
  postList.value = res
  onShow.value = true
})

// 主题详情
const postDetail = ref()
http.get('/posts/1', {}, {
  task_id: '2'
}).then(res => {
  postDetail.value = res
  onShow.value = true
})

// 用户列表
const userList = ref()
http.get('/users', {}, {
  task_id: '3'
}).then(res => {
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