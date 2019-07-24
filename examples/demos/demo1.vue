<template>
  <div class="validate-table-test">
    <el-validate-table :columns="columns" :data="data"></el-validate-table>
  </div>
</template>
<script>
export default {
  name: 'validate-table-test',
  data() {
    return {
      data: [
        {
          merge: 'DC123',
          date: '2014-10-21',
          name: '尼莫',
          sex: '男',
          old: 23,
          a: '1',
          b: '耒阳'
        },
        {
          merge: 'DC123',
          date: '2014-10-21',
          name: '安娜',
          sex: '女',
          old: 22,
          a: '2',
          b: '广州'
        }
      ],
      columns: [
        {
          prop: 'merge',
          label: '合并测试',
          isMerge: true
        },
        {
          prop: 'date',
          label: '日期',
          isMerge: true
        },
        {
          prop: 'name',
          label: '姓名'
        },
        {
          prop: 'sex',
          label: '性别'
        },
        {
          prop: 'test',
          label: '省市区域',
          children: [
            {
              prop: 'a',
              label: '省',
              config: params => ({
                  type: 'el-select',
                  rules: [
                    {
                      required: true,
                      message: '不能为空',
                      trigger: 'change'
                    }
                  ],
                  options: [
                    {
                      value: '',
                      label: '全部'
                    },
                    {
                      value: '1',
                      label: '湖南'
                    },
                    {
                      value: '2',
                      label: '广东'
                    }
                  ]
                })
            },
            {
              prop: 'b',
              label: '市'
            }
          ]
        },
        {
          prop: 'old',
          label: '年龄',
          config: params => {
            const {rowIndex} = params
            if (rowIndex == 0) {
              return {
                type: 'el-input',
                rules: [
                  {
                    required: true,
                    message: '年龄不能为空',
                    trigger: 'blur'
                  },
                  {
                    pattern: /^[1-9]\d*$/,
                    message: '只能填写正整数',
                    trigger: 'blur'
                  }
                ]
              }
            }
          }
        }
      ]
    }
  }
}
</script>