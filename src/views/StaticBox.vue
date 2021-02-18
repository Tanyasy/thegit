<template>
  <el-row
    :gutter="40"
    class="panel-group"
  >
    <el-col
      :xs="12"
      :sm="12"
      :lg="6"
      class="card-panel-col"
    >
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon
            icon-class="peoples"
            class-name="card-panel-icon"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            New Visits
          </div>
          <count-to
            :start-val="0"
            :end-val="102400"
            :duration="2600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col
      :xs="12"
      :sm="12"
      :lg="6"
      class="card-panel-col"
    >
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon
            icon-class="message"
            class-name="card-panel-icon"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Messages
          </div>
          <count-to
            :start-val="0"
            :end-val="81212"
            :duration="3000"
            class="card-panel-num"
          />
        </div>
      </div>

    </el-col>
    <el-col
      :xs="12"
      :sm="12"
      :lg="6"
      class="card-panel-col"
    >
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon
            icon-class="money"
            class-name="card-panel-icon"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Purchases
          </div>
          <count-to
            :start-val="0"
            :end-val="9280"
            :duration="3200"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col
      :xs="12"
      :sm="12"
      :lg="6"
      class="card-panel-col"
    >
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon
            icon-class="shopping"
            class-name="card-panel-icon"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Shoppings
          </div>
          <count-to
            :start-val="0"
            :end-val="13600"
            :duration="3600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
  </el-row>

  <el-empty
    v-if="emptyData"
    descript="暂无数据"
  >
    <el-button
      type="primary"
      @click="routeToPayment"
    >添加数据</el-button>
  </el-empty>
  <div
    v-else
    class="chart"
  >
    <div
      id="incomeChart"
      :style="{width: mainWidth}"
    ></div>
    <div
      id="detailChart"
      v-show="showDetail"
    ></div>
  </div>
</template>

<script>
import CountTo from "../components/vueCounTo/vue-countTo";
import req from "../http/http";
import { inject, onMounted, reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";

export default {
  components: {
    CountTo,
  },
  setup() {
    let echarts = inject("ec");
    let router = useRouter();
    let showDetail = ref(false);
    let emptyData = ref(false);
    let mainOption = reactive({
      legend: {},
      tooltip: {},
      grid: {
        left: "5%", // 与容器左侧的距离
        right: "5%", // 与容器右侧的距离
        //top: '5%',   // 与容器顶部的距离
        //bottom: '5%', // 与容器底部的距离
      },
      dataset: {
        source: [],
      },
      xAxis: { type: "category" },
      yAxis: {},
      series: [
        {
          type: "bar",
          barWidth: 23,
          itemStyle: {
            normal: {
              //柱形图圆角，顺时针左上，右上，右下，左下）
              barBorderRadius: [12, 12, 12, 12],
              //设置柱状图颜色渐变
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#f75d5d",
                },
                {
                  offset: 1,
                  color: "#f0caca",
                },
              ]),
            },
          },
        },
        {
          type: "bar",
          barWidth: 23,
          itemStyle: {
            normal: {
              // 统一设置四个角的圆角大小
              barBorderRadius: 12,
              //设置柱状图颜色渐变
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#5ad9e8",
                },
                {
                  offset: 1,
                  color: "#caecf0",
                },
              ]),
            },
          },
        },
      ],
    });

    let detailOption = reactive({
      title: {
        text: "",
        subtext: "详情",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "访问来源",
          type: "pie",
          radius: "50%",
          data: [],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    });
    // 图表显示
    const showData = (incomeChart) => {
      req("get", "payments/statistics").then((response) => {
        if (response && response.length > 0) {
          // 绘制图表
          mainOption.dataset.source = response;
          incomeChart.setOption(mainOption);
        } else {
          emptyData.value = true;
        }
      });
    };

    const handleDetailChart = (detailChart, select_date = "", payment = "") => {
      req(
        "get",
        "payments/statistics?select_date=" + select_date + "&payment=" + payment
      ).then((response) => {
        // 绘制图表
        detailOption.title.text = select_date + " " + payment;
        detailOption.series[0].data = response;
        detailChart.resize();
        detailChart.setOption(detailOption);
      });
    };

    const routeToPayment = () => {
      router.push({
        name: "payment",
        params: {
          visible: "y",
        },
      });
    };

    onMounted(() => {
      //需要获取到element,所以是onMounted的Hook
      let incomeChart = echarts.init(document.getElementById("incomeChart"));
      let detailChart = echarts.init(document.getElementById("detailChart"));
      // 绘制图表
      showData(incomeChart);
      incomeChart.on("click", function (params) {
        showDetail.value = true;
        let width = document.body.clientWidth * 0.6;
        incomeChart.resize({
          width: width,
        });

        handleDetailChart(detailChart, params.name, params.seriesName);
      });
      window.onresize = function () {
        //自适应大小
        incomeChart.resize();
      };
    });
    return {
      mainOption,
      detailOption,
      showDetail,
      emptyData,
      mainWidth: computed(() => (showDetail.value ? "70%" : "100%")),
      showData,
      handleDetailChart,
      routeToPayment,
    };
  },
};
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}

.chart {
  height: 500px;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  #incomeChart {
    height: 500px;
    width: 70%;
    float: left;
    margin-top: 20px;
  }

  #detailChart {
    height: 550px;
    width: 25%;
    float: right;
    padding: 25px;
  }
}

.el-empty {
  font-family: "SF Pro SC", "SF Pro Text", "SF Pro Icons", PingFang SC,
    Lantinghei SC, Microsoft Yahei, Hiragino Sans GB, Microsoft Sans Serif,
    WenQuanYi Micro Hei, sans-serif;
  font-size: 12px;
}
</style>
