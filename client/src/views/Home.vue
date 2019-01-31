<template>
  <div id="wrapper">
    <!-- Sidebar -->
    <div id="sidebar-wrapper">
      <ul class="sidebar-nav">
        <li class="sidebar-brand">
          <a>{{currentUser.username}}</a>
        </li>
        <li class="sidebar-msg">
          <a>All Chats</a>
        </li>
        <div v-if="chatList.length > 0">
          <li v-for="chat of chatList" :key="chat._id">
            <a @click="pickChat(chat)">{{chat.recipient.username}}</a>
          </li>
        </div>
        <li v-else class="sidebar-msg">
          <a>No Current Chats</a>
        </li>
        <!-- <li class="sidebar-msg">
          <a>All Users</a>
        </li>
        <div v-if="userList.length > 0">
          <li v-for="user of userList" :key="user._id">
            <a @click="pickRecip(user)">{{user.username}}</a>
          </li>
        </div>-->
      </ul>
    </div>

    <!-- Page Content -->
    <div v-if="this.recipient.username" id="page-content-wrapper">
      <MessageChat :recipientUser="this.recipient.username"/>
    </div>
    <div v-else id="page-content-wrapper"></div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import MessageChat from "../components/MessageChat";

export default {
  name: "Home",
  components: {
    MessageChat
  },
  data() {
    return {
      recipient: {}
    };
  },
  computed: {
    ...mapState({
      resultsFetching: state => state.UserStore.fetching,
      chatList: state => state.UserStore.allChats,
      userList: state => state.UserStore.allUsers,
      currentUser: state => state.UserStore.currentUser
    })
  },
  methods: {
    ...mapActions("UserStore", [
      "getAllUsers",
      "getAllChats",
      "getMessageForChat"
    ]),
    pickRecip: function(user) {
      this.recipient = user;
    },
    pickChat: function(chat) {
      this.recipient = chat.recipient;
      this.getMessageForChat({ chat });
    }
  },
  mounted() {
    const { currentUser } = this;
    const currentUserId = currentUser._id;
    this.getAllUsers({ currentUserId });
    this.getAllChats({ currentUserId });
  }
};
</script>

<style scoped>
body {
  height: 100%;
}

#wrapper {
  padding-left: 250px;
}

#sidebar-wrapper {
  z-index: 1000;
  position: fixed;
  left: 250px;
  height: 100%;
  margin-left: -250px;
  overflow-y: auto;
  background: #000;
  width: 250px;
}

#page-content-wrapper {
  width: -moz-calc(100% - 250px);
  width: -webkit-calc(100% - 250px);
  width: calc(100% - 250px);
  position: absolute;
  padding: 20px;
}

/* Sidebar Styles */

.sidebar-nav {
  position: absolute;
  top: 0;
  width: 250px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sidebar-nav li {
  text-indent: 20px;
  line-height: 40px;
}

.sidebar-nav li a {
  display: block;
  text-decoration: none;
  color: #999999;
}

.sidebar-nav li a:hover {
  text-decoration: none;
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
}

.sidebar-nav li a:active,
.sidebar-nav li a:focus {
  text-decoration: none;
}

.sidebar-nav > .sidebar-brand {
  height: 65px;
  font-size: 18px;
  line-height: 60px;
  border-bottom-color: #fff;
  border-bottom-width: 2px;
}

.sidebar-nav > .sidebar-msg {
  font-size: 14px;
  border-bottom-color: #fff;
  border-bottom-width: 2px;
}

.sidebar-nav > .sidebar-brand a,
.sidebar-nav > .sidebar-msg a {
  color: #999999;
}

.sidebar-nav > .sidebar-brand a:hover,
.sidebar-nav > .sidebar-msg a:hover {
  background: none;
}

@media (min-width: 768px) {
  #page-content-wrapper {
    height: 100%;
  }
}
</style>
