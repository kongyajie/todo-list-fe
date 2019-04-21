<style lang='less'>
  ul li {
      list-style: none;
  }
  .main {
      min-height: 20px;
      padding: 19px;
      border: 1px solid #e3e3e3;
      border-radius: 4px;
      background-color: #f5f5f5;
  }

  .margin-bottom-15 {
      margin-bottom: 15px;
  }

  .vert-offset-top-0{
      margin-top: 0em;
  }
  .vert-offset-top-2{
      margin-top: 2em;
  }

</style>
<template>
  <div class="container vert-offset-top-2">
      <div class="main col-xs-6 col-xs-offset-3">
          <h1 class="vert-offset-top-0 text-center">TodoList</h1>
          <ul class="list-group">
              <li v-for="(item, index) in list" :key="index" class="list-group-item clearfix">
                  <span>{{index+1}}.{{item.title}}</span>
                  <div class="pull-right">
                      <button class="btn btn-xs btn-danger img-circle" v-on:click="remove(item.id)">Ｘ</button>
                  </div>
              </li>
          </ul>
          <hr/>
          <div class="row margin-bottom-15">
              <div class="col-xs-12">
                  <input type="text" placeholder="What to do?" v-model="title" class="form-control" v-on:keyup.enter="add(title)">
              </div>
          </div>
          <button class="btn btn-block btn-primary" v-on:click="add(title)">新增</button>
      </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [],
      title: '',
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      R.todo.getList().then(resp => {
        if(resp.ok) {
          this.list = resp.body;
        }
      })
    },
    add() {
      if(!this.title) {
        return;
      }
      R.todo.add({title: this.title}).then(resp => {
        if(resp.ok) {
          // heyui.$Message('添加成功');
          this.list = resp.body;
          this.title = '';
        }
      })
    },
    remove(id) {
      R.todo.remove(id).then(resp => {
        if(resp.ok) {
          // heyui.$Message('删除成功');
          this.list = resp.body;
        }
      })
    }
  },
  computed: {
    
  }
}
</script>