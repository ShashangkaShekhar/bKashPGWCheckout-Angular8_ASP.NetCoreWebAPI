import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DataService } from '../shared/service';

declare var bKash: any;

@Component({
    selector: 'app-home',
    templateUrl: './app/home/component.html',
    providers: [DataService]
})

export class HomeComponent implements OnInit, AfterViewInit {
    public title: any;
    public token: any;
    public transResult: any;

    //API
    public _genTokenUrl: string = 'api/bkash/getbKashToken';
    public _bkPayCreateUrl: string = 'api/bKash/createPayment';
    public _bkPayExecuteUrl: string = 'api/bKash/executePayment';
    public _bkPaySaveUrl: string = 'api/bKash/savePayment';

    constructor(
        private titleService: Title,
        private _dataService: DataService) {
    }

    ngOnInit() {
        this.titleService.setTitle("Home");
        this.title = 'Angular8';
    }

    ngAfterViewInit() {
        this.genToken();
    }

    //Generate bKash Authorization Token
    genToken() {
        let result: any;
        this._dataService.get(this._genTokenUrl)
            .subscribe(response => {
                result = response;
                let resdata = result.resdata;
                if (resdata!= null)
                    this.initBkash(resdata);            
            }, error => {
                console.log(error);
            });    
    }

    //bKash Checkout
    initBkash(resdata) {
        let dataService = this._dataService;
        let bkPayCreateUrl = this._bkPayCreateUrl;
        let bkPayExecuteUrl = this._bkPayExecuteUrl;

        //Pay Amount
        let amount = 231.00; //Change Amount

        //Authorization Token
        this.token = JSON.parse(resdata.authToken).id_token;

        //Create PaymentModel
        let createPayModel = {
            authToken: this.token,
            amount: amount,
            intent: resdata.intent,
            currency: resdata.currency,
            merchantInvoiceNumber: resdata.merchantInvoiceNumber
        };

        //Execute PaymentModel
        let executePayModel = {
            authToken: this.token,
            paymentID: null
        };

        //Init bKash
        bKash.init({
            paymentMode: 'checkout', 
            paymentRequest: {
                "amount": amount,
                "intent": resdata.intent,
                "currency": resdata.currency,
                "merchantInvoiceNumber": resdata.merchantInvoiceNumber
            },
            //Payment Process
            createRequest: function () {
                dataService.save(createPayModel, bkPayCreateUrl)
                    .subscribe(response => {
                        var data = JSON.parse(response.resdata);
                        if (data && data.paymentID != null) {
                            executePayModel.paymentID = data.paymentID;

                            //Call iFrame
                            data.errorCode = null;
                            data.errorMessage = null;
                            bKash.create().onSuccess(data);
                        }
                        else {
                            bKash.create().onError(); 
                        }
                    }, error => {
                        bKash.create().onError(); 
                    });
            },
            //Payment Execute
            executeRequestOnAuthorization: function () {
                $('#payment_status').val('');
                dataService.save(executePayModel, bkPayExecuteUrl)
                    .subscribe(response => {
                        $('#close_button').click();
                        this.result = JSON.parse(response.resdata);
                        if (this.result && this.result.paymentID != null) {
                            $('#bKashFrameWrapper').fadeOut(); 

                            //Save to Database
                            localStorage.setItem('paymentresult', JSON.stringify(this.result));
                            $('#hiddenButton').click();
                        } else {
                            bKash.execute().onError();                      
                        }
                    }, error => {
                        bKash.execute().onError(); 
                    });
            },
            //On Success
            onSuccess: function(){},
            //Close
            onClose: function () {}
        });
        
        $('#bKash_button').removeAttr('disabled'); 
    }

    savePayment() {
        var paydata = JSON.parse(localStorage.getItem('paymentresult'));
        this.transResult = JSON.stringify(paydata);
        if(paydata!=null)
        {
            this._dataService.save(paydata, this._bkPaySaveUrl)
                .subscribe(response => {
                    if(response != null) 
                        alert(response.resdata);
                }, error => {
                    console.log(error);
                }); 
                
            localStorage.removeItem('paymentresult');
        }
    }
}
