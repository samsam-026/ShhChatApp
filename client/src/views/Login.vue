<template>
    <div class="container-fluid main center_vertical">
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
                <div class="row main">
                    <div class="col-md-3"></div>
                    <div class="col-md-6">
                        <form v-on:submit.prevent="loginUser">
                            <div class="form-group">
                                <label for="username">Username</label>
                                <input type="text" class="form-control" v-model="username" id="username" placeholder="johndoe"
                                    autofocus>
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input type="password" class="form-control" v-model="password" id="password" placeholder="***********">
                            </div>
                            <div v-if="resultsFetching">
                                <div class="loader"></div>
                            </div>
                            <div v-else>
                                <button class="btn btn-primary" v-on:click.prevent="loginUser">Login</button>
                            </div>
                        </form>
                        <router-link to="/register">Register</router-link>
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
  name: "Login",
  computed: {
    ...mapState({
      resultsFetching: state => state.UserStore.fetching,
      errorMessage: state => state.UserStore.loginError
    })
  },
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    ...mapActions("UserStore", ["login"]),
    clearError() {
      this.errorMessage = "";
    },
    loginUser() {
      if (this.username !== "" && this.password !== "") {
        const { username, password } = this;
        this.login({ username, password });
      } else {
        alert("Please fill all fields");
      }
    }
  }
};
</script>

<style>
.loader {
  border: 10px solid #f3f3f3;
  border-radius: 50%;
  border-top: 10px solid #3498db;
  width: 80px;
  height: 80px;
  -webkit-animation: spin 2s linear infinite;
  /* Safari */
  animation: spin 2s linear infinite;
}

.main {
  margin: 0px;
  padding: 0px;
  padding-top: 80px;
}

/* Safari */
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
