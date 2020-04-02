<script>
import FormLib from "element-ui/lib/form";
import TableLib from "element-ui/lib/table";
import get from "lodash.get";
import set from "lodash.set";
import mixinOptionExtensions from "./mixin-package-option.js";
import { Form, FormItem, Table, TableColumn } from "element-ui";
let len = 0; // 全局变量  更正列索引

/**
 * 转换为大小驼峰命名
 * abc-efg => abcEfg
 */
const toCamelCase = str => {
  return str.indexOf("-") !== -1
    ? str.replace(/-([a-zA-Z])/g, ($0, $1) => $1.toUpperCase())
    : str;
};

export default {
  name: "el-validate-table",
  components: {
    "el-form": Form,
    "el-form-item": FormItem,
    "el-table": Table,
    "el-table-column": TableColumn
  },
  mixins: [mixinOptionExtensions],
  props: {
    data: Array,
    columns: Array,
    isDrag: Boolean
  },
  data() {
    return {
      spanObject: {},
      customSpanMethod: () => {}
    };
  },
  watch: {
    data: {
      handler: "rowspan",
      immediate: true
    },
    columns: {
      handler: "rowspan",
      immediate: true
    }
  },
  render(h) {
    const slots = Object.keys(this.$slots)
      .reduce((arr, key) => {
        arr = arr.concat(this.$slots[key]);
        return arr;
      }, [])
      .map(vnode => {
        vnode.context = this._self;
        return vnode;
      });

    return h(
      "el-form",
      {
        props: {
          model: {
            data: this.data
          }
        },
        ref: "elForm"
      },
      [
        h(
          "el-table",
          {
            props: Object.assign({}, this.$attrs, {
              data: this.data,
              "span-method": this.customSpanMethod
            }),
            on: { ...this.$listeners },
            ref: "elTable"
          },
          this.renderColumns(h, this.columns).concat(slots)
        )
      ]
    );
  },
  async mounted() {
    const columnsMapByprop = this.columns.reduce((cur, col) => {
      cur[col.prop] = col;
      return cur;
    }, {});
    this.customSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
      const curCol = columnsMapByprop[column.property];
      const mergeFunc =
        this.$attrs["span-method"] ||
        this.$attrs.spanMethod ||
        this.arraySpanMethod;
      return mergeFunc({ row, column, rowIndex, columnIndex });
    };

    await this.$nextTick(() => {});

    // 同步form,table中的mehods
    const methods = Object.assign({}, FormLib.methods, TableLib.methods);
    Object.keys(methods).forEach(key => {
      if (this.$refs.elForm.hasOwnProperty(key)) {
        this[key] = this.$refs.elForm[key];
      } else {
        this[key] = this.$refs.elTable[key];
      }
    });
  },
  methods: {
    rowspan() {
      const data = this.data;
      const getSpanObject = (arr, con = {}) => {
        return arr.reduce((sum, col) => {
          if (col.children && col.children.length) {
            getSpanObject(col.children, sum);
            return sum;
          }

          if (!col.colMerge) {
            return sum;
          }

          sum[col.prop] = [];

          let position;
          let spanArr = sum[col.prop];

          Array.isArray(data) &&
            data.forEach((item, index) => {
              if (index === 0) {
                spanArr.push(1);
                position = 0;
              } else {
                if (data[index][col.prop] === data[index - 1][col.prop]) {
                  spanArr[position] += 1;
                  spanArr.push(0);
                } else {
                  spanArr.push(1);
                  position = index;
                }
              }
            });
          return sum;
        }, con);
      };

      this.spanObject = getSpanObject(this.columns);
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      const spanArr = this.spanObject[column.property];
      if (spanArr) {
        const _row = spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
      // if (rowIndex % 2 === 0) {
      //   if (columnIndex === 1) {
      //     return [3, 2];
      //   }
      // }
    },
    rowColMerge({ row, column, rowIndex, columnIndex }) {},
    renderColumns(h, columns) {
      return (
        columns &&
        columns.map((col, index) => {
          let columnIndex;
          len = col.children ? len : len + 1;
          columnIndex = len - 1;
          const scopedSlots = {
            default: scope => {
              const params = {
                rowIndex: scope.$index,
                row: scope.row,
                columnIndex,
                prop: col.prop,
                column: scope.column
              };

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
                typeof col.config == "function"
                  ? !!col.config(params) && col.config(params)
                  : {};

              const ele =
                (type && "el-" + type) ||
                (typeof component == "object" && component) ||
                null;
              const isFormItem = Array.isArray(rules) && rules.length > 0;

              return !!ele
                ? h(
                    isFormItem ? "el-form-item" : "div",
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
                                  : set(scope.row, col.prop, val);
                              },
                              change: val => {
                                this.$emit("cell-change", params);
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
                    (typeof col.render == "function" &&
                      col.render(h, params)) ||
                    get(scope.row, col.prop);
            }
          };
          return h(
            "el-table-column",
            {
              props: Object.assign({}, this.$attrs, col),
              key: index,
              scopedSlots:
                col.type && col.type == "selection" ? null : scopedSlots
            },
            this.renderColumns(h, col.children)
          );
        })
      );
    },
    renderOps(type, options) {
      const optType = type && type.indexOf("el-") === 0 ? type.slice(3) : type;
      let optRenderer = optType && this[`${toCamelCase(optType)}_opt`];
      if (typeof optRenderer === "function" && Array.isArray(options)) {
        return options.map(optRenderer);
      }
    }
  }
};
</script>
<style>
.el-table .el-form-item {
  margin-bottom: 0;
}
.el-table .is-error {
  animation: errvalid 0.5s;
  animation-fill-mode: forwards;
}
@keyframes errvalid {
  from {
    margin-bottom: 0;
  }
  to {
    margin-bottom: 22px;
  }
}
.el-table .is-success {
  animation: sucvalid 0.5s;
  animation-fill-mode: forwards;
}

@keyframes sucvalid {
  from {
    margin-bottom: 22px;
  }
  to {
    margin-bottom: 0;
  }
}
</style>
