<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission"/>
      <!--表单组件-->
      <el-dialog :before-close="crud.cancelCU" :close-on-click-modal="false" :title="crud.status.title"
                 :visible.sync="crud.status.cu > 0" width="500px">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
          <el-form-item label="作者姓名">
            <el-input v-model="form.authorName" readonly style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="微信昵称">
            <el-input v-model="form.wxNickName" readonly style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="作者手机号">
            <el-input v-model="form.authorMobile" readonly style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="作品描述">
            <el-input v-model="form.selfDescription" :rows=5 readonly style="width: 370px;" type="textarea"/>
          </el-form-item>
          <el-form-item label="作品种类类">
            <template>
              <span v-if="form.type == 0">文字</span>
              <span v-if="form.type == 1">图片</span>
              <span v-if="form.type == 2">视频</span>
            </template>
          </el-form-item>
          <el-form-item label="作品状态">
            <el-select v-model="form.lifeStatus" style="width: 370px;">
              <el-option
                v-for="(item, index) in lifeStatusOptions"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建日期">
            <el-input v-model="form.createdDate" readonly style="width: 370px;"/>
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
        <el-table-column label="自增主键" prop="id"/>
        <el-table-column label="作者姓名" prop="authorName"/>
        <el-table-column label="微信昵称" prop="wxNickName"/>
        <el-table-column label="作者手机号" prop="authorMobile"/>
        <el-table-column label="作品描述" prop="selfDescription"/>
        <el-table-column label="" prop="files">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 0">
              <span style="cursor: pointer;" @click="openDialog(scope.row.articleContent)">查看文章</span>
            </span>
            <span v-else-if="scope.row.type == 1">
              <div v-for="(imagePath, imageIndex) in scope.row.files" :key="imageIndex">
                <a :href="baseFilePathProd + imagePath" target="_blank">图片-{{ imageIndex }}</a>
              </div>
            </span>
            <span v-else>
              <a :href="baseFilePathProd + scope.row.files[0]" target="_blank">视频下载</a>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="lifeStatus">0
          <template slot-scope="scope">
            <span v-if="scope.row.lifeStatus == 1">已提交</span>
            <span v-if="scope.row.lifeStatus == 2">审核中</span>
            <span v-if="scope.row.lifeStatus == 3">审核通过</span>
            <span v-if="scope.row.lifeStatus == 4">审核拒绝</span>
            <span v-if="scope.row.lifeStatus == 5">获奖</span>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" prop="createdDate"/>
        <el-table-column
          v-if="checkPer(['admin','worksInfo:edit','worksInfo:del'])"
          align="center"
          label="操作"
          width="150px">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination/>
    </div>
    <el-dialog
      :visible.sync="articleDialogVisible"
      title="文章内容"
      width="50%">
<!--      <div v-for="(item, index) in TransferString(myFileUrl)" :key="index">{{ item }}</div>-->
      <quillEditor ref="text" v-model="this.articleContent" @focus="focusArticleContent($event)" style="height: 450px;" class="myQuillEditor" :options="editorOption" />
      <span slot="footer" class="dialog-footer">
<!--      <el-button type="primary" @click="articleDialogVisible = false">确 定</el-button>-->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import crudWorksInfo from '@/api/worksInfo'
import CRUD, {presenter, header, form, crud} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

const defaultForm = {
  id: null,
  authorName: null,
  authorMobile: null,
  wxNickName: null,
  selfDescription: null,
  type: null,
  lifeStatus: null,
  createdDate: null,
  createdBy: null,
  updatedBy: null,
  updatedDate: null
}
export default {
  name: 'WorksInfo',
  components: {pagination, crudOperation, rrOperation, udOperation, quillEditor },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '作品信息', url: 'api/worksInfo', idField: 'id', sort: 'id,desc', crudMethod: { ...crudWorksInfo }})
  },
  data() {
    return {
      editorOption: {
      },
      articleContent: '',
      articleDialogVisible: false,
      videoDialogVisible: false,
      permission: {
        list: ['admin', 'worksInfo:list'],
        edit: ['admin', 'worksInfo:edit'],
        del: ['admin', 'worksInfo:del']
      },
      lifeStatusOptions: [
        {
          value: 1,
          label: '已提交'
        }, {
          value: 2,
          label: '审核中'
        }, {
          value: 3,
          label: '审核通过'
        }, {
          value: 4,
          label: '审核拒绝'
        }, {
          value: 5,
          label: '获奖'
        }
      ],
      baseFilePathDev: 'http://localhost:8000',
      baseFilePathProd: 'http://voteadmin.weinui.com/voteBg',
      rules: {}
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    focusArticleContent(event) {
      event.enable(false)
    },
    openDialog(msg) {
      this.articleDialogVisible = true
      this.articleContent = msg
    },
    TransferString(text1) {
      let str = []
      str = text1.split('\n')
      return str
    }
  }
}
</script>

<style scoped>

</style>
