<template>
  <b-table :items=releases :fields=fields>

    <template v-slot:cell(videos)="{value}">
      <div v-for="video in value" :id="'player_' + getVideoId(video.uri)"></div>
    </template>
  </b-table>
</template>

<script>
import axios from 'axios'
import YTPlayer from 'yt-player'

export default {
  name: 'app',
  data () {
    return {
      releases: [],
      newReleases: [],
      fields: ['title', 'artists', 'videos'],
      currentPage: 1,
      playerList: []
    }
  },
  mounted () {
    this.getInventory()
    this.scroll()
  },
  updated () {
    if (this.newReleases) {
      this.createPlayers(this.newReleases)
      this.newReleases = []
    }
  },
  methods: {
    getInventory () {
      var $this = this
      axios.get('http://localhost:5000/discogs/inventory/WaxPistolsRecords?page=' + this.currentPage)
        .then(function (response) {
          $this.releases.push.apply($this.releases, response.data)
          $this.$forceUpdate()
          $this.newReleases = response.data
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    createPlayers (releases) {
      var players = []
      for (var release of releases) {
        for (var video of release.videos ||  []) {
          console.log(video.uri)
          var id = this.getVideoId(video.uri)
          console.log(id)
          var player = {ytplayer: new YTPlayer('#player_' + id), id: id}
          players.push(player)
        }
      }
      for (var player of players) {
        player.ytplayer.load(player.id)
      }
    },
    getVideoId (url) {
      url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
      return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
    },
    scroll () {
      window.onscroll = () => {
        let bottomOfWindow = document.documentElement.scrollTop + window.parent.innerHeight >= document.documentElement.offsetHeight - 1;

        console.log(document.documentElement.scrollTop + window.innerHeight)
        console.log(document.documentElement.offsetHeight - 1)
        if (bottomOfWindow) {
          this.currentPage = this.currentPage + 1 
          this.getInventory()
        }
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
