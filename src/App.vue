<template>
  <div id="app">
    <el-validate-table :data="data" :columns="columns" />
  </div>
</template>

<script>

export default {
  name: "App",
  components: {
  },
  data() {
    return {
      data:[
        {
          a:1,
          b:2
        }
      ],
      columns:[
        {
          label:'测试1',
          prop:'a'
        },
        {
          label:'测试2',
          prop:'b'
        }
      ]
    }
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
