export interface HoloSuiteAppRegistration {
  id: string;
  title: string;
  icon: string;
  premium?: boolean;
  playerVisible?: boolean;
  description?: string;
  featureId?: string;
  open: () => unknown | Promise<unknown>;
}
