# el-validate-table

[⬆ Back to Top](#table-of-contents)
基于 element-ui 封装的可编辑，可校验，可合并的表格

[![Build Status](https://travis-ci.com/nemoisme/el-validate-table.svg?branch=master)](https://travis-ci.com/nemoisme/el-validate-table)
[![NPM Download](https://img.shields.io/npm/dm/@nemoisme/el-validate-table.svg)](https://www.npmjs.com/package/@nemoisme/el-validate-table)
[![NPM Version](https://img.shields.io/npm/v/@nemoisme/el-validate-table.svg)](https://www.npmjs.com/package/@nemoisme/el-validate-table)
[![NPM License](https://img.shields.io/npm/l/@nemoisme/el-validate-table.svg)](https://github.com/nemoisme/el-validate-table/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/nemoisme/el-validate-table/pulls)
[![Automated Release Notes by gren](https://img.shields.io/badge/%F0%9F%A4%96-release%20notes-00B2EE.svg)](https://github-tools.github.io/github-release-notes/)

![07月-09-2019](./assets/demo2.png)

## Table of Contents

* [Introduction](#introduction)
* [Feature](#feature)
* [Demo](#demo)
* [Install](#install)
* [Example](#example)
* [Reference](#reference)
* [Contributors](#contributors)
* [License](#license)

## Introduction

**WHAT**

`el-validate-table` 是基于[element-ui](https://github.com/ElemeFE/element)封装的**表格组件**,采用 vue 中的 render 函数写法，支持高度的可扩展性，可复用性，通过 JSON 配置即可实现，表格中的单元格编辑校验，多级表头，单元格合并，行，列拖拽等复杂功能。

**WHY**

基于 2019-4 月初某项目背景，项目中含有大量的多级表头，单元格编辑，以及少许的拖拽表格。项目初期，tempalte 中存在大量的结构代码，难以迭代，难以维护，基于此背景，为了节省时间，减少重复冗余的代码，让开发者专注业务逻辑。

<!-- **THANSK** -->

[⬆ Back to Top](#table-of-contents)

## Feature

* 只需进行简单的配置，即可实现单元格编辑（可校验）,多级表头，单元格合并等复杂功能
* 支持单元格自定义校验

[⬆ Back to Top](#table-of-contents)

## Demo

1.基本用法

```vue
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
              config: params => {
                return {
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
                }
              }
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
            const {roIndex} = params
            if (roIndex == 0) {
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
```

[⬆ Back to Top](#table-of-contents)

<!-- * [doc and online demo](https://nemoisme.github.io/el-validate-table/) -->

## Install

[⬆ Back to Top](#table-of-contents)

## Example

[⬆ Back to Top](#table-of-contents)

[⬆ Back to Top](#table-of-contents)

## Attributes

| params  | explain                                                    | type  |
| ------- | ---------------------------------------------------------- | ----- |
| data    | 匹配的数据，与 element-ui,el-table 用法相同                | Array |
| columns | 列配置，支持 el-table-column 所有的配置项，格外扩展 config | Array |

## Reference

[⬆ Back to Top](#table-of-contents)

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

<!-- prettier-ignore -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

[⬆ Back to Top](#table-of-contents)

## License

[MIT](./LICENSE)
