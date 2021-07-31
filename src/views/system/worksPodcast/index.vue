<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">直播链接地址</label>
        <el-input v-model="query.url" clearable placeholder="直播链接地址" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">海报相对路径</label>
        <el-input v-model="query.imagePath" clearable placeholder="海报相对路径" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <date-range-picker
          v-model="query.beginTime"
          start-placeholder="beginTimeStart"
          end-placeholder="beginTimeStart"
          class="date-item"
        />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="直播链接地址">
            <el-input v-model="form.url" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="海报相对路径">
            <el-input v-model="form.imagePath" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="直播开始时间">
            <el-date-picker v-model="form.beginTime" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="直播创建日期">
            <el-input v-model="form.createdTime" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="id" />
        <el-table-column prop="url" label="直播链接地址" />
        <el-table-column prop="imagePath" label="海报相对路径" />
        <el-table-column prop="beginTime" label="直播开始时间" />
        <el-table-column prop="createdTime" label="直播创建日期" />
        <el-table-column v-if="checkPer(['admin','worksPodcast:edit','worksPodcast:del'])" label="操作" width="150px" align="center">
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
import crudWorksPodcast from '@/api/worksPodcast'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, url: null, imagePath: null, beginTime: null, createdTime: null }
export default {
  name: 'WorksPodcast',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '作品有关直播', url: 'api/worksPodcast', idField: 'id', sort: 'id,desc', crudMethod: { ...crudWorksPodcast }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'worksPodcast:add'],
        edit: ['admin', 'worksPodcast:edit'],
        del: ['admin', 'worksPodcast:del']
      },
      rules: {
      },
      queryTypeOptions: [
        { key: 'url', display_name: '直播链接地址' },
        { key: 'imagePath', display_name: '海报相对路径' }
      ]
    }
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
