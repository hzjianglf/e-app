import util from '/src/libs/util.js'

let app = getApp()

Component({
  // 接收参数
  props: {
    model: {}
  },
  // 挂载
  didMount() {
    this.init(this.props.model)
  },
  methods: {
    // 删除已选部门
    handleDelete(event) {
      let i = event.currentTarget.dataset.itemIndex
      let pickedDepts = `${this.path}.value`
      this.$page.$spliceData({
        [pickedDepts]: [i, 1]
      })
    },
    // 打开部门界面
    handleAdd() {
      if (this.props.model.disabled) {
        return
      }
      dd.chooseDepartments({
        title: `选择${this.props.model.label}`,
        multiple: this.props.model.multiple,
        limitTips: `超过限定部门数${this.props.model.max}`,
        maxDepartments: this.props.model.max,
        //已选部门
        pickedDepartments: this.props.model.value.map(row => row.id),
        //不可选部门
        disabledDepartments: this.props.model.depts.disabledDepts,
        //必选部门（不可取消选中状态）
        requiredDepartments: this.props.model.depts.requiredDepts,
        permissionType: "GLOBAL",
        success: (res) => {
          let pickedDepts = `${this.path}.value`
          this.$page.$spliceData({
            [pickedDepts]: [0, this.props.model.value.length, ...res.departments]
          })
          app.emitter.emit(`${this.props.model.formId}`, this.props.model.key)
        },
        fail: (err) => {
          console.error(err)
        }
      })
    },
    // 初始化model的属性
    init(model) {
      // 配置path
      this.path = model.path !== undefined ? model.path : ''
      if (model.sfi !== undefined) {
        this.path = `bizObj[${model.ci}].children[${model.sfi}][${model.sci}]`
      } else if (model.ci !== undefined) {
        this.path = `bizObj[${model.ci}]`
      }
      // dept-chooser对象
      let deptChooser = {
        max: 100,
        value: [],
        label: '',
        status: '',
        multiple: true,
        disabled: false,
        necessary: false,
        notice: model.necessary ? '不能为空' : '',
        placeholder: model.necessary ? '必填' : ''
      }
      // 补全属性
      model.depts = Object.assign({
        disabledDepts: [],
        requiredDepts: []
      }, model.depts)
      this.$page.setData({
        [this.path]: Object.assign(deptChooser, model)
      })
    }
  }
})