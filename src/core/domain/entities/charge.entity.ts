import { ChargeStatus } from "../enums/charge-status.enum";
import { PaymentMethod } from "../enums/payment-method-enum";

export class Charge {
  private _id: string;
  private _userId: string;
  private _amount: number;
  private _currency: string;
  private _method: PaymentMethod;
  private _status: ChargeStatus;
  private _pixKey?: string;
  private _cardNumber?: string;
  private _cardHolderName?: string;
  private _installments?: number;
  private _dueDate?: Date;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: {
    id: string;
    userId: string;
    amount: number;
    currency?: string;
    method: PaymentMethod;
    status?: ChargeStatus;
    pixKey?: string;
    cardNumber?: string;
    cardHolderName?: string;
    installments?: number;
    dueDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this._id = props.id;
    this._userId = props.userId;
    this._amount = props.amount;
    this._currency = props.currency || 'BRL';
    this._method = props.method;
    this._status = props.status || ChargeStatus.PENDING;
    this._pixKey = props.pixKey;
    this._cardNumber = props.cardNumber;
    this._cardHolderName = props.cardHolderName;
    this._installments = props.installments;
    this._dueDate = props.dueDate;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  get id() { return this._id; }
  get customerId() { return this._userId; }
  get amount() { return this._amount; }
  get currency() { return this._currency; }
  get method() { return this._method; }
  get status() { return this._status; }
  get pixKey() { return this._pixKey; }
  get cardNumber() { return this._cardNumber; }
  get cardHolderName() { return this._cardHolderName; }
  get installments() { return this._installments; }
  get dueDate() { return this._dueDate; }
  get createdAt() { return this._createdAt; }
  get updatedAt() { return this._updatedAt; }

  markAsPaid() {
    this._status = ChargeStatus.PAID;
    this._updatedAt = new Date();
  }

  markAsFailed() {
    this._status = ChargeStatus.FAILED;
    this._updatedAt = new Date();
  }

  markAsExpired() {
    this._status = ChargeStatus.EXPIRED;
    this._updatedAt = new Date();
  }

  markAsCancelled() {
    this._status = ChargeStatus.CANCELLED;
    this._updatedAt = new Date();
  }

  validatePaymentData(): string[] {
    const errors: string[] = [];

    switch (this._method) {
      case PaymentMethod.PIX:
        if (!this._pixKey) {
          errors.push('Chave PIX é obrigatória para pagamento via PIX');
        }
        break;

      case PaymentMethod.CREDIT_CARD:
        if (!this._cardNumber) {
          errors.push('Número do cartão é obrigatório');
        }
        if (!this._cardHolderName) {
          errors.push('Nome do portador é obrigatório');
        }
        if (!this._installments || this._installments < 1 || this._installments > 12) {
          errors.push('Parcelas devem ser entre 1 e 12');
        }
        break;

      case PaymentMethod.BANK_SLIP:
        if (!this._dueDate) {
          errors.push('Data de vencimento é obrigatória para boleto');
        } else if (this._dueDate <= new Date()) {
          errors.push('Data de vencimento deve ser futura');
        }
        break;

      default:
        errors.push('Método de pagamento inválido');
    }

    return errors;
  }

  canBeProcessed(): boolean {
    return this._status === ChargeStatus.PENDING && this.validatePaymentData().length === 0;
  }

  static createPixCharge(props: {
    customerId: string;
    amount: number;
    pixKey: string;
    currency?: string;
  }): Partial<Charge> & Pick<Charge, 'customerId' | 'amount' | 'currency' | 'method' | 'status' | 'pixKey'> {
    return {
      customerId: props.customerId,
      amount: props.amount,
      currency: props.currency || 'BRL',
      method: PaymentMethod.PIX,
      status: ChargeStatus.PENDING,
      pixKey: props.pixKey,
    };
  }

  static createCreditCardCharge(props: {
    customerId: string;
    amount: number;
    cardNumber: string;
    cardHolderName: string;
    installments: number;
    currency?: string;
  }): Partial<Charge> & Pick<Charge, 'customerId' | 'amount' | 'currency' | 'method' | 'status' | 'cardNumber' | 'cardHolderName' | 'installments'> {
    return {
      customerId: props.customerId,
      amount: props.amount,
      currency: props.currency || 'BRL',
      method: PaymentMethod.CREDIT_CARD,
      status: ChargeStatus.PENDING,
      cardNumber: props.cardNumber,
      cardHolderName: props.cardHolderName,
      installments: props.installments,
    };
  }

  static createBankSlipCharge(props: {
    customerId: string;
    amount: number;
    dueDate: Date;
    currency?: string;
  }): Partial<Charge> & Pick<Charge, 'customerId' | 'amount' | 'currency' | 'method' | 'status' | 'dueDate'> {
    return {
      customerId: props.customerId,
      amount: props.amount,
      currency: props.currency || 'BRL',
      method: PaymentMethod.BANK_SLIP,
      status: ChargeStatus.PENDING,
      dueDate: props.dueDate,
    };
  }
}
