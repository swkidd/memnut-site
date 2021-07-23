import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'
import User from '@/models/User'
import Palace from '@/models/Palace'
import Marker from '@/models/Marker'
import Memage from '@/models/Memage'
import Mem from '@/models/Mem'
import MarkerMem from '@/models/MarkerMem'
import Post from '@/models/Post'

Vue.use(Vuex)

// Create a new instance of Database.
const database = new VuexORM.Database()

// Register Models to Database.
database.register(User)
database.register(Palace)
database.register(Marker)
database.register(Memage)
database.register(Mem)
database.register(MarkerMem)
database.register(Post)

// Create Vuex Store and register database through Vuex ORM.
const store = new Vuex.Store({
  plugins: [VuexORM.install(database)]
})

export default store