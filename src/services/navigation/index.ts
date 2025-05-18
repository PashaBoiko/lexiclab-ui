import { RouteLocationRaw, Router } from 'vue-router'

export function navigateTo(router: Router, path: RouteLocationRaw){
  return router.push(path);
}