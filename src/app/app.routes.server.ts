import { RenderMode, ServerRoute } from '@angular/ssr';
//used for routing on server
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
