<template>
  <h1>Trustheprocess</h1>
  <el-row :span="24">
    <el-col :span="4">
      <el-button type="success" @click="clickHandle('home')">Home</el-button>
      <el-button type="primary" @click="clickHandle('about')">About</el-button>
    </el-col>
    <el-col :span="20">
      <router-view></router-view>
    </el-col>
  </el-row>
  <!--
  <ul>
    <li><router-link to="/home">Home</router-link></li>
    <li><router-link to="/about">About</router-link></li>
  </ul> -->
</template>

<script>
import { ElButton } from "element-plus"
export default {
  name: 'App',
  components: {
    ElButton,
  },
  methods: {
    clickHandle (val) {
      this.$router.push(`/${val}`)
    }
  }


}
</script>

<style>
.subtitle {
  color: #007aff;
}
</style>
