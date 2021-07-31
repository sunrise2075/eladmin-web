<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <!--          <el-form-item label="自增主键">-->
          <!--            <el-input v-model="form.id" style="width: 370px;" />-->
          <!--          </el-form-item>-->
          <el-form-item label="作者姓名">
            <el-input v-model="form.authorName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="作者手机号">
            <el-input v-model="form.authorMobile" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="作品描述">
            <el-input v-model="form.selfDescription" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="作品种类: 0. 文字类  1. 图片类  2. 视频类">
            <el-input v-model="form.type" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="作品状态：1. 提交  2. 审核中  3. 审核通过  4. 审核拒绝 5. 获奖">
            <el-input v-model="form.lifeStatus" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建日期">
            <el-input v-model="form.createdDate" style="width: 370px;" />
          </el-form-item>
          <!--          <el-form-item label="创建人">-->
          <!--            <el-input v-model="form.createdBy" style="width: 370px;" />-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="更新人">-->
          <!--            <el-input v-model="form.updatedBy" style="width: 370px;" />-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="更新日期">-->
          <!--            <el-input v-model="form.updatedDate" style="width: 370px;" />-->
          <!--          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="自增主键" />
        <el-table-column prop="authorName" label="作者姓名" />
        <el-table-column prop="authorMobile" label="作者手机号" />
        <el-table-column prop="selfDescription" label="作品描述" />
        <el-table-column prop="type" label="种类">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 0">文字类</span>
            <span v-if="scope.row.type == 1">图片类</span>
            <span v-if="scope.row.type == 2">视频类</span>
          </template>
        </el-table-column>
        <el-table-column prop="lifeStatus" label="状态">0
          <template slot-scope="scope">
            <span v-if="scope.row.lifeStatus == 1">已提交</span>
            <span v-if="scope.row.lifeStatus == 2">审核中</span>
            <span v-if="scope.row.lifeStatus == 3">审核通过</span>
            <span v-if="scope.row.lifeStatus == 4">审核拒绝</span>
            <span v-if="scope.row.lifeStatus == 5">获奖</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdDate" label="创建日期" />
        <!--        <el-table-column prop="createdBy" label="创建人" />-->
        <!--        <el-table-column prop="updatedBy" label="更新人" />-->
        <!--        <el-table-column prop="updatedDate" label="更新日期" />-->
        <el-table-column v-if="checkPer(['admin','worksInfo:edit','worksInfo:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudWorksInfo from '@/api/worksInfo'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, authorName: null, authorMobile: null, selfDescription: null, type: null, lifeStatus: null, createdDate: null, createdBy: null, updatedBy: null, updatedDate: null }
export default {
  name: 'WorksInfo',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '作品信息', url: 'api/worksInfo', idField: 'id', sort: 'id,desc', crudMethod: { ...crudWorksInfo }})
  },
  data() {
    return {
      permission: {
        edit: ['admin', 'worksInfo:edit'],
        del: ['admin', 'worksInfo:del']
      },
      rules: {
      }}
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
