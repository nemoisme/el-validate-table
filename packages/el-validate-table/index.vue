<script>
import {get, set} from 'lodash'
import FormLib from 'element-ui/lib/form'
import TableLib from 'element-ui/lib/table'
import mixinOptionExtensions from './shared/mixin-package-option.js'
import {toCamelCase, VALIDATE_FIELD} from './shared/utils.js'
import {TABLE_FORM_MIX} from './shared/constant.js'
import {Message,Table,TableColumn,Form,FormItem} from 'element-ui'
let len = 0 // 全局变量  更正列索引

export default {
  name: 'el-validate-table',
  mixins: [TABLE_FORM_MIX, mixinOptionExtensions],
  components: {
    'el-table':Table,
    'el-table-column':TableColumn,
    'el-form':Form,
    'el-form-item':FormItem
  },
  props: Object.assign({}, FormLib.props, TableLib.props, {
    data: Array,
    columns: Array
  }),
  data() {
    return {
      spanObject: {},
      customSpanMethod: () => {}
    }
  },
  watch: {
    data: {
      handler: 'rowspan',
      immediate: true
    },
    columns: {
      handler: 'rowspan',
      immediate: true
    }
  },
  render(h) {
    const slots = Object.keys(this.$slots)
      .reduce((arr, key) => {
        arr = arr.concat(this.$slots[key])
        return arr
      }, [])
      .map(vnode => {
        vnode.context = this._self
        return vnode
      })

    return (
      <el-form
        ref="elForm"
        {...{
          props: {model: {data: this.data}, ...this.attrs},
          on: {
            ...this.$listeners,
            validate: (prop, valid, msg) => {
              if (!valid) {
                this.$message.warning(msg)
              }
            }
          }
        }}
      >
        <el-table
          ref="elTable"
          {...{
            props: {
              data: this.data,
              'span-method': this.customSpanMethod,
              ...this.$attrs
            },
            on: this.$listeners
          }}
        >
          {this.renderColumns(h, this.columns).concat(slots)}
        </el-table>
      </el-form>
    )
  },
  async mounted() {
    this.customSpanMethod =
      this.$attrs['custom-merge'] ||
      this.$attrs['span-method'] ||
      this.$attrs.spanMethod ||
      this.arraySpanMethod
    await this.$nextTick(() => {})

    // 同步form,table中的mehods
    const methods = Object.assign({}, Form.methods, Table.methods)
    Object.keys(methods).forEach(key => {
      if (this.$refs.elForm.hasOwnProperty(key)) {
        this[key] = this.$refs.elForm[key]
      } else {
        this[key] = this.$refs.elTable[key]
      }
    })
  },
  methods: {
    rowspan() {
      const data = this.data
      const getSpanObject = (arr, con = {}) => {
        return arr.reduce((sum, col) => {
          if (col.children && col.children.length) {
            getSpanObject(col.children, sum)
            return sum
          }

          if (!col.isMerge) {
            return sum
          }

          sum[col.prop] = []

          let position
          let spanArr = sum[col.prop]

          Array.isArray(data) &&
            data.forEach((item, index) => {
              if (index === 0) {
                spanArr.push(1)
                position = 0
              } else {
                if (data[index][col.prop] === data[index - 1][col.prop]) {
                  spanArr[position] += 1
                  spanArr.push(0)
                } else {
                  spanArr.push(1)
                  position = index
                }
              }
            })
          return sum
        }, con)
      }

      this.spanObject = getSpanObject(this.columns)
    },
    arraySpanMethod({row, column, rowIndex, columnIndex}) {
      const spanArr = this.spanObject[column.property]
      if (spanArr) {
        const _row = spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    renderColumns(h, columns) {
      return (
        columns &&
        columns.map((col, index) => {
          let columnIndex
          len = col.children ? len : len + 1
          columnIndex = len - 1

          const scopedSlots = {
            default: scope => {
              // console.log(scope, 'scope')
              const params = {
                rowIndex: scope.$index,
                row: scope.row,
                columnIndex,
                prop: col.prop,
                column: scope.column
              }

              const {
                type = null,
                rules = [],
                options = [],
                attrs = {},
                style = {},
                event = {},
                component,
                props
              } =
                typeof col.config == 'function'
                  ? !!col.config(params) && col.config(params)
                  : {}

              const ele =
                type || (typeof component == 'object' && component) || null

              const isFormItem = Array.isArray(rules) && rules.length > 0

              return !!ele
                ? h(
                    isFormItem ? 'el-form-item' : 'div',
                    {
                      props: {
                        prop: `data[${scope.$index}].${col.prop}`,
                        rules
                      },
                      style: {
                        marginBottom: 0
                      }
                    },
                    [
                      h(
                        ele,
                        {
                          props: Object.assign({}, attrs, props, {
                            value: get(scope.row, col.prop)
                          }),
                          attrs: Object.assign({}, attrs),
                          style,
                          on: Object.assign(
                            {},
                            this.$listeners,
                            {
                              input: val => {
                                get(scope.row, col.prop) === undefined
                                  ? this.$set(scope.row, col.prop, val)
                                  : set(scope.row, col.prop, val)
                              },
                              change: val => {
                                this.$emit('cell-change', params)
                              }
                            },
                            event
                          )
                        },
                        [this.renderOps(type, options)]
                      )
                    ]
                  )
                : (col.formatter &&
                    col.formatter(
                      scope.row,
                      scope,
                      scope.column,
                      get(scope.row, col.prop),
                      scope.$index
                    )) ||
                    (typeof col.render == 'function' &&
                      col.render(h, params)) ||
                    get(scope.row, col.prop)
            }
          }
          return h(
            'el-table-column',
            {
              props: Object.assign({}, this.$attrs, col),
              key: index,
              scopedSlots
            },
            this.renderColumns(h, col.children)
          )
        })
      )
    },
    renderOps(type, options) {
      const optType = type && type.indexOf('el-') === 0 ? type.slice(3) : type
      let optRenderer = optType && this[`${toCamelCase(optType)}_opt`]
      if (typeof optRenderer === 'function' && Array.isArray(options)) {
        return options.map(optRenderer)
      }
    }
  }
}
</script>
