import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "palace",
    component: () => import("@/views/PalaceView"),
    props: true,
  },
  {
    path: "/palace/:id",
    name: "map",
    component: () => import("@/views/MapView"),
    props: true,
  },
  {
    path: "/posts",
    name: "posts",
    component: () => import("@/views/PostView"),
  },
  {
    path: "/post/:id",
    name: "post-detail",
    component: () => import("@/views/PostDetailView"),
    props: true,
  },
  {
    path: "/post-quiz/:id",
    name: "post-quiz",
    component: () => import("@/views/PostQuizView"),
    props: true,
  },
  {
    path: "/memages",
    name: "memages",
    component: () => import("@/views/MemView"),
  },
  {
    path: "/memage/:id",
    name: "memage-detail",
    component: () => import("@/views/MemageDetailView"),
    props: true,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
