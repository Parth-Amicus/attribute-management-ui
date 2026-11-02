
export interface CanComponentDeactivate {
  canDeactivate: () => boolean;
}
//any component using this this guard must provide the canDeactivate() method 