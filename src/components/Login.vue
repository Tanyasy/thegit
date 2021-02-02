<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="" srcset="">
            </div>
            <!-- 表单添加验证 rules-->
            <!-- 通过refs定义该块的引用，通过loginFormRef就可以获取form对象 -->
            <el-form ref="loginFormRef" :rules="loginFormRules" :model="loginForm" label-width="0px" class="login_form">
                <!-- 用户 -->
                <el-form-item prop="username">
                    <el-input prefix-icon="el-icon-user-solid" v-model="loginForm.username"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <!-- 将验证规则加给item -->
                <el-form-item prop="password">
                    <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" type="password"
                              @keyup.enter="login"></el-input>
                </el-form-item>
                <!-- 登录和重置 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>

                <div class="register">
                    <el-link :underline="false">立即注册</el-link>
                    <span>没有账号？ </span>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import req from '../http/http.js';
    import qs from "qs"

    export default {
        data() {
            return {
                // 这是登录表单的数据绑定对象
                loginForm: {
                    username: "",
                    password: ""
                },
                // 这是表单的验证规则对象
                loginFormRules: {
                    // 验证用户名是否合法
                    username: [
                        // trigger定义验证时机，blur表示失去焦点时验证
                        {
                            required: true,
                            message: "请输入登录名称",
                            trigger: "blur"
                        },
                        {
                            min: 3,
                            max: 10,
                            message: "长度在3到10个字符之间",
                            trigger: "blur"
                        }
                    ],
                    // 验证密码是否合法
                    password: [{
                        required: true,
                        message: "请输入登录密码",
                        trigger: "blur"
                    },
                        {
                            min: 6,
                            max: 15,
                            message: "长度在6到15个字符之间",
                            trigger: "blur"
                        }
                    ]
                }
            }
        },
        methods: {
            resetLoginForm() {
                console.log(this)
                this.$refs.loginFormRef.resetFields()
            },
            login() {
                this.$refs.loginFormRef.validate(async valid => {
                    if (!valid) return;
                    const username = this.loginForm.username
                    req("post", 'login/access-token', qs.stringify(this.loginForm)).then(
                        (response) => {
                            sessionStorage.setItem("token", response.access_token)
                            this.$store.commit("setUserName", username)
                            this.$message({
                                message: '登录成功了٩(๑>◡<๑)۶ ，欢迎您，' + username,
                                type: 'success'
                            });
                            this.$router.push("/home")
                        }
                    ).catch(
                        (error) => {
                            console.log(error)
                            this.$message.error('登录失败了呢(╥╯^╰╥)')
                        }
                    );
                })
            }
        }
    }
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
    }

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

    .btns {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 0;
    }

    .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 30px;
        box-sizing: border-box;
    }

    .register {
        margin: 10px 0;
        height: 20px;
        span, .el-link {

            font-family: "SF Pro SC", "SF Pro Text", "SF Pro Icons", PingFang SC, Lantinghei SC, Microsoft Yahei, Hiragino Sans GB, Microsoft Sans Serif, WenQuanYi Micro Hei, sans-serif;
            font-size: 10px;
            float: right;
            color: rgba(0,0,0,0.4);
            vertical-align: top;
            font-weight: 500;
        }
        .el-link {
            color: #55a532;
        }

        .el-link:hover {
            color: #63a35c;
            font-weight: 600;
        }
    }
</style>
