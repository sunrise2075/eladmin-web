<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">直播链接地址</label>
        <el-input
          v-model="query.url"
          class="filter-item"
          clearable
          placeholder="直播链接地址"
          style="width: 185px;"
          @keyup.enter.native="crud.toQuery"/>
        <label class="el-form-item-label">海报相对路径</label>
        <el-input
          v-model="query.imagePath"
          class="filter-item"
          clearable
          placeholder="海报相对路径"
          style="width: 185px;"
                  @keyup.enter.native="crud.toQuery"/>
        <rrOperation :crud="crud"/>
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission"/>
      <!--表单组件-->
      <el-dialog
        :before-close="crud.cancelCU"
        :close-on-click-modal="false"
        :title="crud.status.title"
        :visible.sync="crud.status.cu > 0"
        width="500px">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="small">
          <el-form-item label="id" style="display: none;">
            <el-input v-model="form.id" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="直播链接地址">
            <el-input v-model="form.url" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="海报相对路径">
            <el-input v-model="form.imagePath" style="width: 350px;" type="text"/>
            <el-upload
              :before-remove="removeFilePath"
              :headers="headers"
              :limit="limit"
              :on-exceed="exceedFilePath"
              :on-success="saveFilePath"
              :action=" baseFilePathProd + '/api/worksPodcast/uploadBanner'"
              class="upload-demo"
              drag
              multiple>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="直播开始时间">
            <el-date-picker v-model="form.beginTime" style="width: 370px;" type="datetime"/>
          </el-form-item>
          <el-form-item label="直播创建日期">
            <el-date-picker v-model="form.createdTime" style="width: 370px;" type="datetime"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="crud.loading"
        :data="crud.data"
        size="small"
        style="width: 100%;"
        @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55"/>
        <!--        <el-table-column prop="id" label="id" />-->
        <el-table-column label="直播链接地址" prop="url"/>
        <el-table-column label="海报相对路径" prop="imagePath">
          <template slot-scope="scope">
            <span style="cursor: pointer;" @click="openDialog(scope.row.imagePath)">查看图片</span>
          </template>
        </el-table-column>
        <el-table-column label="直播开始时间" prop="beginTime"/>
        <el-table-column label="直播创建日期" prop="createdTime"/>
        <el-table-column
          v-if="checkPer(['admin','worksPodcast:edit','worksPodcast:del'])"
          align="center"
          label="操作"
          width="150px">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"/>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination/>
    </div>
    <el-dialog
      :visible.sync="bannerDialogDisplay"
      title="海报图片"
      width="80%">
      <img width="100%" :src="this.imagePath"/>
      <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="bannerDialogDisplay = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import crudWorksPodcast from '@/api/worksPodcast'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { getToken } from '@/utils/auth'

const defaultForm = { id: null, url: null, imagePath: null, beginTime: null, createdTime: null }
export default {
  name: 'WorksPodcast',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '作品有关直播',
      url: 'api/worksPodcast',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudWorksPodcast }
    })
  },
  data() {
    return {
      imagePath: '',
      baseFilePathDev: 'http://localhost:8000',
      baseFilePathProd: 'http://voteadmin.weinui.com/voteBg',
      bannerDialogDisplay: false,
      permission: {
        add: ['admin', 'worksPodcast:add'],
        edit: ['admin', 'worksPodcast:edit'],
        del: ['admin', 'worksPodcast:del']
      },
      headers: {
        Authorization: getToken()
      },
      limit: 1,
      rules: {},
      queryTypeOptions: [
        { key: 'url', display_name: '直播链接地址' },
        { key: 'imagePath', display_name: '海报相对路径' }
      ]
    }
  },
  created() {
    defaultForm.imagePath = null
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    saveFilePath(data) {
      this.form.imagePath = data
    },
    openDialog(imgRelativePath) {
      this.bannerDialogDisplay = true
      this.imagePath = this.baseFilePathProd + imgRelativePath
      console.log(this.imagePath)
    },
    removeFilePath() {
      this.form.imagePath = ''
    },
    exceedFilePath(file, fileList) {
      this.$message({
        message: '只可上传一张图片，超出文件上传个数！',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>

</style>
