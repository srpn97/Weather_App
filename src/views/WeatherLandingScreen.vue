<template>
  <div class="container">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <div class="search-container">
      <div class="searchBox-container">
        <img class="location-pin" src="../assets/pin.svg" alt="location_pin" />
        <input
          @input="
            filterCities();
            showDropDown = true;
          "
          @focus="searchContent = ''"
          type="text"
          name="searchBox"
          id="searchBox"
          class="search-box"
          v-model="searchContent"
        />
        <button @click="focusOnSearch" type="submit" class="searchButton">
          <i class="fa fa-search"></i>
        </button>
      </div>
      <transition name="dropdown">
        <SearchDropComponent
          v-show="showDropDown"
          @chosen-city="refreshData"
          v-if="filteredData.length > 0 && filteredData.length < 12"
          :data="filteredData"
        />
      </transition>
    </div>
    <div v-if="dailyWeather.length > 1" class="cards-container">
      <CardsComponent @card-changed="changeDetails" :data="dailyWeather" />
    </div>
    <div class="details-card">
      <div class="graph-scroll">
        <div class="graph">
          <GraphComponent
            v-if="temperatures.length > 1"
            :chartData="temperatures"
            :options="chartOptions"
            :chartColors="positiveChartColors"
            label="temparature"
          />
        </div>
      </div>
      <!-- <line-chart height="500px"  :discrete="true" :round="2" :zeros="true" :data="labelsX" ></line-chart> -->
      <!-- <canvas id="myChart"></canvas> -->
      <div class="card d-flex justify-between">
        <div class="big-font">26&#xb0;C</div>
        <div>
          <img
            src="../assets/sun.svg"
            height="70"
            width="70"
            class="card-img"
            alt=""
          />
        </div>
      </div>
      <div class="d-flex justify-between">
        <div class="pressure-card">
          <div class="bold">Pressure</div>
          <div>{{ detailCardDetails.pressure }} hpa</div>
        </div>
        <div class="humidity-card">
          <div class="bold">Humidity</div>
          <div>{{ detailCardDetails.humidity }} %</div>
        </div>
      </div>
      <div class="d-flex justify-between">
        <div class="sunrise-card">
          <div class="bold">Sunrise</div>
          <div>{{ detailCardDetails.sunrise | formatDate }}</div>
        </div>
        <div class="sunset-card">
          <div class="bold">Sunset</div>
          <div>{{ detailCardDetails.sunset | formatDate }}</div>
        </div>
      </div>
    </div>
    <div v-if="isLoading">
      <pre-loader></pre-loader>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Preloader from "@/components/Preloader.vue";
import SearchDropComponent from "@/components/SearchDropComponent.vue";
import CardsComponent from "@/components/CardsComponent.vue";
import GraphComponent from "@/components/GraphComponent.vue";
import axios from "axios";
import moment from "moment";
import cities from "cities.json";

