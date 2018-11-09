import axios from "axios";
import router from "../router";

const state = {
    currentUser: "",
    allUsers: [],
    loginError: "",
    fetching: false,
    registerError: ""
};

const actions = {
    login({ commit }, { username, password }) {
        commit("loginRequest");
        let url = "http://localhost:4000/signin";
        axios
            .post(url, {
                username: username,
                password: password
            })
            .then(response => {
                if (response.status === 200) {
                    let userList = [];
                    let userUrl = "http://localhost:4000/all";
                    axios
                        .post(userUrl, {
                            username: username
                        })
                        .then(response => {
                            if (response.status === 200) {
                                userList = response.data;
                                commit("setAllUsers", userList);
                            } else {
                                commit('requestFailed', response.data);
                            }
                            commit('loginSuccess', username);
                            router.push("home");
                        })
                        .catch(error => {
                            if (error.toString() === "Error: Network Error") {
                                commit('requestFailed', "Please connect to the internet and try again.");
                            }
                        });
                } else {
                    commit('loginFailed', response.data);
                }
            })
            .catch(error => {
                if (error.toString() === "Error: Network Error") {
                    commit('loginFailed', "Please connect to the internet and try again.");
                }
            });


    },
    register({ commit }, { username, firstName, lastName, password }) {
        commit("registerRequest");
        let url = "http://localhost:4000/register";
        axios
            .post(url, {
                username: username,
                firstName: firstName,
                lastName: lastName,
                password: password
            })
            .then(response => {
                if (response.status === 200) {

                    let userList = [];
                    let userUrl = "http://localhost:4000/all";
                    axios
                        .post(userUrl, {
                            username: username
                        })
                        .then(response => {
                            if (response.status === 200) {
                                userList = response.data;
                                commit("setAllUsers", userList);
                            } else {
                                commit('requestFailed', response.data);
                            }
                            commit('registerSuccess', username);
                            router.push("home");
                        })
                        .catch(error => {
                            if (error.toString() === "Error: Network Error") {
                                commit('requestFailed', "Please connect to the internet and try again.");
                            }
                        });

                } else {
                    commit('registerFailed', response.data);
                }
            })
            .catch(error => {
                if (error.toString() === "Error: Network Error") {
                    commit('registerFailed', "Please connect to the internet and try again.");
                }
            });
    },
    getAllUsers({ commit }, { username }) {
        let userList = [];
        commit('requestSent');
        let url = "http://localhost:4000/all";
        axios
            .post(url, {
                username: username
            })
            .then(response => {
                if (response.status === 200) {
                    userList = response.data;
                    commit("setAllUsers", userList);
                } else {
                    commit('requestFailed', response.data);
                }
                return;
            })
            .catch(error => {
                if (error.toString() === "Error: Network Error") {
                    commit('requestFailed', "Please connect to the internet and try again.");
                }
                return;
            });
    }
}

const mutations = {
    loginRequest(state) {
        state.fetching = true;
    },
    loginSuccess(state, username) {
        state.currentUser = username;
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
    registerSuccess(state, username) {
        state.currentUser = username;
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
    }
};

export const UserStore = {
    namespaced: true,
    state,
  actions,
  mutations
};
