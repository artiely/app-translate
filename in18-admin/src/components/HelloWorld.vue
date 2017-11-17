<style scoped>
  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }

  .layout-breadcrumb {
    padding: 10px 15px 0;
  }

  .layout-content {
    min-height: 200px;
    margin: 15px;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
  }

  .layout-content-main {
    padding: 10px;
  }

  .layout-copy {
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
  }

  .layout-menu-left {
    background: #464c5b;
  }

  .layout-header {
    height: 45px;
    background: #fff;
    box-shadow: 0 3px 1px rgba(0, 0, 0, .1);
    position: relative;
    z-index: 9;
  }

  .layout-logo-left {
    width: 90%;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
  }

  .layout-ceiling-main a {
    color: #9ba7b5;
  }

  .layout-hide-text .layout-text {
    display: none;
  }

  .ivu-col {
    transition: width .2s ease-in-out;
  }

  .spanRight {
    position: absolute;
    right: 0;
    bottom: 0;
    top: 0;
    left: 180px;
  }

  .spanRight.ss {
    left: 50px;
  }

  .spanLeft.ss {
    width: 50px;
  }

  .spanLeft {
    width: 180px;
  }
</style>
<template>
  <div class="layout" :class="{'layout-hide-text': spanLeft }" style="height: 100%">
    <Row type="flex" style="height: 100%;">
      <div :span="spanLeft" class="layout-menu-left spanLeft" :class="{'ss':spanLeft}">
        <Menu active-name="1" theme="dark" width="auto">
          <div class="layout-logo-left"></div>
          <MenuItem name="1">
            <Icon type="ios-navigate" :size="iconSize"></Icon>
            <span class="layout-text">选项 1</span>
          </MenuItem>
          <MenuItem name="2">
            <Icon type="ios-keypad" :size="iconSize"></Icon>
            <span class="layout-text">选项 2</span>
          </MenuItem>
          <MenuItem name="3">
            <Icon type="ios-analytics" :size="iconSize"></Icon>
            <span class="layout-text">选项 3</span>
          </MenuItem>
        </Menu>
      </div>
      <div :span="spanRight" class="spanRight" :class="{'ss':spanLeft}">
        <div class="layout-header">
          <Button type="text" @click="toggleClick">
            <Icon type="navicon" size="32"></Icon>
          </Button>
        </div>
        <!--<div class="layout-breadcrumb">-->
        <!--<Breadcrumb>-->
        <!--<BreadcrumbItem href="#">首页</BreadcrumbItem>-->
        <!--<BreadcrumbItem href="#">应用中心</BreadcrumbItem>-->
        <!--<BreadcrumbItem>某应用</BreadcrumbItem>-->
        <!--</Breadcrumb>-->
        <!--</div>-->
        <div class="layout-content"
             style="position:absolute;top:45px;left: 0;right: 0;bottom:0;overflow-y: scroll;margin: 0;background:#f8f8f8;">
          <Card>
            <div slot="title">
              <Button type="primary" size="small" @click.native="toJson">生成JSON</Button>
              <Button type="primary" size="small" @click.native="addOne" :disabled="admin=='guest'">新增一条</Button>
              <Input v-model="keyword" placeholder="搜索..." style="width: 300px"
                     @on-change="findData"></Input> <a @click="tips=true" style="color: red">查看提示</a>
            </div>
            <a href="#" slot="extra" @click.prevent="changeLimit">
              <Icon type="ios-loop-strong"></Icon>
            </a>
            <div>
              <Table :loading="loading" stripe border size="small" highlight-row ref="currentRowTable"
                     :columns="columns3"
                     :data="data1"></Table>
              <Page :total="count" show-sizer @on-change="onChange" @on-page-size-change="onPageSizeChange"
                    placement="top"></Page>
            </div>
          </Card>

          <Modal
            v-model="tips"
            title="提示"
            @on-cancel="cancelTip">
            <Timeline>
              <TimelineItem color="red">1.添加前先搜索是否有想同的词条已存在</TimelineItem>
              <TimelineItem color="red">2.key只支持英文字母开头可包含数字下划线和中划线</TimelineItem>
              <TimelineItem color="red">3.key不能重复</TimelineItem>
              <TimelineItem color="red">4.{msg} 为一个变量占位符，指不确定的元素在中英文中不同的位置（搜索邮件查看示例）</TimelineItem>
              <TimelineItem color="red">5.在不影响理解的情况下，尽量使用最短语句或简写（如 周一：Mo.）</TimelineItem>
              <TimelineItem color="red">6.请勿删除原有数据</TimelineItem>
            </Timeline>
          </Modal>
          <div class="layout-content-main">


            <Modal
              v-model="modal1"
              title="编辑"
              @on-ok="ok"
              @on-cancel="cancel">
              <Form :label-width="80" v-if="data1.length>0">
                <FormItem label="key">
                  <Input v-model="data1[currentIndex].key" disabled placeholder="请输入"></Input>
                </FormItem>
                <FormItem label="英文">
                  <Input v-model="data1[currentIndex].en" placeholder="请输入"></Input>
                </FormItem>
                <FormItem label="简体">
                  <Input v-model="data1[currentIndex].cn" :disabled="admin=='guest'" placeholder="请输入"></Input>
                </FormItem>
                <FormItem label="繁体">
                  <Input v-model="data1[currentIndex].tn" placeholder="请输入"></Input>
                </FormItem>
              </Form>
            </Modal>

            <Modal
              v-model="modal_add"
              title="新增"
              @on-ok="addData"
              @on-cancel="cancel">
              <Form ref="add" :model="add" :rules="ruleValidate" :label-width="80">
                <FormItem label="key" prop="key">
                  <Input v-model="add.key" placeholder="请输入"></Input>
                </FormItem>
                <FormItem label="英文" prop="en">
                  <Input v-model="add.en" placeholder="请输入"></Input>
                </FormItem>
                <FormItem label="简体" prop="cn">
                  <Input v-model="add.cn" placeholder="请输入"></Input>
                </FormItem>
                <FormItem label="繁体" prop="tn">
                  <Input v-model="add.tn" placeholder="请输入"></Input>
                </FormItem>
              </Form>
            </Modal>
          </div>
        </div>
        <div class="layout-copy">
          2011-2016 &copy; artiely
        </div>
      </div>
    </Row>
  </div>
