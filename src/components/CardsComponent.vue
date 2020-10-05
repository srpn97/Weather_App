<template>
<div class="d-flex">
	<div v-for="(item,index) in data" :key="index" :class="{ active: activeCard[index] }" @click="activateCard(index); $emit('card-changed',item)" class="scroll-card" >
			<div class="bold day">
				{{item.dt | formatDate}}
			</div>
			<div class="d-flex justify-center">
				<span class="bold max">{{item.temp.max | degrees}}&#xb0;</span><span class="light min">{{item.temp.min | degrees}}&#xb0;</span>
			</div>
			<div class="icon">
				<img v-if="item.weather[0].main === 'Clear'" class="card-img" src="../assets/sun.svg" alt="icon">
				<img v-else-if="item.weather[0].main === 'Clouds'" class="card-img" src="../assets/cloudy.svg" alt="icon">
				<img v-else-if="item.weather[0].main === 'Rain'" class="card-img" src="../assets/rain.svg" alt="icon">
				<div class="light font-12">{{item.weather[0].main}}</div>				
			</div>
	</div>
</div>
</template>

<script>
import moment from 'moment';

export default {
		name: "CardsComponent",
		props: ['data','index'],
		data: function () {
		return {
      activeCard: [
				true,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
			],
		 }
    },
		filters: {
        formatDate (value) {
            if(value !== null) {
                return moment.unix(value).format('ddd')
            } else {
                return "-"
            }
        },
        degrees (value) {
           return Math.round(value)
        },
		},
		methods: {
			activateCard (index) {
				var p1 = this.activeCard.forEach((x,i)=>{
					this.$set(this.activeCard, i, false)
				})
				Promise.resolve(p1).then(x=>{
					this.$set(this.activeCard, index, true)
				})
			}
		}
}
</script>

<style lang="less">
	.scroll-card {
		width: 100px;
		// margin-right: 40px;
		margin-bottom: 20px;
		text-align: center;
		padding: 15px 0;
		.day {
			margin-bottom: 5px;
		}
		.max {
			margin-right: 2px;
		}
		.min {
			margin-left: 2px;
		}
		.icon {
			margin-top: 10px;
		}
		.card-img {
			height: 30px;
			width: 30px;
		}
	}
	.active {
		border: 2px solid #00a6fa;
		border-radius: 4px;
	}
</style>