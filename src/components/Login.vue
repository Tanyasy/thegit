<template>
  <div class="login_container">
    <div :class="showLogin?'login_box':'register_box'">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img
          src="../assets/logo.png"
          alt=""
          srcset=""
        >
      </div>
      <!-- 表单添加验证 rules-->
      <!-- 通过refs定义该块的引用，通过loginFormRef就可以获取form对象 -->
      <el-form
        v-if="showLogin"
        ref="loginFormRef"
        :rules="loginFormRules"
        :model="loginForm"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user-solid"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <!-- 将验证规则加给item -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
            :type="pwdType"
            @keyup.enter="login"
            show-password
          >
            <!--<template v-slot:suffix>-->
              <!--<i-->
                <!--class="el-icon-view"-->
                <!--@mousedown="showPwd"-->
                <!--@mouseup="showPwd"-->
              <!--&gt;</i>-->
            <!--</template>-->
          </el-input>
        </el-form-item>
        <!-- 登录和重置 -->
        <el-form-item class="btns">
          <el-button
            type="primary"
            @click="login"
          >登录</el-button>
          <el-button
            type="info"
            @click="resetLoginForm"
          >重置</el-button>
        </el-form-item>

        <div class="register">
          <a
            :underline="false"
            @click="switchToRegister"
          >立即注册</a>
          <span>没有账号？ </span>
        </div>
      </el-form>

      <el-form
        v-else
        ref="registerFormRef"
        :rules="registerFormRules"
        :model="registerForm"
        label-width="0px"
        class="register_form"
      >
        <!-- 用户 -->
        <el-form-item prop="name">
          <el-input
            prefix-icon="el-icon-user-solid"
            v-model="registerForm.name"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>

        <el-form-item prop="telephone">
          <el-input
            prefix-icon="el-icon-phone"
            v-model="registerForm.telephone"
            placeholder="请输入手机号码"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <!-- 将验证规则加给item -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="registerForm.password"
            :type="pwdType"
            placeholder="请输入密码"
            @keyup.enter="register"
          >
            <template v-slot:suffix>
              <i
                class="el-icon-view"
                @mousedown="showPwd"
                @mouseup="showPwd"
              ></i>
            </template>
          </el-input>
        </el-form-item>
        <!-- 登录和重置 -->
        <el-form-item class="btns">
          <el-button
            type="primary"
            @click="register"
          >注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import req from "../http/http.js";
import qs from "qs";
import { reactive, ref, readonly } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

