export class Attachment {
  disposition: string;

  constructor(
    public content: string,
    public filename: string,
    public type: string,
    disposition?: string,
  ) {
    this.disposition = disposition || 'attachment';
  }
}

export class Address {
  constructor(public email: string, public name?: string) {}
}

export class Mail {
  constructor(
    public to: Array<Address>,
    public subject: string,
    public html: string,
    public attachments?: Attachment[],
    public from?: Address,
    public cc?: Array<Address>,
  ) {}
}
