<template>
  <v-container pa-0>
    <v-flex xs12 sm12 md12>
      <v-container>
        <v-text>カラオケ館 フリータイム </v-text>
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
        </v-layout row wrap>
      </v-container>
    </v-flex>
    <v-list two-line>
      <template v-for="(dataset, index) in datasets">
        <v-list-tile
          :key="dataset.id"
          @click=""
        >
          <v-list-tile-content>
            <v-list-tile-title>{{ dataset.name }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ dataset.address }}</v-list-tile-sub-title>
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
    datasets: tokyo,
  }),
  components: {
  },
  methods:{
    search(){
      const nameRegExp = new RegExp(this.name);
      const date = new Date(this.date);
      const tomorrow = new Date(this.date); tomorrow.setDate(tomorrow.getDate()+1);
      const holiday = JapaneseHolidays.isHoliday(date);
      const tomorrowholiday = JapaneseHolidays.isHoliday(tomorrow);
      const jday = JapaneseHolidays.getJDay(date);
      this.attributes = `
        祝日: ${holiday}
        祝前日: ${tomorrowholiday}
        曜日: ${jday}
      `;
      this.datasets = tokyo.filter(v=>{
        if(nameRegExp.test(v.name)){
          return true;
        }else{
          return false;
        }
      });
    }
  }
}
</script>
