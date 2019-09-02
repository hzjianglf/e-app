import formPage from '/src/render/formPage'
import http from '/src/http/index.js'
import util from '/src/libs/util.js'

formPage({
  // 提交地址
  url: '/business/stockout',

  // 是否带有明细
  detail: true,

  // 权限按钮位置
  btnPos: 20,

  // 业务对象
  bizObj: [
    {
      label: '领用单号',
      key: 'doc_number',
      component: 'e-input',
      disabled: true,
      placeholder: '系统自动生成'
    },
    {
      label: '领用日期',
      key: 'stockout_date',
      component: 'e-date-picker',
      necessary: true,
      format: 'yyyy-MM-dd'
    },
    {
      label: '领用人',
      key: 'stockout_person',
      component: 'e-user-chooser',
      disabled: true
    },
    {
      label: '领用部门',
      key: 'stockout_dept',
      component: 'e-dept-chooser',
      disabled: true
    },
    {
      label: '仓库',
      key: 'warehouse_id',
      component: 'e-input',
      disabled: true
    },
    {
      label: '状态',
      key: 'doc_status_text',
      component: 'e-input',
      disabled: true
    },
    {
      label: '备注',
      key: 'remark',
      component: 'e-text-area',
      maxlength: 200
    },
    {
      label: '耗材',
      key: 'children',
      component: 'e-subform',
      disabled: true,
      subform: [
        {
          label: '耗材名称',
          key: 'cons_name',
          component: 'e-input',
          disabled: true
        },
        {
          label: '规格型号',
          key: 'cons_standard',
          component: 'e-input',
          disabled: true
        },
        {
          label: '计量单位',
          key: 'cons_unit',
          component: 'e-input',
          disabled: true
        },
        {
          label: '请购数量',
          key: 'apply_qty',
          component: 'e-input',
          disabled: true
        },
        {
          label: '领用数量',
          key: 'stockout_qty',
          component: 'e-input',
          number: true,
          necessary: true
        }
      ]
    }
  ],

  // 钩子函数-初始化前
  beforeOnLoad(query) {
    return new Promise((resolve, reject) => {
      if (this.list && this.list.data) {
        // 当前状态不可编辑
        if (this.list.data.id && this.list.data.doc_status !== 'draft') {
          this.setData({ disabled: true })
        }
        // 获取耗材明细
        http.get({ url: '/business/stockout-detail', params: { params: JSON.stringify({ pid: this.list.data.id }) } }).then(res => {
          if (res.status === 0) {
            this.list.data.children = res.data.map(item => {
              item.cons_id = { id: item.cons_id, cons_name: item.cons_name }
              return item
            })
            resolve()
          } else {
            util.ddToast({ type: 'success', text: res.message || '耗材明细请求失败' })
            resolve()
          }
        }).catch(err => { resolve() })
      } else { resolve() }
    })
  },

  // 保存前处理
  beforeSubmit(data) {
    data.stockout_person = JSON.stringify(data.stockout_person[0])
    data.stockout_dept = JSON.stringify(data.stockout_dept[0])
    return Promise.resolve()
  },

  methods: {
    // 提交
    handleCheck() {
      this.handlePost({
        url: '/business/stockout/agree',
        autoCheck: true,
        successText: '审核成功',
        failText: '审核失败'
      })
    }
  }
})