</template>
<script>
  import dataJson from '../output'
  import axios from 'axios'
  console.log(dataJson)
  // 处理数据
  // 1获取变量key
  var keys = Object.keys(dataJson.EN.message)
  console.log(keys)
  var values = Object.values(dataJson.EN.message)
  var values2 = Object.values(dataJson.CN.message)
  var values3 = Object.values(dataJson.TN.message)
  console.log(values)
  var arr = values.map((item, i) => {
    return {
      key: keys[i],
      en: item,
      cn: values2[i],
      tn: values3[i]
    }
  })
  console.log(arr)
  export default {
    data () {
      return {
        loading: false,
        tips: true,
        spanLeft: false,
        spanRight: 19,
        modal1: false,
        currentIndex: 0,
        url: '',
        columns3: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: 'key',
            key: 'key'
          },
          {
            title: '英文',
            key: 'en'
          },
          {
            title: '中文简体',
            key: 'cn'
          },
          {
            title: '中文繁体',
            key: 'tn'
          },
          {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 150,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.show(params.index)
                    }
                  }
                }, '编辑'),
                h('Poptip', {
                  props: {
                    confirm: true,
                    title: '您确认删除此条数据?将有可能导致程序错误',
                    transfer: true
                  },
                  on: {
                    'on-ok': () => {
                      this.deleteData()
                    }
                  }
                }, [
                  h('Button', {
                    style: {
                      margin: '0 5px',
                      color: '#f00'
                    },
                    props: {
                      size: 'small',
                      type: 'text',
                      placement: 'top',
                      loading: false,
                      disabled: this.admin === 'guest'
                    },
                    on: {
                      click: () => {
                        this.removeData(params.index)
                      }
                    }
                  }, '删除')
                ])
              ])
            }
          }
        ],
        data1: [],
        page: 1,
        limit: 10,
        count: 0,
        modal_add: false,
        keyword: '',
        admin: 'guest',
        add: {
          key: '',
          en: '',
          cn: '',
          tn: ''
        },
        ruleValidate: {
          key: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {pattern: /^[a-zA-Z][a-zA-Z0-9_-]*$/, message: '英文字母开头可包含数字字母下划线和中划线'},
            {
              validator: (rule, value, callback) => {
                axios({
                  url: `/local/key`,
                  method: 'get',
                  params: {keyword: this.add.key}
                }).then(res => {
                  if (res.data.data) {
                    var key = res.data.data.key
                    key = key.toLowerCase()
                    if (value.toLowerCase() === key) {
                      callback(new Error('已存在相似key'))
                    } else {
                      callback()
                    }
                  } else {
                    callback()
                  }
                })
              }
            }
          ],
          en: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          cn: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          tn: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      iconSize () {
        return this.spanLeft ? 24 : 14
      }
    },
    created () {
      this._getData()
      if (window.sessionStorage.admin === 'guest') {
        this.admin = 'guest'
      } else if (window.sessionStorage.admin === 'admin') {
        this.admin = 'admin'
      } else {
        this.$router.push('/')
      }
      console.log(window.sessionStorage.tips)

      if (window.sessionStorage.tips === 'false') {
        this.tips = false
      }
    },
    methods: {
      ok () {
        this._updateData()
      },
      cancelTip () {
        this.tips = false
        window.sessionStorage.tips = false
      },
      cancel () {},
      show (index) {
        this.modal1 = true
        this.currentIndex = index
      },
      toggleClick () {
        this.spanLeft = !this.spanLeft
      },
      addOne () {
        this.modal_add = true
      },
      addData () {
        axios({
          url: `/local/add`,
          method: 'post',
          data: this.add
        }).then(res => {
          this.$Message.info(res.data.msg)
          this._getData()
          this.add = {
            key: '',
            en: '',
            cn: '',
            tn: ''
          }
        })
      },
      removeData (index) {
        this.currentIndex = index
      },
      deleteData () {
        axios({
          url: `/local/delete`,
          method: 'delete',
          data: this.data1[this.currentIndex]
        }).then(res => {
          this.$Message.info(res.data.msg)
          this._getData()
        })
      },
      findData () {
        axios({
          url: `/local/repeat`,
          method: 'get',
          params: {keyword: this.keyword}
        }).then(res => {
          console.log(res)
          this.data1 = res.data.data
        })
      },
      _getData () {
        this.loading = true
        axios({
          url: `/local/${this.page}/${this.limit}`,
          method: 'get'
        }).then(res => {
          this.loading = false
          this.data1 = res.data.data
          this.count = res.data.count
        })
      },
      _updateData () {
        let data = this.data1[this.currentIndex]
        axios({
          url: `/local/`,
          method: 'put',
          data: data
        }).then(res => {
          if (res.data.code === 0) {
            this.$Message.info(res.data.msg)
          }
        })
      },
      onChange (page) {
        this.page = page
        this._getData()
      },
      onPageSizeChange (limit) {
        this.limit = limit
        this._getData()
      },
      toJson () {
        axios({
          url: `/local/all`,
          method: 'get'
        }).then(res => {
          if (res.data.code === 0) {
            let data = res.data.data
            this.url = data
            console.log(data)
            window.location.href = data
          }
        })
      }
    }
  }
</script>
