<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" height="800px" width="800px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="公告标题">
            <el-input v-model="form.title" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="公告内容" style="height: 380px;">
            <quillEditor ref="myQuillEditor" v-model="form.content" style="height: 350px;" class="myQuillEditor" :options="editorOption" />
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
        <el-table-column prop="id" label="自增主键" />
        <el-table-column prop="title" label="公告标题" />
        <el-table-column prop="createdTime" label="创建时间" />
        <el-table-column v-if="checkPer(['admin','worksBulletin:edit','worksBulletin:del'])" label="操作" width="150px" align="center">
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
import crudWorksBulletin from '@/api/worksBulletin'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import {quillEditor, Quill} from 'vue-quill-editor'
import { container, ImageExtend, QuillWatch } from 'quill-image-extend-module'
Quill.register('modules/ImageExtend', ImageExtend)
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { getToken } from '@/utils/auth'
import { DEV_FILE_DOWNLOAD_URL_BASE, PROD_FILE_DOWNLOAD_URL_BASE } from '../../../api/constants'

const defaultForm = { id: null, title: null, content: null, createdTime: null }
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ 'header': 1 }, { 'header': 2 }],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'script': 'sub' }, { 'script': 'super' }],
  [{ 'indent': '-1' }, { 'indent': '+1' }],
  [{ 'direction': 'rtl' }],
  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'font': [] }],
  [{ 'align': [] }],
  ['link', 'image', 'upload'],
  ['clean']
]

export default {
  name: 'WorksBulletin',
  components: { pagination, crudOperation, udOperation, quillEditor },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '比赛有关公告板', url: 'api/worksBulletin', idField: 'id', sort: 'id,desc', crudMethod: { ...crudWorksBulletin }})
  },
  data() {
    return {
      headers: {
        Authorization: getToken()
      },
      limit: 1,
      editorOption: {
        modules: {
          ImageExtend: {
            loading: true,
            name: 'file',
            size: 0.10,
            action: DEV_FILE_DOWNLOAD_URL_BASE + '/api/worksPodcast/uploadBanner',
            // action: PROD_FILE_DOWNLOAD_URL_BASE + '/api/worksPodcast/uploadBanner',
            response: res => {
              return DEV_FILE_DOWNLOAD_URL_BASE + res
              // return PROD_FILE_DOWNLOAD_URL_BASE + res
            },
            headers: (xhr, formData) => {
              xhr.setRequestHeader('Authorization', getToken())
            },
            sizeError: () => {
              return this.$message.error('图片超过50kb')
            }
          },
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: function() {
                QuillWatch.emit(this.quill.id)
              }
            }
          }
        }
      },
      permission: {
        add: ['admin', 'worksBulletin:add'],
        edit: ['admin', 'worksBulletin:edit'],
        del: ['admin', 'worksBulletin:del']
      },
      rules: {}
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
