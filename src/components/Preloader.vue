<template>
    <div class="loading-background">
      <div class="loading-screen"></div>
      <div class="loading-text">
        Please Wait...
      </div>
    </div>
</template>
<script>
export default {
  name: "Preloader",
  methods: {},
  created () {},
  mounted () {}
};
</script>
<style lang="less" scoped>
&.loading {
  &-background {
    width: 100%;
    height: 100%;
    display: flex;
    position: fixed;
    flex-direction: column;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to right, #e0eafc, #cfdef3);
    z-index: 99999;
  }
  &-screen {
    background: url("../assets/314.gif");
    background-repeat: no-repeat;
    min-height: 130px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
    min-width: 130px;
    z-index: 999999;
    background-size: contain;
    border-radius: 50%;
  }
  &-text {
    font-size: 20px;
    margin-top: 8px;
  }
}
</style>
