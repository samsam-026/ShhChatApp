<template>
    <div class="container-fluid main">
        <div class="row">
            <div class="col-lg-6"></div>
            <div class="col-lg-6">
                <div class="row" v-if="errorMessage !== ''">
                    <div class="col-lg-2"> </div>
                    <div class="col-lg-8 text-center">
                        <div class="alert alert-danger alert-dismissible fade show" id="errMsg" role="alert">
                            {{errorMessage}}
                            <button type="button" class="close" v-on:click.prevent="clearError" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-3"></div>
                    <div class="col-md-6">
                        <form v-on:submit.prevent="registerUser">
                            <div class="form-group">
                                <label for="firstName">First Name</label>
                                <input type="text" class="form-control" v-model="firstName" id="firstName" placeholder="John"
                                    autofocus>
                            </div>
                            <div class="form-group">
                                <label for="lastName">Last Name</label>
                                <input type="text" class="form-control" v-model="lastName" id="lastName" placeholder="Doe">
                            </div>
                            <div class="form-group">
                                <label for="username">Username</label>
                                <input type="text" class="form-control" v-model="username" id="username" placeholder="johndoe">
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input type="password" class="form-control" v-model="password" id="password" placeholder="***********">
                            </div>
                            <div v-if="resultsFetching">
                                <div class="loader"></div>
                            </div>
                            <div v-else>
                                <button class="btn btn-primary" v-on:click.prevent="registerUser">Register</button>
                            </div>
                        </form>
                        <router-link to="/">Login</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { mapState, mapActions } from "vuex";

export default {
  name: "Register",
  props: {
    msg: String
  },
  computed: {
    ...mapState({
      resultsFetching: state => state.UserStore.fetching,
      errorMessage: state => state.UserStore.registerError
    })
  },
  data() {
    return {
      username: "",
      lastName: "",
      firstName: "",
      password: "",
      resultsFetching: false,
      errorMessage: ""
    };
  },
  methods: {
    ...mapActions("UserStore", ["register"]),
    clearError() {
      this.errorMessage = "";
    },
    registerUser() {
      if (
        this.username !== "" &&
        this.lastName !== "" &&
        this.firstName !== "" &&
        this.password !== ""
      ) {
        const { username, password, firstName, lastName } = this;
        this.register({ username, firstName, lastName, password });
      } else {
        alert("Please type a username in the field.");
      }
    }
  }
};
</script>

<style>
</style>