export default {
  name: "WeatherLandingScreen",
  components: {
    SearchDropComponent,
    CardsComponent,
    GraphComponent,
    "pre-loader": Preloader,
  },
  filters: {
    formatDate(value) {
      if (value !== null) {
        return moment.unix(value).format("hh:mm A");
      } else {
        return "-";
      }
    },
    degrees(value) {
      return Math.round(value);
    },
  },
  data: function () {
    return {
      isLoading: false,
      searchContent: "",
      showDropDown: false,
      dailyWeather: [],
      citiesList: cities,
      filteredData: [],
      limit: 5,
      activeCard: [],
      temperatures: [],
      positiveChartColors: {
        borderColor: "#00a6fa",
        pointBorderColor: "#00a6fa",
        pointBackgroundColor: "#fff",
        backgroundColor: "#fff",
      },
      chartOptions: {
        maintainAspectRatio: false,
        scaleShowVerticalLines: false,
        legend: {
            display: false
         },
        scales: {
            yAxes: [{
                gridLines : {
                    display: false,
                    drawOnChartArea: false,
                    drawTicks: false,
                    drawBorder: false,
                },
                ticks: {
                    display: false,
                    min: 0,
                    max: 50,
                    maxTicksLimit: 2,
                    beginAtZero: true,
                }
            }]
        }
      },
      labelsX: [],
      detailCardDetails: [],
    };
  },
  created() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        this.getLocation(pos.coords.latitude, pos.coords.longitude);
      });
    } else {
      window.alert("Geolocation is not supported by this browser.");
    }
  },
  methods: {
    filterCities() {
      this.filteredData = this.citiesList.filter((x) =>
        x.name.toLowerCase().includes(this.searchContent.toLowerCase())
      );
    },
    focusOnSearch() {
      var ele = document.getElementById('searchBox');
      ele.focus();
    },
    activateCard(index) {
      this.activeCard.forEach((x) => {
        x = false;
      });
      this.activeCard[index] = true;
    },
    refreshData(value) {
      this.getLocation(value.lat, value.lng);
      this.showDropDown = false;
    },
    changeDetails(value) {
      this.detailCardDetails = value;
    },
    getLocation(lat, lon) {
      this.isLoading = true;
      this.lat = lat;
      this.long = lon;
      axios
        .get(
          "https://nominatim.openstreetmap.org/reverse.php?lat=20.00000&lon=0.00000&zoom=18&format=jsonv2",
          {
            params: {
              lat: this.lat,
              lon: this.long,
              zoom: 18,
              format: "jsonv2",
            },
          }
        )
        .then((res) => {
          this.searchContent =
            res.data.address.city + ", " + res.data.address.state;
        });
      axios
        .get("https://api.openweathermap.org/data/2.5/onecall?", {
          params: {
            lat: this.lat,
            lon: this.long,
            units: "metric",
            exclude: "minutely",
            appid: "45c00ecef902587f86780c4672fbfc3b",
          },
        })
        .then((res) => {
          this.dailyWeather = res.data.daily;
          this.detailCardDetails = res.data.daily[0];
          res.data.hourly.forEach((x, i) => {
            if (i < 23) {
              const date = moment.unix(x.dt).format("hh:mm A");
              this.temperatures.push({ date, temps: x.temp });
            }
          });
          this.isLoading = false;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};
</script>
<style lang="less">
// Large devices (laptops/desktops, 992px and up)
@large-devices: ~"only screen and (min-width: 992px)";
// Extra large
@extra-large: ~"only screen and (min-width: 1200px)";
.container {
  padding-left: 10px;
  padding-right: 10px;
}
.d-flex {
  display: flex;
}
.search-container {
  position: relative;
  @media @large-devices, @extra-large {
    display: flex;
    justify-content: center;
  }
}
.searchBox-container {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 1.5rem;
  @media @large-devices, @extra-large {
    width: 50%;
  }
  .search-box {
    width: 100%;
    border-radius: 8px;
    border: none;
    outline: none;
    display: block;
    height: 2rem;
    padding: 10px 5px 10px 50px;
    font-weight: 500;
    text-transform: capitalize;
    transition: box-shadow 0.2s ease;
    width: 100%;
    box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.2);
  }
  .searchButton {
    background: transparent;
    border: none;
    position: absolute;
    right: 1rem;
    margin: 0;
    font-size: 20px;
  }
  .location-pin {
    position: absolute;
    height: 30px;
    width: 30px;
    left: 1rem;
  }
}
.cards-container {
  display: flex;
  flex-flow: nowrap;
  overflow: scroll;
  @media @large-devices, @extra-large {
    justify-content: center;
  }
}
.activeCard {
  border: 1px solid black;
}
.big-font {
  font-size: 30pt;
  align-self: center;
  margin-left: 20px;
}
.details-card {
  .graph-scroll {
    overflow-x: auto;
    .graph {
      width: 1500px;
    }
  }
  .card {
    margin-top: 30px;
  }
  border-radius: 8px;
  box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.2);
  padding: 15px 0;
  @media @large-devices, @extra-large {
    justify-self: center;
    width: 50%;
    margin: auto;
  }
  .card-img {
    margin-right: 20px;
    align-self: center;
  }
  .pressure-card {
    margin-top: 20px;
    margin-left: 20px;
    align-self: center;
    text-align: left;
    background: #48c0e469;
    padding: 5px 5px;
    width: 40%;
    border-radius: 4px;
  }
  .humidity-card {
    margin-top: 20px;
    margin-right: 20px;
    align-self: center;
    text-align: left;
    background: #48c0e469;
    padding: 5px 5px;
    width: 40%;
    border-radius: 4px;
  }
  .sunrise-card {
    margin-top: 20px;
    margin-left: 20px;
    align-self: center;
    text-align: left;
    padding: 5px 5px;
    width: 40%;
    border-radius: 4px;
  }
  .sunset-card {
    margin-top: 20px;
    margin-right: 20px;
    align-self: center;
    text-align: left;
    padding: 5px 5px;
    width: 40%;
    border-radius: 4px;
  }
}
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.52s;
}
.dropdown-enter,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
