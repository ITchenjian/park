<template>
    <div style="position:relative;">
        <div class="aside">
            <div class="cover">
                <h1>咨询封面</h1>
                <div>
                    <el-upload
                      class="avatar-uploader"
                      action="http://47.106.149.52:9992/oss/upload"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                      :data='{pathName:"itparking/web"}'>
                      <img v-if="imageUrl" :src="imageUrl" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>
            </div>
            

        </div>
        <div class="info">
            <h1>名称：{{title}}</h1>
            <div class="edit_container">
            	<quill-editor v-model="content"
                    ref="myQuillEditor"
                    class="editer"
                    :options="editorOption"
                    @ready="onEditorReady($event)">
      			</quill-editor>
            </div>
            <div class="submit_btn">
      			<el-button type="primary" @click="submit">提交</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import { quillEditor } from 'vue-quill-editor'
    import {addConsultList,getConsultSingle} from '../../api/url';

    export default {
        data(){
            return {
                conId:'',
                imageUrl:'',
                title:'',
                content: '<h3>文本编辑</h3>',
			    editorOption: {
			        modules:{
                        toolbar:[
                            ['bold', 'italic', 'underline', 'strike'],
                            
                            [{ 'header': 1 }, { 'header': 2 }], 

                            [{ 'align': [] },{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            [{ 'script': 'sub'}, { 'script': 'super' }],
                            [{ 'indent': '-1'}, { 'indent': '+1' }],
                            [{ 'direction': 'rtl' }],  
                            [{ 'size': ['small', false, 'large', 'huge'] }],
                            [{ 'color': [] }, { 'background': [] }],

                            [{ 'font': [] }],
                            ['link','image'],
                            ['clean']
                            
                        ]
                    }
		        }
            }
        },
    	components: {
    		quillEditor,
    	},
        computed: {
          	editor() {
	        	return this.$refs.myQuillEditor.quill
	      	}
        },
        methods: {
            getConsult:function(){
                this.dialogFormVisible=true;
                this.$postRequest(getConsultSingle(),{adId:this.conId}).then((data) => {
                    if(data.status!=200) return;
                    this.title=data.data.title;
                    this.imageUrl=data.data.coverPhoto;
                    this.content=data.data.content;
                });

            },

            handleAvatarSuccess(res, file) {
                // this.imageUrl = URL.createObjectURL(file.raw);
                this.imageUrl = res.data;
            },
            onEditorBlur(){//失去焦点事件
            },
            onEditorFocus(){//获得焦点事件
            },
            onEditorChange(){//内容改变事件
            },
		    onEditorReady(editor) {
		        // console.log('editor ready!', editor)
		    },
		    submit(){
                // console.log(this.content);
                this.$putRequest(addConsultList()+'/'+this.conId,{
                    adId:this.conId,
                    coverPhoto:this.imageUrl,
                    content:this.content

                }).then((data) => {
                    if(data.status!=200) return;
                    this.getConsult();
                    this.$message.success('提交成功！');
                });
                
            }
        },
        mounted:function(){
            this.conId=this.$route.query.id;
            this.getConsult();
        }
    }
</script>

<style scoped>
    
    .aside{
        width:200px;
        height: 800px;
        margin-left:16px;
        background: #fff;
        color: #2e2e2e;
        padding:10px 0;
    }
    
    .aside .cover h1{
        padding:10px 0 20px;
    }

    .avatar-uploader {
        border: 1px dashed #1bc3b4;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload i{
        font-size: 28px;
        color: #8c939d;
        width: 200px;
        height: 200px;
        line-height: 200px;
        text-align: center;
    }

    .info{
        position: absolute;
        background-color: #fff;
        top: 0px;
        bottom: 0;
        left: 232px;
        right: 16px;
        padding:10px 0;
    }
    .info h1{
        color: #2e2e2e;
        padding:10px 0 20px;
    }

	.edit_container{
        margin-bottom: 60px;
        color:#222;
    }
    .editer{
        height: 400px;
    }
    .submit_btn{
        text-align: center;
    }
  
</style>
<style>
    .ql-toolbar.ql-snow{
        border: 1px solid #dcdfe6;
    }
    .ql-container.ql-snow {
        border: 1px solid #dcdfe6;
    }
</style>