export default {
  setup() {
    const loginForm = reactive({
      username: "",
      password: "",
    });
    const loginFormRules = readonly({
      // 验证用户名是否合法
      username: [
        // trigger定义验证时机，blur表示失去焦点时验证
        {
          required: true,
          message: "请输入登录名称",
          trigger: "blur",
        },
        {
          min: 2,
          max: 10,
          message: "长度在2到10个字符之间",
          trigger: "blur",
        },
      ],
      // 验证密码是否合法
      password: [
        {
          required: true,
          message: "请输入登录密码",
          trigger: "blur",
        },
        {
          min: 6,
          max: 15,
          message: "长度在6到15个字符之间",
          trigger: "blur",
        },
      ],
    });
    const loginFormRef = ref(null);

    const registerForm = reactive({
      name: "",
      telephone: "",
      password: "",
    });
    const registerFormRules = readonly({
      // 验证用户名是否合法
      name: [
        // trigger定义验证时机，blur表示失去焦点时验证
        {
          required: true,
          message: "请输入登录名称",
          trigger: "blur",
        },
        {
          min: 2,
          max: 10,
          message: "长度在2到10个字符之间",
          trigger: "blur",
        },
      ],
      telephone: [
        // trigger定义验证时机，blur表示失去焦点时验证
        {
          required: true,
          message: "请输入手机号码",
          trigger: "blur",
        },
        {
          min: 11,
          max: 11,
          message: "手机号长度不符",
          trigger: "blur",
        },
      ],
      // 验证密码是否合法
      password: [
        {
          required: true,
          message: "请输入登录密码",
          trigger: "blur",
        },
        {
          min: 6,
          max: 15,
          message: "长度在6到15个字符之间",
          trigger: "blur",
        },
      ],
    });
    const registerFormRef = ref(null);

    const showLogin = ref(true);

    const store = useStore();
    const router = useRouter();

    const resetLoginForm = () => {
      loginFormRef.value.resetFields();
    };

    const login = () => {
      loginFormRef.value.validate(async (valid) => {
        if (!valid) return;
        const username = loginForm.username;
        req("post", "login/access-token", qs.stringify(loginForm))
          .then((response) => {
            sessionStorage.setItem("token", response.access_token);
            store.commit("setUserName", username);
            ElMessage.success({
              message: "登录成功了٩(๑>◡<๑)۶ ，欢迎您，" + username,
              type: "success",
            });
            router.push("/home");
          })
          .catch((error) => {
            if (
              error.response &&
              error.response.status &&
              400 === error.response.status
            ) {
              ElMessage.error({
                message: "用户名或密码输入错了哦，请检查下哦(╥╯^╰╥)",
                type: "error",
              });
            } else {
              ElMessage.error({
                message: "不明原因导致登陆失败了，请稍后重试下(╥╯^╰╥)",
                type: "error",
              });
            }
          });
      });
    };

    const switchToRegister = () => {
      showLogin.value = false;
    };

    const register = () => {
      registerFormRef.value.validate(async (valid) => {
        if (!valid) return;
        req("post", "users/", JSON.stringify(registerForm))
          .then((response) => {
            loginForm.username = response.name;
            showLogin.value = true;
            ElMessage.success({
              message: "注册成功咯，赶快登陆下",
              type: "success",
            });
          })
          .catch((error) => {
            if (
              error.response &&
              error.response.status &&
              400 === error.response.status
            ) {
              ElMessage.error({
                message: "用户名或手机号已存在咯，请确认下(╥╯^╰╥)",
                type: "error",
              });
            } else {
              ElMessage.error({
                message: "不明原因导致注册失败了，请稍后重试下(╥╯^╰╥)",
                type: "error",
              });
            }
          });
      });
    };
    const pwdType = ref("password");
    const showPwd = () => {
      pwdType.value === "password"
        ? (pwdType.value = "")
        : (pwdType.value = "password");
      let e = document.getElementsByClassName("el-icon-view")[0];
      pwdType.value === ""
        ? e.setAttribute("style", "color: #409EFF")
        : e.setAttribute("style", "color: #c0c4cc");
    };

    return {
      loginForm,
      loginFormRules,
      loginFormRef,
      registerForm,
      registerFormRules,
      registerFormRef,
      showLogin,
      pwdType,
      showPwd,
      resetLoginForm,
      login,
      switchToRegister,
      register,
    };
  },
};
</script>

<style lang="scss" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: white;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 40%;
  /* // 将中心点移到方块的中心 */
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    top: -50%;
    transform: translate(-50%, 50%);
    background-color: #fff;
  }

  .avatar_box > img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 30px;
    box-sizing: border-box;

    .btns {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 0;
    }

    .register {
      margin: 10px 0;
      height: 20px;

      span,
      a {
        font-family: "SF Pro SC", "SF Pro Text", "SF Pro Icons", PingFang SC,
          Lantinghei SC, Microsoft Yahei, Hiragino Sans GB, Microsoft Sans Serif,
          WenQuanYi Micro Hei, sans-serif;
        font-size: 10px;
        float: right;
        color: rgba(0, 0, 0, 0.4);
        vertical-align: top;
        font-weight: 500;
      }

      a {
        color: #55a532;
      }

      a:hover {
        color: #63a35c;
        font-weight: 600;
        cursor: pointer;
      }
    }
  }
}

.register_box {
  width: 450px;
  height: 350px;
  background-color: white;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 40%;
  /* // 将中心点移到方块的中心 */
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    top: -43%;
    transform: translate(-50%, 50%);
    background-color: #fff;
  }

  .avatar_box > img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }

  .register_form {
    position: absolute;
    bottom: 12px;
    width: 100%;
    padding: 0 30px;
    box-sizing: border-box;

    .btns {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 0;
    }
  }
}

.el-icon-view:hover {
  cursor: pointer;
}
</style>
