export class Singleton {
    private static instance: any;

    protected constructor() {}

    static getInstance<T extends { new(...args: any[]): {} }>(this: T): InstanceType<T> {
        if (!this.instance) {
            this.instance = new this();
        }
        return this.instance;
    }
}
