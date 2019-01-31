<template>
  <div class="container-fluid mainContainer">
    <div class="row topContainer">
      <h3>{{recipientUser}}</h3>
    </div>
    <div class="messagesContainer">
      <div
        class="row"
        style="padding-top: 10px; padding-bottom: 10px"
        v-for="message of allMessages"
        :key="message.id"
      >
        <div v-if="message.author === currentUser._id" class="col-md-7 offset-md-5">
          <div class="card sent float-right">
            <div class="card-body text-right">{{ message.body }}</div>
          </div>
        </div>
        <div v-else class="col-md-7">
          <div class="card recieved">
            <div class="card-body">{{ message.body }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="row textInputContainer">
      <div class="input-group">
        <textarea class="form-control" placeholder="Type a message" v-model="message"></textarea>
        <button class="input-group-append btn btn-primary" v-on:click.prevent="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "MessageChat",
  props: ["recipientUser"],
  data() {
    return {
      message: ""
    };
  },
  computed: {
    ...mapState({
      resultsFetching: state => state.UserStore.fetching,
      allMessages: state => state.UserStore.currentFullChat,
      currentUser: state => state.UserStore.currentUser,
      chat: state => state.UserStore.currentChat
    })
  },
  methods: {
    ...mapActions("UserStore", ["getMessageForChat", "addMessage"]),
    sendMessage: function() {
      const { currentUser, chat, message } = this;
      console.log(chat);
      this.addMessage({ currentUser, chat, message });
    }
  }
};
</script>

<style scoped>
.mainContainer {
  height: 100%;
}

.textInputContainer {
  height: 10%;
}

.topContainer {
  height: 10%;
}

.messagesContainer {
  height: 80%;
  overflow-y: auto;
  overflow-x: hidden;
}

textarea {
  resize: none;
}

.sent {
  background-color: lightblue;
}

.recieved {
  background-color: lightgreen;
}

.card {
  width: max-content;
}
</style>
