<template>
  <div class="drop-container">
      <div @click="$emit('chosen-city',item)" class="d-flex option-card" v-for="(item,index) in data" :key="index">
        <div class="cityName">
            {{item.name}}, {{item.country}}
        </div>
        <div v-if="getTemperature(item.lat,item.lng,index) && temperatures.length > 0"  class="detailsSection d-flex">
            <div>
                <div class="bold">{{temperatures[index].data.main.temp | degrees}}&#xb0;C</div>
                <span class="forecast">{{temperatures[index].data.weather[0].main}}</span>
            </div>
            <div class="align-center">
                <img v-if="temperatures[index].data.weather[0].main === 'Clear'" class="forecast-img" src="../assets/sun.svg" alt="clear">
                <img v-else class="forecast-img" src="../assets/sun.svg" alt="clear">
            </div>
        </div>
      </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
    name: 'SearchDropComponent',
    props: ['data'],
    data: function () {
		return {
            temperatures: [],
		 }
    },
    filters: {
        formatDate (value) {
            if(value !== null) {
                return moment(value).format('MM/DD/YYYY')
            } else {
                return "-"
            }
        },
        degrees (value) {
           return Math.round(value)
        },
    },
    methods: {
        getTemperature(lat, lng, index) {
           axios
            .get("https://api.openweathermap.org/data/2.5/weather?", {
                params: {
                    lat: lat,
                    lon: lng,
                    units: 'metric',
                    appid: '45c00ecef902587f86780c4672fbfc3b'
                }
            })
            .then( res=> {
                this.temperatures[index] = res;
            })
            .catch(function(error) {
                console.log(error);
            })
            return true
         }
    },
    created () {},
}
</script>

<style lang='less'>
@import "../app.less";
// Large devices (laptops/desktops, 992px and up)
@large-devices: ~"only screen and (min-width: 992px)";
// Extra large
@extra-large: ~"only screen and (min-width: 1200px)";
.drop-container {
    position: absolute;
    top: 55px;
    background: white;
    width: 100%;
    color: #000;
    border-radius: 8px;
    box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.2);
    @media @large-devices, @extra-large {
        width: 50%;
        justify-content: center;
    }
    .option-card {
        padding: 10px 15px;
        border-bottom: 1px solid #d4d4d4;
        align-content: center;
        justify-content: space-between;

        &:last-child {
            border-radius: 8px;
        }
        .forecast {
            font-size: 12px;
            font-weight: 500;
            color: #919393;
        }
        .forecast-img {
            height: 30px;
            width: 30px;
            margin-left: 10px;
        }
    }
    .cityName {
        align-self: center;
    } 
    .detailsSection {
        align-self: center;
        text-align: right;

    }
}
</style>