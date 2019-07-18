<script>
import {get, set} from 'loadsh'
import mixinOptionExtensions from './mixin-package-option.js'
let len = 0 // 全局变量  更正列索引

/**
 * 转换为大小驼峰命名
 * abc-efg => abcEfg
 */
export const toCamelCase = str => {
  return str.indexOf('-') !== -1
    ? str.replace(/-([a-zA-Z])/g, ($0, $1) => $1.toUpperCase())
    : str
}

export default {
  name: 'validate-column',
  mixins: [mixinOptionExtensions],
  props: {
    columns: {
      type: Array,
      required: true
    },
    data: Array
  },
  data() {
    return {}
  },
  render(h) {
    return h('div', this.renderColumns(h, this.columns))
  },
  methods: {
    renderColumns(h, columns) {
      return (
        columns &&
        columns.map((col, index) => {
          let columnIndex
          len = col.children ? len : len + 1
          columnIndex = len - 1
          // console.log(col, this.columns, '对比1')
          const scopedSlots = {
            default: scope => {
              
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
                event = {}
              } =
                typeof col.config == 'function'
                  ? !!col.config(params) && col.config(params)
                  : {}

              const ele = type || col.render
              const isFormItem = Array.isArray(rules) && rules.length > 0

              return !!ele
                ? h(
                    isFormItem ? 'el-form-item' : 'div',
                    {
                      props: {
                        prop: `data[${scope.$index}].${col.prop}`,
                        rules
                      }
                    },
                    [
                      h(
                        ele,
                        {
                          props: Object.assign({}, attrs, {
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
                      scope.column,
                      get(scope.row, col.prop),
                      scope.$index
                    )) ||
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
            col.children &&
              col.children.length !== 0 &&
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
