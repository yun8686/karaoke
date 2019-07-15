<template>
  <v-container pa-0>
    <v-flex xs12 sm12 md12>
      <v-container>
        <h1>カラオケ館 フリータイム </h1>
        <v-text-field key="name" v-model="name" label="店舗名" v-on:change="search"></v-text-field>
        <v-menu
          :close-on-content-click="true"
          :nudge-right="40"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="date"
              label="日付"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date" @input="menu2 = false" v-on:change="search"></v-date-picker>
        </v-menu>
        <v-layout row wrap>
          <v-flex xs4 sm4 md4>
            <v-switch v-model="student" label="学生" input-value="true" color="red" value></v-switch>
          </v-flex>
          <v-flex xs4 sm4 md4>
            <v-switch v-model="member" label="会員" input-value="true" color="red" value></v-switch>
          </v-flex>
          <v-flex xs4 sm4 md4>
           <p>{{this.attributes}}</p>
         </v-flex>

         <v-flex xs5 sm5 md5 style="align-self: center;">
           <v-btn-toggle dark v-model="times" multiple>
             <v-btn  value="daytime" color="orange">
               昼時間
             </v-btn>
             <v-btn value="nighttime" color="blue">
               夜時間
             </v-btn>
           </v-btn-toggle>
         </v-flex>
         <v-flex xs7 sm7 md7>
           <v-switch v-model="freedrink" label="フリードリンクのみ" color="red"></v-switch>
         </v-flex>

        </v-layout>
      </v-container>
    </v-flex>
    <v-list three-line>
      <template v-for="(dataset, index) in datasets">
        <v-list-tile
          :key="dataset.id+index"
          @click=""
        >
          <v-list-tile-content>
            <v-list-tile-title>{{ dataset.name }} ({{dataset.start}}:00 ~ {{dataset.end}}:00)</v-list-tile-title>
            <v-list-tile-sub-title>会員: 500円　一般: 500円</v-list-tile-sub-title>
            <v-list-tile-sub-title>学生会員: 500円　学生一般: 500円</v-list-tile-sub-title>
            <v-list-tile-sub-title style="color:red" v-if="dataset.drink==1">フリードリンク</v-list-tile-sub-title>
            <v-list-tile-sub-title v-else-if="dataset.drink==0">１ドリンク制</v-list-tile-sub-title>
            <v-list-tile-sub-title v-else>ドリンク注文不要</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn icon>
              <v-icon large color="blue darken-2">chat</v-icon>
            </v-btn>
            <p>0件</p>
          </v-list-tile-action>
        </v-list-tile>


        <v-divider
          :key="index"
        ></v-divider>
      </template>
    </v-list>
  </v-container>
</template>

<script>
import header from '../assets/header.json';
import tokyo from '../assets/tokyo.json';
import tokyo_price from '../assets/tokyo_price.json';
import JapaneseHolidays from 'japanese-holidays';

export default {
  layout: 'no_header',
  data: ()=>({
    name: "",
    date: null,
    student: false,
    member: true,
    attributes: "aaa",
    headers: header,
    datasets: [],
    times: ["daytime", "nighttime"],
    freedrink: false,
  }),
  mounted: function(){
    tokyo_price.forEach(w=>{
      Object.assign(w, tokyo.find(v=>v.id==w.id));
    });
    this.search();
  },
  components: {
  },
  watch:{
    freedrink: function(){this.search()},
    times: function(){this.search()},
  },
  methods:{
    search(){
      const nameRegExp = new RegExp(this.name);
      const date = new Date(this.date);
      const tomorrow = new Date(this.date); tomorrow.setDate(tomorrow.getDate()+1);
      const holiday = JapaneseHolidays.isHoliday(date);
      const tomorrowholiday = JapaneseHolidays.isHoliday(tomorrow);
      const jday = JapaneseHolidays.getJDay(date);
      const freedrink = this.freedrink;
      const times = this.times; // daytime, nighttime
      this.attributes = `
        祝日: ${holiday}
        祝前日: ${tomorrowholiday}
        曜日: ${jday}
        フリードリンク: ${freedrink}
        時間: ${times}
      `;
      this.datasets = tokyo_price.filter(v=>{
        const day = tomorrowholiday?8:(holiday?7:jday);
        if(!nameRegExp.test(v.name)) return false;
        if(v.day.indexOf(day)==-1) return false;
        if(freedrink && v.drink==0) return false;
        if(times.indexOf('daytime')==-1){
          if(v.start<16) return false;
        }
        if(times.indexOf('nighttime')==-1){
          if(v.start>=16) return false;
        }
        return true;
      });
    }
  }
}
</script>
