import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'
import User from '@/models/User'
import Marker from '@/models/Marker'
import Mem from '@/models/Mem'
import Comment from '@/models/Comment'

Vue.use(Vuex)

// Create a new instance of Database.
const database = new VuexORM.Database()

// Register Models to Database.
database.register(User)
database.register(Marker)
database.register(Mem)
database.register(Comment)

// Create Vuex Store and register database through Vuex ORM.
const store = new Vuex.Store({
  plugins: [VuexORM.install(database)]
})

export default store