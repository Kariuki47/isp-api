USE radius;

DELIMITER $$
USE `radius`$$

CREATE PROCEDURE `mpesaAdd` (
  IN _txntype varchar(200), 
  IN _txnid varchar(200), 
  IN _paymentdate datetime, 
  IN _paymentamount varchar(200), 
  IN _businessshortcode varchar(200), 
  IN _refno varchar(200), 
  IN _invno varchar(200), 
  IN _businessaccbalance varchar(200), 
  IN _thirdpartytransID varchar(200), 
  IN _payerphone varchar(200), 
  IN _firstname varchar(200), 
  IN _middlename varchar(200), 
  IN _lastname varchar(200), 
  IN _paymentstatus varchar(200)
)
BEGIN 
    INSERT INTO billing_mpesa (txn_type, txn_id, payment_date, payment_amount, business_shortcode, ref_no, inv_no, business_acc_balance, third_party_trans_ID, payer_phone, first_name, middle_name, last_name, payment_status)
    VALUES (_txntype, _txnid, _paymentdate, _paymentamount, _businessshortcode, _refno, _invno, _businessaccbalance, _thirdpartytransID, _payerphone, _firstname, _middlename, _lastname, _paymentstatus);
END