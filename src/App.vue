<template>
  <div class="validate-table-demo1">
    <h2>validate-table-demo1</h2>
    <el-validate-table :data="data" :columns="columns" ref="validateTable" border />
    <el-button type="primary" @click="btnValidate">校验触发</el-button>
  </div>
</template>
<script>
export default {
  name: "validate-table-demo1",
  data() {
    return {
      data: [
        {
          name: "Nemo",
          sex: "男",
          col: 1,
          row: 1
        },
        {
          name: "Anna",
          sex: "女",
          col: 1,
          row: 1
        },
        {
          name: "Jack",
          sex: "男",
          col: 1,
          row: 1
        },
        {
          row: "row合并",
          row: 1
        },
        {
          col: "col合并",
          col: 1
        }
      ],
      columns: [
        {
          label: "姓名",
          prop: "name",
          config: params => {
            return ({
              type: "input",
              rules: [
                {
                  required: true,
                  message: "不能为空",
                  trigger: "blur"
                }
              ]
            });
          }
        },
        {
          label: "性别",
          prop: "sex"
        },
        {
          label: "行合并",
          prop: "row",
          colMerge: true
        },
        {
          label: "列合并",
          prop: "col",
          colMerge: true
        }
      ]
    };
  },
  methods: {
    btnValidate() {
      this.$refs.validateTable.validate(valid => {});
    }
  }
};
</script>

