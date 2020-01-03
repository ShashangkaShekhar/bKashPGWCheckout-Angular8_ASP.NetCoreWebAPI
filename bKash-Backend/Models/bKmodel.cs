using System;
using System.Collections.Generic;
using System.Text;

namespace Models
{
    public class bKmodel
    {
        public string authToken { get; set; }
        public string appKey { get; set; }
        public string currency { get; set; }
        public decimal amount { get; set; }
        public string merchantInvoiceNumber { get; set; }
        public string intent { get; set; }
        public string paymentID { get; set; }
        public string createTime { get; set; }
        public string updateTime { get; set; }
        public string trxID { get; set; }
        public string transactionStatus { get; set; }
    }
}
