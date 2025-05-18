interface IService<T>{
  getItem: (key: string) => T;
  setItem: (key: string, value: string) => void;
}

type IServiceName = "localStorage" | "sessionStorage";

export default class StorageManager<T> {
  service!: IService<T>;

  constructor(private serviceName: IServiceName, private storageKey: string) {
    this.determineService(this.serviceName);
  }

  determineService(serviceName: IServiceName): void {
    if (serviceName === "localStorage" || serviceName === "sessionStorage") {
      this.serviceName = serviceName;
      return;
    }

    throw new Error("Storage manager service is not defined");
  }

  get(): T | null {
    const data = window[this.serviceName].getItem(this.storageKey) as string;
    return data ? JSON.parse(data) : null;
  }

  save(data: T): void {
    window[this.serviceName].setItem(this.storageKey, JSON.stringify(data));
  }

  remove(): void {
    window[this.serviceName].setItem(this.storageKey, "");
  }
}