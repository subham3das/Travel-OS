export interface CreateOrderParams {
  amountPaise: number;
  currency: string;
  receipt: string;
  notes?: Record<string, any>;
}

export interface GatewayOrderResult {
  orderId: string;
  amount: number;
  currency: string;
  receipt?: string;
  status?: string;
}

export interface CreateTransferParams {
  paymentId: string;
  recipientAccountId: string; // Razorpay Linked Account ID (acc_...) or Fund Account ID
  amountPaise: number;
  currency: string;
  notes?: Record<string, any>;
  onHold?: boolean;
  onHoldUntil?: number;
}

export interface GatewayTransferResult {
  transferId: string;
  recipientAccountId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processed' | 'failed' | 'reversed';
  rawResponse?: any;
}

export interface ReverseTransferParams {
  transferId: string;
  amountPaise?: number;
  notes?: Record<string, any>;
}

export interface GatewayReverseResult {
  reversalId: string;
  transferId: string;
  amount: number;
  status: string;
  rawResponse?: any;
}

export interface CreateContactParams {
  name: string;
  email?: string;
  phone?: string;
  type: 'vendor' | 'customer' | 'employee' | 'self';
  referenceId?: string;
  notes?: Record<string, any>;
}

export interface CreateFundAccountBankParams {
  contactId: string;
  accountType: 'bank_account';
  bankAccount: {
    name: string;
    ifsc: string;
    account_number: string;
  };
}

export interface CreateLinkedAccountParams {
  email: string;
  phone?: string;
  legalBusinessName: string;
  businessType: string;
  contactName: string;
  notes?: Record<string, any>;
}

export interface IPaymentGateway {
  createOrder(params: CreateOrderParams): Promise<GatewayOrderResult>;
  verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean;
  verifyWebhookSignature(rawBody: string | Buffer, signature: string): boolean;
  fetchPayment(paymentId: string): Promise<any>;
  refundPayment(paymentId: string, amountPaise?: number, notes?: Record<string, any>): Promise<any>;
}

export interface ITransferProvider {
  createTransfer(params: CreateTransferParams): Promise<GatewayTransferResult>;
  reverseTransfer(params: ReverseTransferParams): Promise<GatewayReverseResult>;
  fetchTransfer(transferId: string): Promise<any>;
}

export interface ISettlementProvider {
  fetchSettlement(settlementId: string): Promise<any>;
  fetchSettlements(options?: { from?: number; to?: number; count?: number; skip?: number }): Promise<any>;
}

export interface IRouteAccountProvider {
  createContact(params: CreateContactParams): Promise<{ id: string; [key: string]: any }>;
  createFundAccount(params: CreateFundAccountBankParams): Promise<{ id: string; [key: string]: any }>;
  createLinkedAccount(params: CreateLinkedAccountParams): Promise<{ id: string; [key: string]: any }>;
}
