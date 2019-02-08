import axios from "axios";
import router from "../router";

const state = {
  currentUser: JSON.parse(sessionStorage.getItem("currentUser") || "{}"),
  allUsers: JSON.parse(sessionStorage.getItem("userList") || "[]"),
  allChats: JSON.parse(sessionStorage.getItem("chatList") || "[]"),
  currentFullChat: [],
  loginError: "",
  fetching: false,
  registerError: "",
  currentChat: {}
};

const actions = {
  login({ commit }, { username, password }) {
    commit("loginRequest");
    let url = "http://localhost:4000/signin";
    axios
      .post(url, { username, password })
      .then(response => {
        if (response.status === 200) {
          let currentUser = response.data.currentUser;
          commit("loginSuccess", currentUser);
          sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
          router.push("home");
        } else {
          commit("loginFailed", response.data.error);
        }
      })
      .catch(error => {
        if (error.toString() === "Error: Network Error") {
          commit(
            "loginFailed",
            "Please connect to the internet and try again."
          );
        }
      });
  },
  register({ commit }, { username, firstName, lastName, password }) {
    commit("registerRequest");
    let url = "http://localhost:4000/register";
    axios
      .post(url, { username, firstName, lastName, password })
      .then(response => {
        if (response.status === 200) {
          let currentUser = response.data.currentUser;
          commit("registerSuccess", currentUser);
          sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
          router.push("home");
        } else {
          commit("registerFailed", response.data.error);
        }
      })
      .catch(error => {
        if (error.toString() === "Error: Network Error") {
          commit(
            "registerFailed",
            "Please connect to the internet and try again."
          );
        }
      });
  },
  getAllUsers({ commit }, { currentUserId }) {
    commit("requestSent");
    let url = "http://localhost:4000/all";
    axios
      .post(url, { currentUser: currentUserId })
      .then(response => {
        if (response.status === 200) {
          let userList = response.data;
          commit("setAllUsers", userList);
          sessionStorage.setItem("userList", JSON.stringify(userList));
        } else {
          commit("requestFailed", response.data.error);
        }
      })
      .catch(error => {
        if (error.toString() === "Error: Network Error") {
          commit(
            "requestFailed",
            "Please connect to the internet and try again."
          );
        }
      });
  },
  getAllChats({ commit }, { currentUserId }) {
    commit("requestSent");
    let url = "http://localhost:4000/getChats";
    axios
      .post(url, { currentUser: currentUserId })
      .then(response => {
        if (response.status === 200) {
          let chatList = response.data.chats;
          commit("setAllChats", chatList);
          sessionStorage.setItem("chatList", JSON.stringify(chatList));
        } else {
          commit("requestFailed", response.data.error);
        }
      })
      .catch(error => {
        if (error.toString() === "Error: Network Error") {
          commit(
            "requestFailed",
            "Please connect to the internet and try again."
          );
        }
      });
  },
  startChat({ commit }, { currentUser, receiver, message }) {
    let url = "http://localhost:4000/startChat";
    axios
      .post(url, {
        currentUser: currentUser._id,
        receiver,
        composedMessage: message
      })
      .then(response => {
        if (response.status === 200) {
          let newChat = response.data.newChat;
          commit("updateChatList", newChat);
          commit("setCurrentChat", newChat);
          sessionStorage.setItem("currentChatId", JSON.stringify(newChat));
        }
      })
      .catch(error => {
        if (error.toString() === "Error: Network Error") {
          commit(
            "requestFailed",
            "Please connect to the internet and try again."
          );
        }
      });
  },
  getMessageForChat({ commit }, { chat }) {
    let url = "http://localhost:4000/getMessages";
    axios
      .post(url, { chatId: chat.chatId })
      .then(response => {
        if (response.status === 200) {
          let fullUpdatedChat = response.data.allMessages;
          sessionStorage.setItem("currentChatId", JSON.stringify(chat));
          sessionStorage.setItem(
            "currentFullChat",
            JSON.stringify(fullUpdatedChat)
          );
          commit("setCurrentChatMessages", fullUpdatedChat);
          commit("setCurrentChat", chat);
        }
      })
      .catch(error => {
        if (error.toString() === "Error: Network Error") {
          commit(
            "requestFailed",
            "Please connect to the internet and try again."
          );
        }
      });
  },
  addMessage({ commit }, { currentUser, chat, message }) {
    let url = "http://localhost:4000/addMessage";
    axios
      .post(url, {
        currentUser: currentUser._id,
        chatId: chat.chatId,
        composedMessage: message
      })
      .then(response => {
        if (response.status === 200) {
          let fullUpdatedChat = response.data.fullChat;
          sessionStorage.setItem(
            "currentFullChat",
            JSON.stringify(fullUpdatedChat)
          );
          commit("setCurrentChatMessages", fullUpdatedChat);
        }
      })
      .catch(error => {
        if (error.toString() === "Error: Network Error") {
          commit(
            "requestFailed",
            "Please connect to the internet and try again."
          );
        }
      });
  }
};

const mutations = {
  loginRequest(state) {
    state.fetching = true;
  },
  loginSuccess(state, currentUser) {
    state.currentUser = currentUser;
    state.fetching = false;
    state.loginError = "";
  },
  loginFailed(state, error) {
    state.loginError = error;
    state.fetching = false;
  },
  registerRequest(state) {
    state.fetching = true;
  },
  registerSuccess(state, currentUser) {
    state.currentUser = currentUser;
    state.fetching = false;
    state.registerError = "";
  },
  registerFailed(state, error) {
    state.registerError = error;
    state.fetching = false;
  },
  requestSent(state) {
    state.fetching = true;
  },
  requestFailed(state, error) {
    state.errorMessage = error;
    state.fetching = false;
  },
  setAllUsers(state, userList) {
    state.allUsers = userList;
    state.fetching = false;
  },
  setAllChats(state, chatList) {
    state.allChats = chatList;
    state.fetching = false;
  },
  updateChatList(state, newChat) {
    state.allChats.push(newChat);
  },
  setCurrentChatMessages(state, fullChat) {
    state.currentFullChat = fullChat;
  },
  setCurrentChat(state, currentChat) {
    state.currentChat = currentChat;
  }
};

export const UserStore = { namespaced: true, state, actions, mutations };
