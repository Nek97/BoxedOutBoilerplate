// @ts-nocheck
export class PubSubService {
  private static instance: PubSubService;
  
  static init(config: any) {
    if (!this.instance) {
      this.instance = new PubSubService();
    }
  }

  static getInstance() {
    return this.instance;
  }

  getPub() {
    return { quit: (cb: any) => cb(null, 'OK'), publish: () => {} };
  }

  getSub() {
    return { quit: (cb: any) => cb(null, 'OK'), subscribe: () => {}, on: () => {} };
  }
}
